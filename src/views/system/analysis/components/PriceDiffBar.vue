<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, watch, ref, nextTick, computed, onUnmounted } from 'vue';

interface Props {
  priceA: number;
  priceB: number;
}
const props = defineProps<Props>();

const chartPlusRef = ref<HTMLDivElement | null>(null);
const chartMinusRef = ref<HTMLDivElement | null>(null);

let chart1: echarts.ECharts | null = null;
let chart2: echarts.ECharts | null = null;
const resizeObserver: ResizeObserver | null = null;

// 计算百分比差值
const abPercent = computed(() => {
  if (props.priceB === 0) return 0;
  return ((props.priceA - props.priceB) / props.priceB) * 100;
});

const baPercent = computed(() => {
  if (props.priceA === 0) return 0;
  return ((props.priceB - props.priceA) / props.priceA) * 100;
});

const renderCharts = () => {
  if (!chart1 || !chart2) return;

  chart1.setOption({
    tooltip: {
      formatter: `{b}: {c}%`
    },
    xAxis: { type: 'category', data: ['+A -B'] },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { formatter: '{value} %' }
    },
    series: [
      {
        type: 'bar',
        data: [abPercent.value > 0 ? +abPercent.value.toFixed(4) : 0],
        itemStyle: { color: '#2ecc71' },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%' // {c} 是当前柱状图的值
        }
      }
    ]
  });

  chart2.setOption({
    tooltip: {
      formatter: `{b}: {c}%`
    },
    xAxis: { type: 'category', data: ['+B -A'] },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { formatter: '{value} %' }
    },
    series: [
      {
        type: 'bar',
        data: [baPercent.value > 0 ? +baPercent.value.toFixed(4) : 0],
        itemStyle: { color: '#e74c3c' },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  });
  resizeObserver = new ResizeObserver(() => {
    chart1?.resize();
    chart2?.resize();
  });
  resizeObserver.observe(chartPlusRef.value);
  resizeObserver.observe(chartMinusRef.value);
};

onMounted(() => {
  nextTick(() => {
    if (chartPlusRef.value && chartMinusRef.value) {
      chart1 = echarts.init(chartPlusRef.value);
      chart2 = echarts.init(chartMinusRef.value);
      renderCharts();
    }
  });
});

// 监听价格变化自动更新
watch(() => [props.priceA, props.priceB], renderCharts);

onUnmounted(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="flex h-400px" style="flex-direction: column">
    <div style="display: flex; gap: 16px" class="h-full">
      <div ref="chartPlusRef" style="width: 50px; height: 100%" />
      <div ref="chartMinusRef" style="width: 50px; height: 100%" />
    </div>
    <div class="text-center">AB价差</div>
  </div>
</template>
