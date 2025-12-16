<template>
  <div>
    <i-frame v-model:src="url"></i-frame>
  </div>
</template>

<script setup lang="ts">
import { getEnv } from '@/env';

const { SNAILJOB_ADMIN } = getEnv();
const url = ref(SNAILJOB_ADMIN);
</script>
