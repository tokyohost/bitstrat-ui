<template>
  <div class="grafana-refresh-group">
    <el-select v-model="currentInterval" @change="handleIntervalChange" class="refresh-config" placeholder="Select" effect="dark">
      <el-option v-for="opt in options" :key="opt.value" :label="opt.label" :value="opt.value" />
    </el-select>

    <!--    <el-tooltip :content="isRefreshing ? 'Updating...' : 'Manual refresh'" placement="bottom">-->
    <div class="refresh-trigger" :class="{ 'is-loading': isRefreshing }" @click="manualRefresh">
      <div class="icon-wrapper">
        <svg class="progress-svg" viewBox="0 0 24 24">
          <circle class="track" cx="12" cy="12" r="10" />
          <circle class="bar" cx="12" cy="12" r="10" :style="progressStyle" />
        </svg>
        <el-icon class="refresh-icon"><Refresh /></el-icon>
      </div>
    </div>
    <!--    </el-tooltip>-->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Refresh } from '@element-plus/icons-vue';
import { emitter } from '@/utils/eventBus';

const props = defineProps({
  options: {
    type: Array as any,
    default: () => [
      { label: 'OFF', value: 0 },
      { label: '5s', value: 5000 },
      { label: '10s', value: 10000 },
      { label: '30s', value: 30000 },
      { label: '1m', value: 60000 },
      { label: '5m', value: 300000 }
    ]
  }
});

const currentInterval = ref(10000);
const timeLeft = ref(0);
const isRefreshing = ref(false);
let timer: any = null;

const progressStyle = computed(() => {
  if (currentInterval.value === 0 || isRefreshing.value) return { 'stroke-dashoffset': 63 };
  const progress = timeLeft.value / currentInterval.value;
  return { 'stroke-dashoffset': 63 * (1 - progress) };
});

const manualRefresh = async () => {
  if (isRefreshing.value) return;
  isRefreshing.value = true;
  if (timer) clearInterval(timer);

  const promises: Promise<any>[] = [];
  emitter.emit('dashboard:refresh', promises);
  console.log('触发刷新');

  try {
    await Promise.allSettled(promises);
  } finally {
    isRefreshing.value = false;
    resetTimer();
  }
};

const resetTimer = () => {
  if (timer) clearInterval(timer);
  if (currentInterval.value > 0) {
    timeLeft.value = currentInterval.value;
    timer = setInterval(() => {
      timeLeft.value -= 1000;
      if (timeLeft.value <= 0) manualRefresh();
    }, 1000);
  }
};

const handleIntervalChange = () => resetTimer();

onMounted(() => resetTimer());
onUnmounted(() => timer && clearInterval(timer));
</script>

<style scoped lang="scss">
.grafana-refresh-group {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid var(--el-border-color-darker);
  height: 32px;
  overflow: hidden;

  // 深度修改 Element Plus 样式使其扁平化
  :deep(.refresh-config) {
    width: 85px;

    .el-input__wrapper {
      background-color: transparent !important;
      box-shadow: none !important;
      padding-right: 0;
      //border-right: 1px solid var(--el-border-color-darker);
      border-radius: 0;
    }

    .el-input__inner {
      //color: #ebedef;
      font-size: 13px;
    }
  }
}

.refresh-trigger {
  width: 36px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
  }

  .icon-wrapper {
    position: relative;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.progress-svg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke-width: 2.5;
  }

  .track {
  }

  .bar {
    stroke: #32d1ff;
    stroke-dasharray: 63;
    transition: stroke-dashoffset 1s linear;
  }
}

.refresh-icon {
  font-size: 14px;
  color: #32d1ff;
  z-index: 2;
}

// 加载中旋转动画
.is-loading {
  .refresh-icon {
    animation: spin 1s infinite linear;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
