<!-- src/components/MessageItem.vue -->
<template>
  <div :class="['flex gap-3 items-start', isUser ? 'flex-row-reverse' : 'flex-row']">
    <div v-if="!isUser" class="avatar w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm">🤖</div>
    <div v-else class="avatar w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm">我</div>

    <div class="max-w-[75%] break-words">
      <div v-if="isUser" class="text-sm bg-slate-100 p-3 rounded-lg" style="background: var(--el-bg-color); color: var(--el-text-color)">
        {{ text }}
      </div>

      <div
        v-else
        class="ai-msg p-3 rounded-lg bg-gradient-to-r from-slate-50 to-white border"
        style="background: var(--el-bg-color); color: var(--el-text-color)"
      >
        <div v-if="rawHtml" v-html="rawHtml" class="prose prose-sm"></div>
        <pre v-else class="whitespace-pre-wrap text-sm" v-text="text"></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  text: string;
  isUser?: boolean;
  rawHtml?: string | null;
}>();

const isUser = computed(() => !!props.isUser);
</script>

<style scoped>
.ai-msg pre {
  margin: 0;
}
</style>
