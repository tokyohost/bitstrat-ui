<template>
  <div class="p-6 grid grid-cols-1 gap-6">
    <!-- AI 策略 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goAiStrategy"
      style="border: 1px solid var(--el-border-color)"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">AI 策略</h2>
      <p class="text-gray-500 text-sm">智能量化与自动交易辅助工具</p>
    </div>
    <!-- AI 智能分析 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goAiSummary"
      style="border: 1px solid var(--el-border-color)"
      v-if="checkPermi(['system:home:aiSummary'])"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">AI 智能分析</h2>
      <p class="text-gray-500 text-sm">智能分析仓位以及行情辅助工具</p>
    </div>
    <!-- 策略广场 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goFeed"
      style="border: 1px solid var(--el-border-color)"
      v-if="checkPermi(['system:home:feed'])"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">策略广场</h2>
      <p class="text-gray-500 text-sm">发现更多策略</p>
    </div>

    <!-- 更多功能 -->
    <div class="rounded-2xl shadow p-6 opacity-70" style="border: 1px solid var(--el-border-color)">
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">更多功能敬请期待</h2>
      <p class="text-gray-500 text-sm">我们正在为你准备更多精彩内容...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { checkPermi } from '@/utils/permission';

const router = useRouter();

const goAiStrategy = () => {
  router.push('/ai/ai-strategy');
};
const goAiSummary = () => {
  router.push('/ai/ai-summary');
};
const goFeed = () => {
  router.push('/ai/ai-feed');
};
</script>

<style scoped></style>
