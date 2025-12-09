<template>
  <div class="ai-config-selector">
    <div class="scroll-wrapper">
      <div v-for="item in list" :key="item.id" class="ai-item" :class="{ active: item.id === modelValue }" @click="select(item.id)">
        <imagePreviewOss :src="item.imgUrl" :width="60" :height="60"></imagePreviewOss>
        <div class="ai-name">{{ item.flowName }}</div>
        <div class="ai-price">{{ item.price }}RMB/M Token</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { AiConfigQuery, AiConfigVO } from '@/api/system/aiConfig/types';
import { ref, onMounted } from 'vue';
import { listAiConfig } from '@/api/system/aiConfig';
import imagePreviewOss from '@/components/ImagePreviewOss/index.vue';

const props = defineProps<{ modelValue: string | number | null; type: number }>();
const emit = defineEmits(['update:modelValue']);

const list = ref<AiConfigVO[]>([]);

onMounted(async () => {
  const data = {} as AiConfigQuery;
  if (props.type) {
    data.type = props.type;
  } else {
    data.type = 1;
  }
  const res = await listAiConfig(data);
  list.value = res.rows || [];
});

const select = (id: string | number) => {
  emit('update:modelValue', id);
};
</script>

<style scoped>
/* 默认 PC/平板 样式 */
.ai-config-selector {
  width: 100%;
  height: 280px;
  overflow-y: auto;
  margin: 0 10px 0 10px;
}

/* PC/平板：两列纵向排列 */
.scroll-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 10px;
}

.ai-item {
  color: var(--el-text-color);
  width: 100%;
  height: 140px;
  border-radius: 12px;
  background: var(--el-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #cccccc;
}

.ai-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.ai-item.active {
  border-color: var(--el-color-primary);
  /* background: #e8f4ff; */
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.ai-name {
  margin-top: 6px;
  font-size: 14px;
  text-align: center;
  color: var(--el-text-color);
  font-weight: 500;
  /* 确保名称不换行 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; /* 限制宽度 */
}

.ai-price {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  /* 确保价格不换行 */
  white-space: nowrap;
}

/* ---------------------------------------------------- */
/* 适配移动端：屏幕宽度小于 768px 时 */
/* ---------------------------------------------------- */
@media screen and (max-width: 768px) {
  .ai-config-selector {
    height: auto; /* 移动端高度自适应，避免设置固定高度导致内容被截断 */
    overflow-y: hidden; /* 整体滚动交给容器外层，或者保持内容自适应 */
  }

  /* 关键改动：切换为单列布局 */
  .scroll-wrapper {
    grid-template-columns: 1fr; /* 切换为单列 */
    gap: 10px;
    padding: 8px;
  }

  /* 优化移动端 item 的样式，使其更像列表项 */
  .ai-item {
    height: 80px; /* 降低高度 */
    flex-direction: row; /* 切换为横向排列 */
    justify-content: flex-start; /* 内容左对齐 */
    padding: 10px 15px; /* 调整左右边距 */
  }

  /* 调整 imagePreviewOss 的尺寸以适应横向列表 */
  :deep(.image-preview-oss) {
    width: 60px !important;
    height: 60px !important;
    flex-shrink: 0; /* 防止图标被压缩 */
  }

  .ai-name {
    margin-top: 0; /* 移除顶部边距 */
    margin-left: 15px; /* 和图标拉开距离 */
    font-size: 16px; /* 适当增大字体 */
    text-align: left; /* 左对齐 */

    /* 核心：确保名称和价格占据中间区域，并设置溢出处理 */
    flex-grow: 1; /* 占据剩余空间 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ai-item > div:last-child {
    /* 将价格移到最右侧，并确保不换行 */
    margin-left: 10px;
    text-align: right;
    flex-shrink: 0; /* 防止价格被压缩 */
  }
}
</style>
