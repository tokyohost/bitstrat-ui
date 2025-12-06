<template>
  <div class="ai-card-list">
    <el-card
      v-for="item in list"
      :key="item.id"
      class="ai-card transition-all duration-200 transform hover:shadow-lg"
      :shadow="item.status === 1 ? 'always' : 'hover'"
      :class="[statusClasses(item.status), cardThemeClasses]"
    >
      <div class="flex items-center justify-between p-8">
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
              <div class="ai-label">Token 消耗</div>
              <div class="ai-value font-mono">{{ item.token || 'N/A' }}</div>
            </div>

            <div class="ai-metric">
              <div class="ai-label">成本</div>
              <div class="ai-value font-mono text-green-600">{{ item.price || 'N/A' }}</div>
            </div>
          </div>

          <ImagePreviewOss v-if="item.aiConfig && item.aiConfig.imgUrl" :src="item.aiConfig.imgUrl" class="w-15 h-10 rounded-lg flex-shrink-0" />

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
import { defineProps, defineEmits, computed } from 'vue';
import { Tickets, Check, Warning, Loading, Clock, CircleCloseFilled } from '@element-plus/icons-vue';
import { useSettingsStore } from '@/store/modules/settings';

const settingsStore = useSettingsStore();

interface TestAiRequestVO {
  id: string | number;
  requestKey: string;
  createTime: string;
  responseTime: string;
  token: number;
  price: string;
  status: number;
  aiConfig?: {
    imgUrl?: string;
  };
}

const props = defineProps({
  list: {
    type: Array as () => TestAiRequestVO[],
    default: () => []
  },
  theme: {
    type: String,
    default: 'auto',
    validator: (val: string) => ['auto', 'dark', 'light'].includes(val)
  }
});

const emit = defineEmits(['view']);

// 1. 核心逻辑：计算最终使用的主题
const actualTheme = computed(() => {
  if (props.theme !== 'auto') return props.theme;

  // 综合检查 Pinia Store 和 localStorage
  const isStoreDark = settingsStore.theme === 'dark' || settingsStore.sideTheme === 'theme-dark';
  const isLocalStorageDark = localStorage.getItem('useDarkKey') === 'dark';

  return isStoreDark || isLocalStorageDark ? 'dark' : 'light';
});

// 2. 通用卡片主题类 (背景、通用边框、阴影)
const cardThemeClasses = computed(() => {
  if (actualTheme.value === 'dark') {
    // 深色模式：使用深色背景和边框，更突出的阴影
    return 'ai-card-dark bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl';
  } else {
    // 浅色模式：保留原有样式
    return 'bg-white border-gray-200 shadow-md hover:shadow-lg';
  }
});

/**
 * 根据状态返回卡片边框和阴影类 (Status: 1-等待, 2-完成, 3-超时, 其他-异常)
 * @param status 状态码
 */
const statusClasses = (status: number) => {
  const isDark = actualTheme.value === 'dark';

  switch (status) {
    case 1: // 等待响应
      return isDark ? 'border-yellow-500 border-2 shadow-yellow-800/50' : 'border-yellow-400 border-2 shadow-lg'; // 保持原有 shadow-lg
    case 2: // 已完成
      return isDark ? 'border-green-600 border hover:border-green-500' : 'border-green-300 border hover:border-green-400';
    case 3: // 已超时
      // 深色模式下，背景需要更暗，以适应深色 UI
      return isDark ? 'border-red-600 border-2 bg-red-950/50' : 'border-red-400 border-2 bg-red-50';
    default: // 异常状态
      return isDark ? 'border-gray-600 border-2 bg-gray-900/50' : 'border-gray-500 border-2 bg-gray-100 hover:border-gray-600';
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
  @apply rounded-xl border; /* 确保卡片有边框，方便 statusClasses 覆盖 */
}

/* 3. 核心样式调整：在深色模式下，覆盖文本颜色变量 */
.ai-card-dark .ai-title {
  /* 覆盖 text-gray-800 */
  color: var(--el-color-white) !important;
}
.ai-card-dark .ai-sub,
.ai-card-dark .ai-label {
  /* 覆盖 text-gray-500 */
  color: var(--el-text-color-secondary) !important;
}

/* 4. 解决原有颜色类冲突，让它使用 Element Plus 的深色变量 */
.ai-card-dark .ai-value {
  /* 解决 token 消耗的颜色 (font-mono) 在深色模式下的冲突 */
  color: var(--el-text-color-primary) !important;
}

/* 保留原有绿色和蓝色，让它们在深色下看起来舒服 */
.ai-card-dark .text-green-600 {
  color: #4ade80 !important; /* text-green-400 */
}
.ai-card-dark .text-blue-600 {
  color: #60a5fa !important; /* text-blue-400 */
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

/* 样式穿透：确保 El-Card 内容区域背景透明 */
.ai-card :deep(.el-card__body) {
  padding: 0 !important;
  background-color: transparent !important;
}
</style>
