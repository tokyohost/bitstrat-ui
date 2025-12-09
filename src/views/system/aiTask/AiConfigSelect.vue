<template>
  <el-select
    :model-value="modelValue"
    @update:modelValue="select"
    placeholder="请选择 AI 配置"
    size="large"
    class="ai-config-select-component"
    filterable
    clearable
    :loading="loading"
  >
    <el-option v-for="item in list" :key="item.id" :label="item.flowName" :value="item.id" class="ai-config-option-item">
      <div class="flex flex-row justify-between">
        <span class="font-medium text-gray-800 truncate" style="color: var(--el-text-color)">{{ item.flowName }}</span>
        <span class="text-xs text-gray-500 mt-0.5 truncate" style="color: var(--el-text-color)">{{ item.price }} RMB / M Token</span>
      </div>
    </el-option>

    <template #empty>
      <div class="p-2 text-center text-gray-500">
        {{ loading ? '加载中...' : '暂无可用配置' }}
      </div>
    </template>
  </el-select>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue';
import type { AiConfigVO, AiConfigQuery } from '@/api/system/aiConfig/types';
import { listAiConfig } from '@/api/system/aiConfig';
import imagePreviewOss from '@/components/ImagePreviewOss/index.vue';
import { ElTag } from 'element-plus'; // 确保引入 ElTag

const props = defineProps<{ modelValue: string | number | null; type: number }>();
const emit = defineEmits(['update:modelValue']);

const list = ref<AiConfigVO[]>([]);
const loading = ref(false); // 新增 loading 状态

onMounted(async () => {
  loading.value = true;
  try {
    const data = {} as AiConfigQuery;
    // 保留了原组件的过滤逻辑
    data.type = props.type || 1;

    const res = await listAiConfig(data);
    list.value = res.rows || [];
  } catch (error) {
    console.error('加载 AI 配置列表失败:', error);
  } finally {
    loading.value = false;
  }
});

const select = (id: string | number) => {
  emit('update:modelValue', id);
};
</script>

<style scoped>
/* 确保组件在 DOM 渲染后有足够的空间和样式 */
.ai-config-select-component {
  width: 100%;
}

/* ---------------------------------------------------- */
/* 核心样式优化：精确控制 el-option 内部布局 */
/* ---------------------------------------------------- */

/* 1. 深度选择器：调整 el-option 整体容器样式 */
:deep(.el-select-dropdown__item) {
  /* 允许选项高度自适应 */
  height: auto !important;
  /* 调整左右内边距，使其与主输入框对齐 */
  padding: 0 16px !important;
  /* 恢复正常的行高 */
  line-height: normal !important;
  transition: background-color 0.2s;
}

/* 2. 图标/图片容器样式 */
.ai-icon-wrapper {
  /* 确保 imagePreviewOss 组件内部的图片或容器有固定的 36x36 尺寸 */
  width: 36px;
  height: 36px;
  border-radius: 4px; /* 轻微圆角 */
  overflow: hidden;
  flex-shrink: 0;
}

/* 强制覆盖 imagePreviewOss 内部可能存在的样式，确保它居中且尺寸正确 */
.ai-icon-wrapper :deep(img),
.ai-icon-wrapper :deep(.image-preview-oss) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover; /* 确保图片填充容器 */
}

/* 确保自定义的选项内容在 el-option 内部正确对齐 */
.ai-config-option-item .flex {
  align-items: center;
}
</style>
