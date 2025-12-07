<template>
  <div class="chart-wrapper" :class="actualTheme" :style="wrapperStyle">
    <div class="line-chart" :style="{ height: height }" ref="container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import * as echarts from 'echarts';
// 1. 引入 RuoYi-Vue-Plus 的设置 Store
import { useSettingsStore } from '@/store/modules/settings';
import { SideThemeEnum } from '@/enums/SideThemeEnum';

const settingsStore = useSettingsStore();

const props = defineProps({
  // 允许手动覆盖：'auto' | 'dark' | 'light'
  // 默认为 'auto'，跟随 RuoYi 系统设置
  theme: {
    type: String,
    default: 'auto',
    validator: (val) => ['auto', 'dark', 'light'].includes(val)
  },
  xData: { type: Array, default: () => [] },
  seriesData: { type: Array, default: () => [] },
  title: { type: String, default: '' },
  showLegend: { type: Boolean, default: true },
  tooltipUnit: { type: String, default: '' },
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
// 是否暗黑模式
const isDark = useDark({
  storageKey: 'useDarkKey',
  valueDark: 'dark',
  valueLight: 'light'
});
// 核心逻辑：计算最终使用的主题
const actualTheme = ref<string>('light');
watch(isDark, () => {
  if (isDark.value) {
    actualTheme.value = 'dark';
  } else {
    actualTheme.value = 'light';
  }
});

// --- 主题配置定义 ---
const THEME_CONFIG = {
  dark: {
    bg: '#1e1e2d',
    textPrimary: '#FFFFFF',
    textSecondary: '#909399',
    grid: '#363637',
    border: 'rgba(255, 255, 255, 0.05)',
    tooltipBg: 'rgba(29, 30, 31, 0.9)',
    tooltipBorder: '#4C4D4F',
    tooltipText: '#eee',
    shadowStrength: 10,
    areaOpacity: 0.5,
    labelBg: 'rgba(0,0,0,0.6)'
  },
  light: {
    bg: '#FFFFFF',
    textPrimary: '#303133',
    textSecondary: '#909399',
    grid: '#EBEEF5',
    border: '#DCDFE6',
    tooltipBg: 'rgba(255, 255, 255, 0.95)',
    tooltipBorder: '#E4E7ED',
    tooltipText: '#303133',
    shadowStrength: 0,
    areaOpacity: 0.2,
    labelBg: 'rgba(255,255,255,0.8)'
  }
};

const currentConfig = computed(() => THEME_CONFIG[actualTheme.value]);

const wrapperStyle = computed(() => ({
  backgroundColor: currentConfig.value.bg,
  borderColor: currentConfig.value.border
}));

// --- 辅助函数 ---
const createGradient = (color) => {
  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: color },
    { offset: 1, color: 'rgba(0,0,0,0)' }
  ]);
};

function hexToRgba(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  return hex;
}

// --- ECharts 构建逻辑 ---
function buildSeries(seriesData) {
  const t = currentConfig.value;

  return seriesData.map((s, index) => {
    const color = props.colors[index % props.colors.length];
    const latestIndex = s.data.length - 1;

    return {
      name: s.name || 'Price',
      type: 'line',
      data: s.data || [],
      smooth: true,
      showSymbol: false,
      symbol: 'circle',
      symbolSize: 8,
      yAxisIndex: s.yAxisIndex || 0,

      lineStyle: s.lineStyle ?? {
        width: 3,
        shadowColor: color,
        shadowBlur: t.shadowStrength,
        shadowOffsetY: 0
      },

      areaStyle: s.area
        ? {
            color: createGradient(hexToRgba(color, t.areaOpacity)),
            opacity: 1
          }
        : undefined,

      markPoint: {
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: actualTheme.value === 'dark' ? '#fff' : color,
          borderColor: actualTheme.value === 'dark' ? color : '#fff',
          borderWidth: 2,
          shadowColor: color,
          shadowBlur: t.shadowStrength > 0 ? 15 : 0
        },
        label: { show: false },
        data: [{ type: 'max', name: 'Max', symbolSize: 0, label: { show: false } }, { coord: [latestIndex, s.data[latestIndex]] }]
      },

      label: {
        show: true,
        position: 'right',
        distance: 10,
        color: color,
        fontWeight: 'bold',
        fontFamily: 'Monospace',
        backgroundColor: t.labelBg,
        padding: [4, 8],
        borderRadius: 4,
        formatter: (params) => (params.dataIndex === latestIndex ? params.value : '')
      }
    };
  });
}

