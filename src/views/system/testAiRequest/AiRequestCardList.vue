<template>
  <div class="ai-card-list">
    <el-card
      v-for="item in list"
      :key="item.id"
      class="ai-card transition-all duration-200 transform hover:shadow-lg"
      :shadow="item.status === 1 ? 'always' : 'hover'"
      :class="statusClasses(item.status)"
    >
      <div class="flex items-center justify-between p-2">
        <div class="flex items-center space-x-6 min-w-0">
          <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full" :class="statusIndicatorClasses(item.status)">
            <el-icon v-if="item.status === 2" class="text-white"><Check /></el-icon>
            <el-icon v-else-if="item.status === 3" class="text-white"><Warning /></el-icon>
            <el-icon v-else-if="item.status === 1" class="is-loading text-white"><Loading /></el-icon>
            <el-icon v-else class="text-white"><CircleCloseFilled /></el-icon>
          </div>

          <div class="min-w-0">
            <div class="ai-title truncate font-bold text-gray-800">{{ item.requestKey }}</div>
            <div class="ai-sub text-sm text-gray-500 flex items-center space-x-1 mt-1">
              <el-icon><Clock /></el-icon>
              <span>发起于: {{ item.createTime }}</span>
              <el-tag v-if="![1, 2, 3].includes(item.status)" type="danger" size="small" class="ml-2">状态异常</el-tag>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-6 flex-shrink-0">
          <div class="hidden md:flex space-x-6 text-sm">
            <div v-if="item.status === 2" class="ai-metric">
              <div class="ai-label">响应时间:</div>
              <div class="ai-value font-mono text-blue-600">{{ item.responseTime || 'N/A' }}</div>
            </div>

            <div class="ai-metric">
              <div class="ai-label">Token 消耗:</div>
              <div class="ai-value font-mono">{{ item.token || 'N/A' }}</div>
            </div>

            <div class="ai-metric">
              <div class="ai-label">预估金额:</div>
              <div class="ai-value font-mono text-green-600">{{ item.price || 'N/A' }}</div>
            </div>
          </div>

          <ImagePreviewOss v-if="item.aiConfig && item.aiConfig.imgUrl" :src="item.aiConfig.imgUrl" class="w-10 h-10 rounded-lg flex-shrink-0" />

          <el-button type="primary" :icon="Tickets" link :disabled="item.status === 1" @click="emit('view', item)"> 详情 </el-button>
        </div>
      </div>

      <div v-if="item.status === 1" class="mt-2 px-2 pb-2">
        <el-progress :percentage="100" :indeterminate="true" :duration="2" :show-text="false" status="warning" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Tickets, Check, Warning, Loading, Clock, CircleCloseFilled } from '@element-plus/icons-vue';

// 假设 TestAiRequestVO 是正确的类型
interface TestAiRequestVO {
  id: string | number;
  requestKey: string;
  createTime: string; // 请求发起时间
  responseTime: string;
  token: number;
  price: string;
  status: number; // 状态码可能是任意数字
  aiConfig?: {
    imgUrl?: string;
  };
}

const props = defineProps({
  list: {
    type: Array as () => TestAiRequestVO[],
    default: () => []
  }
});

const emit = defineEmits(['view']);

/**
 * 根据状态返回卡片边框和阴影类 (Status: 1-等待, 2-完成, 3-超时, 其他-异常)
 * @param status 状态码
 */
const statusClasses = (status: number) => {
  switch (status) {
    case 1: // 等待响应
      return 'border-yellow-400 border-2 shadow-lg';
    case 2: // 已完成
      return 'border-green-300 border hover:border-green-400';
    case 3: // 已超时
      return 'border-red-400 border-2 bg-red-50';
    default: // 异常状态 (非 1, 2, 3)
      return 'border-gray-500 border-2 bg-gray-100 hover:border-gray-600';
  }
};

/**
 * 根据状态返回状态指示器背景类
 * @param status 状态码
 */
const statusIndicatorClasses = (status: number) => {
  switch (status) {
    case 1: // 等待响应
      return 'bg-yellow-500 animate-pulse';
    case 2: // 已完成
      return 'bg-green-500';
    case 3: // 已超时
      return 'bg-red-500';
    default: // 异常状态
      return 'bg-gray-500';
  }
};
</script>

<style scoped>
/* 容器：单列堆叠 */
.ai-card-list {
  @apply flex flex-col space-y-3;
}
/* 卡片主体 */
.ai-card {
  @apply bg-white rounded-xl;
}
/* 指标项样式 */
.ai-metric {
  @apply flex flex-col;
}
.ai-label {
  @apply text-gray-500 text-xs;
}
.ai-value {
  @apply text-base font-bold;
}
/* 解决 Ellipsis 截断问题 */
.ai-title {
  min-width: 0;
}
</style>
