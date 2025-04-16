<template>
  <div class="flex items-center space-x-1">
    <img :src="icon" :alt="symbol" class="w-5 h-5 rounded-full object-contain" />
    <span class="text-sm font-medium text-gray-800">{{ symbol }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  symbol: string;
}

defineProps<Props>();
</script>
