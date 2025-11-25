<template>
  <div class="ai-card-list">
    <el-card v-for="item in list" :key="item.id" class="ai-card" shadow="hover">
      <div class="ai-card-header">
        <div class="ai-title">{{ item.requestKey }}<ImagePreviewOss v-if="item.aiConfig" :src="item?.aiConfig?.imgUrl" /></div>
        <div class="ai-sub">{{ item.createTime }}</div>
      </div>

      <div class="ai-card-body">
        <div class="ai-field">
          <span class="ai-label">响应时间:</span> <span class="ai-value">{{ item.responseTime }}</span>
        </div>
        <div class="ai-field">
          <span class="ai-label">Token:</span> <span class="ai-value">{{ item.token }}</span>
        </div>
        <div class="ai-field">
          <span class="ai-label">金额:</span> <span class="ai-value">{{ item.price }}</span>
        </div>
      </div>

      <div class="ai-card-footer">
        <el-button link type="primary" icon="Tickets" @click="emit('view', item)">查看</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view']);
</script>

<style scoped>
.ai-card-list {
  @apply flex flex-col gap-4;
}
.ai-card {
  @apply bg-white rounded-2xl shadow-md p-5 border border-gray-100 relative;
}
.ai-card-header {
  @apply flex justify-between items-center mb-4;
}
.ai-title {
  @apply text-lg font-bold text-gray-800;
}
.ai-sub {
  @apply text-sm text-gray-500;
}
.ai-card-body {
  @apply grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6;
}
.ai-field {
  @apply flex items-start gap-2;
}
.ai-label {
  @apply font-medium text-gray-600;
}
.ai-value {
  @apply text-gray-800;
}
/* 按钮放在卡片底部右侧 */
.ai-card-footer {
  @apply mt-4 flex justify-end;
}
</style>
