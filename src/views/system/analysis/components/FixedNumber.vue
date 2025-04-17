<template>
  <span v-if="showColor" :class="[value > 0 ? 'color_red' : 'color_green']">{{ formatted }} {{ suffix ? suffix : '' }}</span>
  <span v-else>{{ formatted }} {{ suffix ? suffix : '' }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number | string;
  decimals?: number;
  suffix?: string;
  showColor?: boolean;
}>();

const formatted = computed(() => {
  const num = parseFloat(String(props.value));
  const fixed = isNaN(num) ? '-' : num.toFixed(props.decimals ?? 4);
  return fixed;
});
</script>
<style scoped>
.color_red {
  color: red;
}
.color_green {
  color: limegreen;
}
</style>
