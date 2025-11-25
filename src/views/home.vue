<template>
  <div class="p-6 grid grid-cols-1 gap-6">
    <!-- AI 策略 -->
    <div class="rounded-2xl shadow p-6 bg-white cursor-pointer hover:shadow-lg transition" @click="goAiStrategy">
      <h2 class="text-xl font-semibold mb-2">AI 策略</h2>
      <p class="text-gray-500 text-sm">智能量化与自动交易辅助工具</p>
    </div>

    <!-- 更多功能 -->
    <div class="rounded-2xl shadow p-6 bg-white opacity-70">
      <h2 class="text-xl font-semibold mb-2">更多功能敬请期待</h2>
      <p class="text-gray-500 text-sm">我们正在为你准备更多精彩内容...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goAiStrategy = () => {
  router.push('/ai/ai-strategy');
};
</script>

<style scoped></style>
