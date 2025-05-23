<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

interface Props {
  frDataMap: Record<string, number[]>;
  dateList: number[];
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
      data: Object.keys(props.frDataMap)
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
