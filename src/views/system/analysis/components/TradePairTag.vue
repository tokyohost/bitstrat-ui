<template>
  <div class="flex items-center space-x-1">
    <span :class="['text-sm font-medium', direction === 'long' ? 'text-green-500' : 'text-red-500']">
      {{ directionText }}
    </span>
    <span class="text-sm font-bold text-gray-800">
      {{ symbol }}
    </span>
    <ExchangeLogo :exchange="exchange" v-if="props.diyExLogo || !exchangeLogo"></ExchangeLogo>
    <img :src="exchangeLogo" :alt="exchange" v-else class="w-4 h-4 rounded-full object-contain" />
    <span class="text-sm text-gray-600" v-if="!props.diyExLogo || !exchangeLogo">{{ exchange }}</span>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';

interface Props {
  direction: 'long' | 'short';
  symbol: string;
  exchange: string;
  exchangeLogo: string;
  diyExLogo?: boolean;
}

const props = defineProps<Props>();

const directionText = props.direction === 'long' ? '做多' : '做空';
</script>
