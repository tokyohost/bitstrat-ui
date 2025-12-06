<template>
  <div class="ai-config-selector">
    <div class="scroll-wrapper">
      <div v-for="item in list" :key="item.id" class="ai-item" :class="{ active: item.id === modelValue }" @click="select(item.id)">
        <!--        <img :src="item.imgUrl" class="ai-icon" />-->
        <imagePreviewOss :src="item.imgUrl" :width="80" :height="80"></imagePreviewOss>
        <div class="ai-name">{{ item.flowName }}</div>
        <div class="">{{ item.price }}RMB/M Token</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import type { AiConfigVO } from '@/api/system/aiConfig/types';

import { ref, onMounted } from 'vue';
import { listAiConfig } from '@/api/system/aiConfig';

import imagePreviewOss from '@/components/ImagePreviewOss/index.vue';

const props = defineProps<{ modelValue: string | number | null }>();
const emit = defineEmits(['update:modelValue']);

const list = ref<AiConfigVO[]>([]);

onMounted(async () => {
  const res = await listAiConfig();
  list.value = res.rows || [];
});

const select = (id: string | number) => {
  emit('update:modelValue', id);
};
</script>
<style scoped>
.ai-config-selector {
  width: 100%;
  height: 280px; /* 高度按你需求调整 */
  overflow-y: auto;
}

/* 两列纵向排列 */
.scroll-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 10px;
}

.ai-item {
  width: 100%; /* grid 自动撑开宽度 */
  height: 140px;
  border-radius: 12px;
  background: #f5f6f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.ai-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.ai-item.active {
  border-color: #409eff;
  background: #e8f4ff;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.ai-name {
  margin-top: 6px;
  font-size: 14px;
  text-align: center;
  color: #333;
  font-weight: 500;
}
</style>
