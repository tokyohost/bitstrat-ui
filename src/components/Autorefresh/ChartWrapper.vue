<template>
  <div class="chart-wrapper">
    <div class="loading-bar-container">
      <transition name="fade">
        <div v-if="loading" class="loading-bar-fill"></div>
      </transition>
    </div>

    <div class="chart-content pt-1" :class="{ 'is-stale': loading && showMask }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide, type PropType } from 'vue';
import { emitter } from '@/utils/eventBus';

const props = defineProps({
  refreshFn: {
    type: Function as PropType<() => Promise<any>>,
    default: null
  },
  title: { type: String, default: 'Chart' },
  showMask: { type: Boolean, default: false }
});

const loading = ref(false);
// 用于存储子组件注册进来的刷新函数
const registeredRefreshFn = ref<(() => Promise<any>) | null>(null);

// 【核心：Provide】提供给子组件调用的注册方法
provide('CHART_WRAPPER_REGISTER', (fn: () => Promise<any>) => {
  registeredRefreshFn.value = fn;
});

const handleRefresh = async () => {
  // 优先级：Props 传入 > 子组件注册
  const executeFn = props.refreshFn || registeredRefreshFn.value;

  if (executeFn) {
    loading.value = true;
    try {
      await executeFn();
    } catch (err) {
      console.error(`${props.title} 刷新失败:`, err);
    } finally {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    }
  } else {
    // 如果是初次挂载 handleRefresh 执行时子组件还没注册，这里可以保持静默
    // 因为子组件注册后通常会自己触发一次初始加载
    console.debug(`[${props.title}] 暂无刷新逻辑`);
  }
};

// 监听 Bus 事件
const onDashboardRefresh = (promises: Promise<any>[]) => {
  promises.push(handleRefresh());
};

onMounted(() => {
  emitter.on('dashboard:refresh', onDashboardRefresh);
  // 注意：如果使用自动注册模式，初次加载通常由子组件内部控制或在这里稍作延迟
  // handleRefresh();
});

onUnmounted(() => {
  emitter.off('dashboard:refresh', onDashboardRefresh);
});
</script>

<style scoped>
/* 样式部分保持不变 */
.chart-wrapper {
  position: relative;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.loading-bar-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 10;
}
.loading-bar-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, transparent 0%, #32d1ff 50%, transparent 100%);
  background-size: 200% 100%;
  animation: move-stripe 1.5s infinite linear;
}
@keyframes move-stripe {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.chart-content {
  flex: 1;
  transition: opacity 0.4s ease;
}
.is-stale {
  opacity: 0.6;
  filter: grayscale(20%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
