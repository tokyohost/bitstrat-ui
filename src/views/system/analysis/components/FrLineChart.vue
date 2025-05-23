<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

interface Props {
  frDataMap: Record<string, number[]>;
  dateList: number[];
  selectedEx?: string[];
}

const props = defineProps<Props>();
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;
// 格式化时间戳
const formatDate = (ts: number): string => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
};

const getSelected = () => {
  const sdata: Record<string, boolean> = {};
  const keys = Object.keys(props.frDataMap);

  // 空数组或未传，默认全选中
  if (!props.selectedEx || props.selectedEx.length === 0) {
    keys.forEach((key) => (sdata[key] = true));
    return sdata;
  }

  // 有指定交易所，按 selectedEx 匹配（不区分大小写）
  const selectedSet = new Set(props.selectedEx.map((ex) => ex.toLowerCase()));
  keys.forEach((key) => {
    sdata[key] = selectedSet.has(key.toLowerCase());
  });

  return sdata;
};

// 获取图表配置项
const getOption = (): echarts.EChartsOption => {
  const formattedDates = props.dateList.map(formatDate);

  const series = Object.entries(props.frDataMap).map(([exchange, values]) => ({
    name: exchange,
    type: 'line',
    data: values,
    smooth: true
  }));

  return {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      type: 'scroll',
      top: 10,
      data: Object.keys(props.frDataMap),
      selected: getSelected()
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: formattedDates
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      {
        type: 'inside', // 鼠标滚轮缩放
        xAxisIndex: 0, // 应用于第几个x轴
        start: 0,
        end: 100
      },
      {
        type: 'slider', // 可视化滑动条
        xAxisIndex: 0,
        start: 0,
        end: 100
      }
    ],
    series
  };
};

// 初始化或更新图表
const renderChart = () => {
  if (!chartRef.value) return;
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value);
  }
  chartInstance.setOption(getOption(), true);

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize();
  });
  resizeObserver.observe(chartRef.value);
};

onMounted(() => {
  renderChart();
});

watch(() => [props.frDataMap, props.dateList], renderChart, { deep: true });

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  chartInstance?.dispose();
});
</script>
