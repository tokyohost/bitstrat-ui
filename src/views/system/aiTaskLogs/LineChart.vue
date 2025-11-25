<template>
  <div class="line-chart" :style="{ height: height }" ref="container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// Props
const props = defineProps({
  // x 轴类目数组，例如 ['2025-01-01', '2025-01-02']
  xData: {
    type: Array,
    default: () => []
  },
  // series 数组，格式：[{ name: '系列1', data: [..], smooth: true, area: false }]
  seriesData: {
    type: Array,
    default: () => []
  },
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示图例
  showLegend: {
    type: Boolean,
    default: true
  },
  // 提示：'auto' | 'currency' | 带unit字符串等
  tooltipUnit: {
    type: String,
    default: ''
  },
  // 颜色数组
  colors: {
    type: Array,
    default: () => ['#5470C6', '#91CC75', '#EE6666', '#FAC858']
  },
  // 容器高度，支持 '400px' 或 '100%'
  height: {
    type: String,
    default: '360px'
  },
  // 是否显示 loading
  loading: {
    type: Boolean,
    default: false
  },
  // 是否自适应容器 resize
  autoResize: {
    type: Boolean,
    default: true
  },
  // x 轴 文本旋转度数
  xLabelRotate: {
    type: Number,
    default: 0
  },
  // 格式化数值回调 (val, seriesName) => string
  valueFormatter: {
    type: Function,
    default: null
  },
  centerLine: {
    type: Boolean,
    default: false
  }
});

const container = ref(null);
let chart = null;
let resizeObserver = null;

// Build echarts series from seriesData prop
function buildSeries(seriesData) {
  return seriesData.map((s) => {
    const latestIndex = s.data.length - 1;
    const base = {
      name: s.name || 'series',
      type: 'line',
      data: s.data || [],
      smooth: !!s.smooth,
      symbol: s.symbol ?? 'circle',
      symbolSize: s.symbolSize ?? 6,
      // showSymbol: s.showSymbol ?? false,
      lineStyle: s.lineStyle ?? { width: 2 },
      // emphasis: { focus: 'series' },
      itemStyle: {
        color: (params) => (params.dataIndex === latestIndex ? '#f43f5e' : '#3b82f6')
      },
      label: {
        show: true,
        position: 'top',
        color: '#f43f5e',
        fontWeight: 'bold',
        formatter: (params) => (params.dataIndex === latestIndex ? params.value : '')
        // formatter: (params) => params.value
      },
      emphasis: { disabled: true }
    };
    if (s.area) {
      base.areaStyle = s.areaStyle ?? { opacity: 0.15 };
    }
    if (s.yAxisIndex) base.yAxisIndex = s.yAxisIndex;
    return base;
  });
}

// Default option builder
function buildOption() {
  const series = buildSeries(props.seriesData);
  if (props.centerLine) {
    series.push({
      type: 'line',
      markLine: {
        silent: true,
        data: [{ yAxis: 1000 }],
        lineStyle: { color: '#FF0000', type: 'dashed' },
        label: { formatter: '1000' }
      }
    });
  }
  series.push();
  const option = {
    color: props.colors,
    title: props.title ? { text: props.title, left: 'center' } : undefined,
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: function (params) {
        // params is array of series points
        // Build readable tooltip
        const axisLabel = params[0]?.axisValue ?? '';
        const lines = [`${axisLabel}`];
        params.forEach((p) => {
          const rawVal = p.data;
          const formatted = props.valueFormatter
            ? props.valueFormatter(rawVal, p.seriesName)
            : props.tooltipUnit
              ? `${rawVal} ${props.tooltipUnit}`
              : rawVal;
          lines.push(
            `<span style="display:inline-block;margin-right:8px;border-radius:10px;width:10px;height:10px;background-color:${p.color};"></span> ${p.seriesName}: ${formatted}`
          );
        });
        return lines.join('<br/>');
      }
    },
    legend: props.showLegend ? { top: 30 } : { show: false },
    grid: { left: 40, right: 20, top: props.title ? 60 : 40, bottom: 40, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xData,
      axisLabel: { rotate: props.xLabelRotate, formatter: (v) => v }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (v) {
          return props.tooltipUnit ? `${v}` : v;
        }
      },
      min: (val) => val.min - 2,
      max: (val) => val.max + 2
    },
    series
  };

  console.log('option', option);
  return option;
}

function checkCenterLine(option) {
  if (props.centerLine) {
    option.markLine = {
      silent: true,
      data: [{ yAxis: 1000 }],
      lineStyle: {
        color: '#FF0000',
        type: 'dashed'
      },
      label: {
        formatter: 'Baseline: 1000',
        position: 'end'
      }
    };
  }
}

function initChart() {
  if (!container.value) return;
  if (chart) {
    chart.dispose();
    chart = null;
  }
  chart = echarts.init(container.value);
  const option = buildOption();
  checkCenterLine(option);
  if (props.centerLine) {
    option.markLine = {
      silent: true,
      data: [{ yAxis: 1000 }],
      lineStyle: {
        color: '#FF0000',
        type: 'dashed'
      },
      label: {
        formatter: 'Baseline: 1000',
        position: 'end'
      }
    };
  }
  chart.setOption(option);
  if (props.loading) chart.showLoading();
  else chart.hideLoading();
}

function updateChart() {
  if (!chart) return;
  const option = buildOption();
  checkCenterLine(option);
  chart.setOption(option, { notMerge: false, lazyUpdate: true });
  if (props.loading) chart.showLoading();
  else chart.hideLoading();
}

onMounted(() => {
  nextTick(() => {
    initChart();

    // auto resize
    if (props.autoResize && container.value && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        chart && chart.resize();
      });
      resizeObserver.observe(container.value);
    } else if (props.autoResize) {
      window.addEventListener('resize', () => chart && chart.resize());
    }
  });
});

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value);
    resizeObserver = null;
  } else {
    window.removeEventListener('resize', () => chart && chart.resize());
  }
});

// watch props changes
watch(
  () => [props.xData, props.seriesData, props.title, props.colors, props.loading, props.xLabelRotate],
  () => {
    updateChart();
  },
  { deep: true }
);
</script>

<style scoped>
.line-chart {
  width: 100%;
  position: relative;
}
</style>
