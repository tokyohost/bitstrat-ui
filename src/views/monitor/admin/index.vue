<template>
  <div>
    <i-frame v-model:src="url"></i-frame>
  </div>
</template>

<script setup lang="ts">
import { getEnv } from '@/env';

const { MONITOR_ADMIN } = getEnv();
const url = ref(MONITOR_ADMIN);
</script>
