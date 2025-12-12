<script setup lang="ts">
import { computed } from 'vue';

// 定义组件接收的属性接口
interface Props {
  data: number[];
  lineColor?: string;
  fillColor?: string;
  // 保持 width/height 为数字，作为内部计算和 viewBox 的参考尺寸
  internalWidth?: number;
  internalHeight?: number;
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  lineColor: 'rgb(34, 197, 94)',
  fillColor: 'transparent',
  // 默认内部参考尺寸 (Internal Reference Dimensions)
  internalWidth: 100,
  internalHeight: 30
});

// 计算 SVG 路径 D 属性所需的数据点字符串
const points = computed(() => {
  // 使用内部参考尺寸进行所有坐标计算
  const width = props.internalWidth;
  const height = props.internalHeight;
  const { data } = props;

  if (data.length <= 1) return '0,0';

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  // X 坐标步长
  const xStep = width / (data.length - 1);

  const mappedPoints = data.map((value, index) => {
    const x = index * xStep;

    let y: number;
    if (range === 0) {
      y = height / 2;
    } else {
      const normalizedValue = (value - min) / range;
      y = height - normalizedValue * height;
    }

    // 确保坐标值是小数点后两位的数字字符串
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return mappedPoints.join(' ');
});

// 用于绘制填充区域 (Area) 的路径字符串
const areaPath = computed(() => {
  const width = props.internalWidth;
  const height = props.internalHeight;

  if (props.data.length === 0) return '';

  let path = `M 0,${height} L ${points.value}`;
  path += ` L ${width},${height} Z`;
  return path;
});
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <svg :viewBox="`0 0 ${props.internalWidth} ${props.internalHeight}`" :height="props.internalHeight" class="w-full overflow-visible">
      <path v-if="fillColor !== 'transparent'" :d="areaPath" :fill="fillColor" class="opacity-10" />

      <polyline :points="points" fill="none" :stroke="lineColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>
