<template>
  <span class="text-sm font-bold text-gray-600">{{ formattedTime }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

interface Props {
  timestamp: number; // 目标时间戳（毫秒）
}

const props = defineProps<Props>();

const remaining = ref(props.timestamp - Date.now());
const formattedTime = computed(() => {
  if (remaining.value <= 0) return '00:00:00';
  const d = dayjs.duration(remaining.value);
  const hours = Math.floor(d.asHours());
  const minutes = d.minutes().toString().padStart(2, '0');
  const seconds = d.seconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

let timer: number;

const updateRemaining = () => {
  const now = Date.now();
  remaining.value = Math.max(props.timestamp - now, 0);
};

onMounted(() => {
  updateRemaining();
  timer = window.setInterval(updateRemaining, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

// 若 timestamp 是响应式的，也支持自动重新计时
watch(
  () => props.timestamp,
  () => {
    updateRemaining();
  }
);
</script>
