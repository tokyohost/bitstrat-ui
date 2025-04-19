<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { querySymbolMarketPrice } from '@/api/system/common/common';

interface Props {
  exchange: string;
  symbol: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:value', val: number): void;
  (e: 'change', val: number): void;
}>();

const dataValue = ref<number | null>(null);
let timer: ReturnType<typeof setInterval> | null = null;

const fetchData = async () => {
  try {
    // TODO: 替换为你的真实 API 请求
    const res = await querySymbolMarketPrice(props?.exchange,props.symbol);
    const value = res?.data ?? 0;

    dataValue.value = value;
    emit('update:value', value);
    emit('change', value);
  } catch (err) {
    ElMessage.error('获取数据失败');
  }
};

const startPolling = () => {
  stopPolling();
  fetchData(); // 立即执行一次
  timer = setInterval(fetchData, 5000); // 每 5 秒刷新
};

const stopPolling = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

watch(() => [props.exchange, props.symbol], startPolling, { immediate: true });

onMounted(startPolling);
onUnmounted(stopPolling);
</script>

<template>
  <div class="text-sm text-gray-700">
    <span class="font-bold">{{ dataValue ?? '--' }}</span><span>{{"USDT"}}</span>
  </div>
</template>
