<template>
  <div class="chart-wrapper">
    <div class="line-chart" :style="{ height: height }" ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

// Props
const props = defineProps({
  xData: { type: Array, default: () => [] },
  seriesData: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  showLegend: { type: Boolean, default: true },
  tooltipUnit: { type: String, default: '' },
  // Web3 风格默认色板：青色、紫色、橙色
  colors: {
    type: Array,
    default: () => ['#00F5FF', '#7B61FF', '#F7931A', '#4ADE80']
  },
  height: { type: String, default: '360px' },
  loading: { type: Boolean, default: false },
  autoResize: { type: Boolean, default: true },
  xLabelRotate: { type: Number, default: 0 },
  valueFormatter: { type: Function, default: null },
  centerLine: { type: Boolean, default: false },
  baseLinePrice: { type: Number, default: 0 }
});

const container = ref(null);
let chart = null;
let resizeObserver = null;

// 创建线性渐变辅助函数
const createGradient = (color) => {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color }, // 顶部颜色
    { offset: 1, color: 'rgba(0,0,0,0)' } // 底部透明
  ]);
};

// 构建 Series
function buildSeries(seriesData) {
  return seriesData.map((s, index) => {
    const color = props.colors[index % props.colors.length];
    const latestIndex = s.data.length - 1;

    // 基础配置
    const base = {
      name: s.name || 'Price',
      type: 'line',
      data: s.data || [],
      smooth: true, // Web3 风格通常更喜欢平滑曲线
      showSymbol: false, // 默认隐藏数据点，保持干净
      symbol: 'circle',
      symbolSize: 8,
      yAxisIndex: s.yAxisIndex || 0,

      // 线条样式：加粗并添加发光效果
      lineStyle: s.lineStyle ?? {
        width: 3,
        shadowColor: color, // 发光颜色同线条色
        shadowBlur: 10, // 光晕模糊度
        shadowOffsetY: 0
      },

      // 区域填充：渐变色
      areaStyle: s.area
        ? {
            color: createGradient(hexToRgba(color, 0.4)), // 40% 透明度起始
            opacity: 1
          }
        : undefined,

      // 特殊处理最后一个点（当前价格/数值），添加呼吸灯效果
      markPoint: {
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#fff',
          borderColor: color,
          borderWidth: 2,
          shadowColor: color,
          shadowBlur: 15
        },
        label: { show: false },
        data: [
          { type: 'max', name: 'Max', symbolSize: 0, label: { show: false } }, // 占位
          { coord: [latestIndex, s.data[latestIndex]] } // 最后一个点
        ]
      },

      // 最后一个点的 Label 单独配置
      label: {
        show: true,
        position: 'right',
        distance: 10,
        color: color,
        fontWeight: 'bold',
        fontFamily: 'Monospace', // 等宽字体更有科技感
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: [4, 8],
        borderRadius: 4,
        formatter: (params) => {
          // 只有最后一个点显示数值
          return params.dataIndex === latestIndex ? params.value : '';
        }
      }
    };
    return base;
  });
}

// 辅助：Hex 转 RGBA
function hexToRgba(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  return hex;
}

