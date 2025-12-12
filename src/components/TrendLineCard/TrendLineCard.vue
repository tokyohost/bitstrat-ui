<script setup lang="ts">
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement, ChartData, ChartOptions } from 'chart.js';
import { computed } from 'vue';

// 注册 Chart.js 必需的组件 (保持不变)
ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, CategoryScale, PointElement);

// 定义组件接收的属性接口
interface Props {
  data: number[];
  lineColor?: string; // 例如: #10B981
  fillColor?: string; // 例如: rgba(16, 185, 129, 0.1)
  isDarkMode?: boolean; // 新增：用于接收暗黑模式状态
}

const props = withDefaults(defineProps<Props>(), {
  isDarkMode: false
});

// 计算 Chart.js 所需的数据结构 (保持不变)
const chartData = computed<ChartData<'line'>>(() => ({
  labels: props.data.map((_, index) => index),
  datasets: [
    {
      pointRadius: 0,
      pointHitRadius: 0,
      borderWidth: 1.5,
      data: props.data,
      borderColor: props.lineColor,
      backgroundColor: props.fillColor,
      fill: true,
      tension: 0.5
    }
  ]
}));

// --- 核心：根据 isDarkMode 计算颜色 ---
const dynamicColors = computed(() => {
  if (props.isDarkMode) {
    return {
      // 暗黑模式下，字体颜色应为亮色
      fontColor: '#E5E7EB', // Tailwind gray-200
      // 暗黑模式下，工具提示背景应为深色，以保持对比度
      tooltipBg: 'rgba(255, 255, 255, 0.9)',
      tooltipText: '#1F2937' // Tailwind gray-800
    };
  } else {
    return {
      // 亮模式下，字体颜色应为深色
      fontColor: '#1F2937', // Tailwind gray-800
      tooltipBg: 'rgba(17, 24, 39, 0.9)', // Tailwind gray-900
      tooltipText: '#fff'
    };
  }
});

// 配置 Chart.js 选项
const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 500,
    easing: 'easeOutQuart'
  },
  elements: {
    line: {
      borderCapStyle: 'round',
      tension: 0.5
    }
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        title: function () {
          return '';
        },
        label: function (context) {
          return context.formattedValue;
        }
      },
      // 使用动态颜色
      backgroundColor: dynamicColors.value.tooltipBg,
      titleColor: dynamicColors.value.tooltipText,
      bodyColor: dynamicColors.value.tooltipText,
      displayColors: false,
      borderWidth: 0,
      cornerRadius: 4,
      padding: 8
    }
  },
  scales: {
    x: { display: false },
    y: {
      display: false,
      beginAtZero: false,
      padding: { top: 10, bottom: 10 }
    }
  },
  layout: {
    padding: { left: 0, right: 0, top: 0, bottom: 0 }
  },
  // 关键：全局字体配置
  font: {
    family: 'inherit', // 继承CSS字体
    color: dynamicColors.value.fontColor
  }
}));
</script>

<template>
  <div class="relative w-full h-full">
    <Line :data="chartData" :options="chartOptions" class="h-full w-full" />
  </div>
</template>
