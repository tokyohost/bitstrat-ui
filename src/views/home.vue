<template>
  <div class="p-6 grid grid-cols-1 gap-6">
    <!-- AI 策略 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goAiStrategy"
      style="border: 1px solid var(--el-border-color)"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">{{ t('home.aiStrategy.title') }}</h2>
      <p class="text-gray-500 text-sm">{{ t('home.aiStrategy.desc') }}</p>
    </div>
    <!-- AI 智能分析 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goAiSummary"
      style="border: 1px solid var(--el-border-color)"
      v-if="checkPermi(['system:home:aiSummary'])"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">{{ t('home.aiSummary.title') }}</h2>
      <p class="text-gray-500 text-sm">{{ t('home.aiSummary.desc') }}</p>
    </div>
    <!-- 策略广场 -->
    <div
      class="rounded-2xl shadow p-6 cursor-pointer hover:shadow-lg transition"
      @click="goFeed"
      style="border: 1px solid var(--el-border-color)"
      v-if="checkPermi(['system:home:feed'])"
    >
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">{{ t('home.feed.title') }}</h2>
      <p class="text-gray-500 text-sm">{{ t('home.feed.desc') }}</p>
    </div>

    <!-- 更多功能 -->
    <div class="rounded-2xl shadow p-6 opacity-70" style="border: 1px solid var(--el-border-color)">
      <h2 class="text-xl font-semibold mb-2" style="color: var(--el-text-color)">{{ t('home.more.title') }}</h2>
      <p class="text-gray-500 text-sm">{{ t('home.more.desc') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { checkPermi } from '@/utils/permission';

const { t } = useI18n();
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
