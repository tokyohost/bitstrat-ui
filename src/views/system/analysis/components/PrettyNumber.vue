<template>
  <span class="text-sm font-bold text-gray-600">${{ formatted }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatPrettyNumber } from '@/utils/formatNumber';

interface Props {
  value: number;
  lang?: 'zh' | 'en';
  digits?: number;
}

const props = withDefaults(defineProps<Props>(), {
  lang: 'zh',
  digits: 2
});

const formatted = computed(() => formatPrettyNumber(props.value, props.lang, props.digits));
</script>
