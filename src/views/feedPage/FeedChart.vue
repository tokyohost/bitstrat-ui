<script setup lang="ts">
import { loadChartDataSimple } from '@/views/system/aiTask/index';
import { loadFeedChartDataSimple } from '@/api/system/feed';
import { AiLogsQuery } from '@/api/system/aiLogs/types';
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
const props = defineProps<{
  id: number | string;
}>();
const chartData = ref<number[]>([]);
const loadChartData = async (id) => {
  // Placeholder for any data loading logic if needed in the future
  const res = await loadFeedChartDataSimple({ id: id } as AiLogsQuery);
  chartData.value = res.data.data;
};
watch(
  () => props.id,
  (val) => {
    console.log('init + changed:', val);
    loadChartData(val);
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between">
      <TrendLineCard
        :data="chartData"
        :line-color="'#10B981'"
        :fill-color="'rgba(16, 185, 129, 0.1)'"
        :is-dark-mode="actualTheme === 'dark'"
        style="height: 50px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