function buildOption() {
  const t = currentConfig.value;
  const series = buildSeries(props.seriesData);

  // 基准线
  if (props.centerLine && series.length > 0) {
    if (!series[0].markLine) series[0].markLine = { data: [], symbol: 'none' };
    series[0].markLine.data.push({
      yAxis: props.baseLinePrice,
      label: {
        formatter: (params) => `Base: ${params.value}`,
        position: 'end',
        color: '#F56C6C',
        fontSize: 10
      },
      lineStyle: {
        color: '#F56C6C',
        type: 'dashed',
        width: 1,
        opacity: 0.8
      }
    });
  }

  const option = {
    backgroundColor: 'transparent',
    color: props.colors,
    title: props.title
      ? {
          text: props.title,
          left: 'left',
          textStyle: { color: t.textPrimary, fontSize: 14, fontWeight: 'normal' }
        }
      : undefined,

    tooltip: {
      trigger: 'axis',
      backgroundColor: t.tooltipBg,
      borderColor: t.tooltipBorder,
      textStyle: { color: t.tooltipText, fontSize: 12 },
      padding: [10, 15],
      backdropFilter: 'blur(4px)',
      extraCssText: actualTheme.value === 'light' ? 'box-shadow: 0 4px 12px rgba(0,0,0,0.1);' : '',
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: t.textSecondary,
          type: 'dashed'
        }
      },
      formatter: function (params) {
        const axisLabel = params[0]?.axisValue ?? '';
        const labelColor = actualTheme.value === 'light' ? '#606266' : '#909399';
        const valColor = actualTheme.value === 'light' ? '#303133' : '#fff';

        let html = `<div style="font-family: 'Inter', sans-serif; font-size: 12px;">`;
        html += `<div style="color: ${labelColor}; margin-bottom: 6px;">${axisLabel}</div>`;

        params.forEach((p) => {
          const rawVal = p.data;
          const formatted = props.valueFormatter
            ? props.valueFormatter(rawVal, p.seriesName)
            : props.tooltipUnit
              ? `${rawVal} ${props.tooltipUnit}`
              : rawVal;

          html += `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; min-width: 120px;">
              <div style="display: flex; align-items: center;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${p.color}; margin-right: 8px;"></span>
                <span style="color: ${labelColor};">${p.seriesName}</span>
              </div>
              <span style="font-family: monospace; font-weight: bold; color: ${valColor}; margin-left: 12px;">${formatted}</span>
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
          textStyle: { color: t.textSecondary },
          itemWidth: 8,
          itemHeight: 8
        }
      : { show: false },

    grid: {
      left: 10,
      right: 50,
      top: props.title ? 40 : 20,
      bottom: 20,
      containLabel: true,
      borderColor: t.grid
    },

    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: props.xData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: t.textSecondary,
        fontSize: 10,
        rotate: props.xLabelRotate,
        margin: 14
      },
      splitLine: { show: false }
    },

    yAxis: {
      type: 'value',
      position: 'right',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: t.textSecondary,
        fontSize: 10,
        formatter: (v) => (props.tooltipUnit ? `${v}` : v)
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: t.grid,
          type: 'dashed',
          width: 0.5
        }
      },
      scale: true,
      min: (val) => fix3(val.min - (val.max - val.min) * 0.05),
      max: (val) => fix3(val.max + (val.max - val.min) * 0.05)
    },
    series
  };

  return option;
}
const fix3 = (n: number) => Number(n.toFixed(3));
// --- Lifecycle & Watchers ---

function initChart() {
  if (!container.value) return;
  if (chart) chart.dispose();

  chart = echarts.init(container.value);
  const option = buildOption();
  chart.setOption(option);

  if (props.loading) showLoading();
}

function showLoading() {
  if (!chart) return;
  const t = currentConfig.value;
  chart.showLoading({
    text: '',
    color: props.colors[0],
    textColor: t.textPrimary,
    maskColor: actualTheme.value === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.4)',
    zlevel: 0
  });
}

function updateChart() {
  if (!chart) return;
  const option = buildOption();
  chart.setOption(option, { notMerge: false });
  if (props.loading) showLoading();
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

// 监听 actualTheme 的变化（即 settingsStore 中主题相关的属性变化）
watch(
  () => [
    props.xData,
    props.seriesData,
    actualTheme.value, // 重点：监听计算属性 actualTheme 的变化
    props.title,
    props.colors,
    props.loading
  ],
  () => {
    updateChart();
  },
  { deep: true }
);
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  position: relative;
  border-radius: 8px;
  padding: 16px;
  /* 增加过渡效果，切换主题更平滑 */
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
  border: 1px solid transparent;
}

.chart-wrapper.dark {
  /* 适配 RuoYi Element Plus 深色阴影 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.chart-wrapper.light {
  /* 适配 RuoYi 卡片默认边框 */
  border-color: #e4e7ed;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.line-chart {
  width: 100%;
}
</style>
