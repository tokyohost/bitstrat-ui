<template>
  <div class="flex items-center space-x-1">
    <span :class="['text-sm font-medium', direction === 'long' ? 'text-green-500' : 'text-red-500']" style="color: var(--el-text-color)">
      {{ directionText }}
    </span>
    <span class="text-sm font-bold text-gray-800" style="color: var(--el-text-color)">
      {{ symbol }}
    </span>
    <ExchangeLogo :exchange="exchange" v-if="props.diyExLogo || !exchangeLogo" :key="exchange"></ExchangeLogo>
    <img :src="exchangeLogo" :alt="exchange" v-else class="w-4 h-4 rounded-full object-contain" />
    <span class="text-sm text-gray-600" v-if="!props.diyExLogo || !exchangeLogo" style="color: var(--el-text-color)">{{ exchange }}</span>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';

interface Props {
  direction: 'long' | 'short' | string;
  symbol: string;
  exchange: string;
  exchangeLogo: string;
  diyExLogo?: boolean;
}

const props = defineProps<Props>();

const { t } = useI18n();

const directionText = computed(() => (props.direction === 'long' ? t('common.direction.long') : t('common.direction.short')));
</script>
