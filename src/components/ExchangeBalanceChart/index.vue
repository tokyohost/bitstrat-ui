<template>
  <el-card :shadow="'never'" class="w-full h-full">
    <div ref="chart" style="width: 100%; height: 400px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { queryRecordsInDays } from '@/api/system/accountBalanceRecord';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const chart = ref<HTMLElement | null>(null);

const fetchData = async () => {
  const dataMap = await queryRecordsInDays({ days: 30 });
  const series = [];
  const xAxisData = new Set<string>();

  for (const [exchange, records] of dataMap.entries()) {
    const seriesData = records.map((record) => {
      // 确保 record.recordDate 是有效的日期字符串
      if (record.recordDate) {
        const date = new Date(record.recordDate);
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        xAxisData.add(formattedDate);
      }
      return record.balance;
    });

    series.push({
      name: exchange,
      type: 'line',
      smooth: true,
      data: seriesData,
      // 添加 tooltip 配置，显示具体数值
      tooltip: {
        valueFormatter: (value: any) => {
          const num = Number(value);
          return isNaN(num) ? '-' : num.toFixed(2);
        }
      }
    });
  }

  // 对 series 数据进行排序，将 sum 排在最前面
  series.sort((a, b) => {
    if (a.name === 'sum') return -1;
    if (b.name === 'sum') return 1;
    return 0;
  });

  // 将 xAxisData 转换为数组并排序
  const sortedXAxisData = Array.from(xAxisData).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return {
    xAxisData: sortedXAxisData,
    series
  };
};

onMounted(async () => {
  if (chart.value) {
    const myChart = echarts.init(chart.value);
    const { xAxisData, series } = await fetchData();

    const option = {
      title: {
        text: proxy.$t('home.totalAmount.title')
      },
      tooltip: {
        trigger: 'axis'
        // 配置 tooltip 显示格式
        // formatter: (params: any) => {
        //   let res = `${params[0].axisValue}<br>`;
        //   params.forEach((item: any) => {
        //     res += `${item.marker} ${item.seriesName}: ${item.value.toFixed(2)}<br>`;
        //   });
        //   return res;
        // }
      },
      legend: {
        data: series.map((s) => s.name)
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        // 配置 xAxis 显示日期
        axisLabel: {
          formatter: (value: string) => value // 直接显示已格式化的日期
        }
      },
      yAxis: {
        type: 'value'
      },
      series
    };

    myChart.setOption(option);
  }
});
</script>
