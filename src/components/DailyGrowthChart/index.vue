<template>
  <el-card :shadow="'never'" class="w-full h-full">
    <div ref="chart" style="width: 100%; height: 400px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { queryDailyGrowthPercentageList } from '@/api/system/accountBalanceRecord';

const chart = ref<HTMLElement | null>(null);

const fetchData = async () => {
  const response = await queryDailyGrowthPercentageList({ days: 30 });

  // 确保 response.data 是一个数组
  const data = Array.isArray(response.data) ? response.data : [];

  const xAxisData = data.map((item) => item.recordDate);
  const seriesData = data.map((item) => {
    // 确保 growthPercentage 是数字类型
    const growthPercentage = parseFloat(item.growthPercentage);
    return isNaN(growthPercentage) ? 0 : growthPercentage; // 如果转换失败，设置为 0
  });

  return {
    xAxisData,
    seriesData
  };
};
// 日期显示优化
const formatterDate = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

onMounted(async () => {
  if (chart.value) {
    const myChart = echarts.init(chart.value);
    const { xAxisData, seriesData } = await fetchData();

    const option = {
      title: {
        text: '每日涨跌统计'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          // 优化 tooltip 显示内容
          const date = formatterDate(params[0].name); // 获取日期
          const growthPercentage = parseFloat(params[0].value); // 确保 value 是数字类型
          return `${date}<br/>涨幅百分比: ${isNaN(growthPercentage) ? '0' : growthPercentage.toFixed(2)}%`;
        }
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLabel: {
          rotate: 0, // 将日期横着显示
          formatter: (value: string) => {
            // 确保日期格式为 yyyy-MM-dd
            return formatterDate(value);
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%' // 显示百分比
        }
      },
      series: [
        {
          name: '涨幅百分比',
          type: 'bar',
          data: seriesData,
          itemStyle: {
            // 设置柱状图的颜色
            color: function (params) {
              return params.value > 0 ? '#28a745' : '#dc3545'; // 正数为绿色，负数为红色
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
});
</script>