function buildOption() {
  const series = buildSeries(props.seriesData);

  // 基准线逻辑（移动到 Series 内部）
  if (props.centerLine && series.length > 0) {
    // 我们可以给第一个系列添加 markLine，或者单独 push 一个透明系列
    if (!series[0].markLine) series[0].markLine = { data: [], symbol: 'none' };
    series[0].markLine.data.push({
      yAxis: props.baseLinePrice,
      label: {
        formatter: (params) => `Base: ${params.value}`,
        position: 'end',
        color: '#FF4D4F',
        fontSize: 10
      },
      lineStyle: {
        color: '#FF4D4F',
        type: 'dashed',
        width: 1,
        opacity: 0.8
      }
    });
  }

  const option = {
    // 背景透明，依靠 CSS 控制容器背景
    backgroundColor: 'transparent',
    color: props.colors,
    title: props.title
      ? {
          text: props.title,
          left: 'left',
          textStyle: { color: '#E0E0E0', fontSize: 14, fontWeight: 'normal' }
        }
      : undefined,

    // Web3 风格 Tooltip
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(18, 18, 24, 0.85)', // 深色半透明
      borderColor: '#333',
      textStyle: { color: '#eee', fontSize: 12 },
      padding: [10, 15],
      backdropFilter: 'blur(4px)', // 玻璃磨砂效果
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#555',
          type: 'dashed'
        }
      },
      formatter: function (params) {
        const axisLabel = params[0]?.axisValue ?? '';
        let html = `<div style="font-family: 'Inter', sans-serif; font-size: 12px;">`;
        html += `<div style="color: #888; margin-bottom: 6px;">${axisLabel}</div>`;

        params.forEach((p) => {
          const rawVal = p.data;
          const formatted = props.valueFormatter
            ? props.valueFormatter(rawVal, p.seriesName)
            : props.tooltipUnit
              ? `${rawVal} ${props.tooltipUnit}`
              : rawVal;

          // 自定义圆点
          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; min-width: 120px;">
              <div style="display: flex; align-items: center;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${p.color}; box-shadow: 0 0 6px ${p.color}; margin-right: 8px;"></span>
                <span style="color: #ccc;">${p.seriesName}</span>
              </div>
              <span style="font-family: monospace; font-weight: bold; color: #fff; margin-left: 12px;">${formatted}</span>
            </div>`;
        });
        html += `</div>`;
        return html;
      }
    },

    legend: props.showLegend
      ? {
          top: 0,
          right: 10,
          icon: 'circle',
          textStyle: { color: '#999' },
          itemWidth: 8,
          itemHeight: 8
        }
      : { show: false },

    grid: {
      left: 10,
      right: 50, // 右侧留出空间给 Label
      top: props.title ? 40 : 20,
      bottom: 20,
      containLabel: true,
      borderColor: '#333'
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xData,
      axisLine: { show: false }, // 隐藏轴线
      axisTick: { show: false }, // 隐藏刻度
      axisLabel: {
        color: '#666',
        fontSize: 10,
        rotate: props.xLabelRotate,
        margin: 14
      },
      // 只有 hover 时显示的网格
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
      position: 'right', // 金融图表习惯 Y 轴在右侧
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#666',
        fontSize: 10,
        formatter: function (v) {
          return props.tooltipUnit ? `${v}` : v;
        }
      },
      // 极简网格线
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333', // 深色网格
          type: 'dashed',
          width: 0.5
        }
      },
      scale: true, // 自动缩放，不强制从0开始
      min: (val) => val.min - (val.max - val.min) * 0.05, // 稍微留点余地
      max: (val) => val.max + (val.max - val.min) * 0.05
    },
    series
  };

  return option;
}

function initChart() {
  if (!container.value) return;
  if (chart) chart.dispose();

  chart = echarts.init(container.value);
  const option = buildOption();
  chart.setOption(option);

  if (props.loading)
    chart.showLoading({
      text: '',
      color: props.colors[0],
      textColor: '#fff',
      maskColor: 'rgba(0, 0, 0, 0.2)',
      zlevel: 0
    });
  else chart.hideLoading();
}

function updateChart() {
  if (!chart) return;
  const option = buildOption();
  chart.setOption(option, { notMerge: false }); // notMerge: false 允许平滑过渡
  if (props.loading) chart.showLoading();
  else chart.hideLoading();
}

onMounted(() => {
  nextTick(() => {
    initChart();
    if (props.autoResize && container.value) {
      resizeObserver = new ResizeObserver(() => chart && chart.resize());
      resizeObserver.observe(container.value);
    }
  });
});

onBeforeUnmount(() => {
  chart?.dispose();
  resizeObserver?.disconnect();
});

watch(() => [props.xData, props.seriesData, props.title, props.colors, props.loading], updateChart, { deep: true });
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  position: relative;
  /* Web3 风格通常是深色的。
    如果在亮色背景下使用，请移除此背景色，
    或者在父组件控制背景。
  */
  background: #0d0d12;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.line-chart {
  width: 100%;
}
</style>
