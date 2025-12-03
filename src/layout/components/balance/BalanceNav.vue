<template>
  <div>
    <el-popover placement="bottom" trigger="hover" :width="280" :show-arrow="false" popper-class="!p-0 rounded-xl overflow-hidden shadow-xl">
      <template #reference>
        <div class="flex items-center justify-center h-full px-2 cursor-pointer transition-colors duration-200 hover:bg-gray-100 rounded-md group">
          <!--          <el-badge :is-dot="false" class="flex items-center">-->
          <el-icon :size="26" class="text-gray-600 group-hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
          </el-icon>
          <!--          </el-badge>-->
        </div>
      </template>

      <template #default>
        <div class="bg-white">
          <div class="px-5 pt-5 pb-2 flex justify-between items-center">
            <span class="text-xs text-gray-400 font-medium">当前可用余额 (CNY)</span>
            <el-icon
              class="cursor-pointer text-gray-400 hover:text-blue-500 transition-all"
              :class="{ 'animate-spin': refreshing }"
              @click="handleRefresh"
            >
              <Refresh />
            </el-icon>
          </div>

          <div class="px-5 pb-5 border-b border-gray-100">
            <el-skeleton v-if="!balance && balance !== 0" animated :rows="0">
              <template #template>
                <el-skeleton-item variant="h1" style="width: 60%; height: 32px" />
              </template>
            </el-skeleton>

            <div v-else class="flex items-baseline gap-1 text-gray-800">
              <span class="text-2xl font-bold font-mono tracking-tight">
                <count-to :startVal="0" :endVal="Number(balance)" :duration="1000" :decimals="6"></count-to>
              </span>
              <span class="text-xs text-gray-400">元</span>
            </div>
          </div>

          <div class="p-3 bg-gray-50 flex justify-between items-center gap-3">
            <el-button text bg size="small" class="!w-full !m-0 hover:!text-blue-600" @click="goAccountBalance"> 查看明细 </el-button>
            <el-button
              type="primary"
              size="small"
              class="!w-full !m-0 bg-gradient-to-r from-blue-600 to-blue-500 border-none hover:shadow-md transition-shadow"
              icon="Lightning"
              @click="onRechargeClick"
            >
              立即充值
            </el-button>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { Wallet, Refresh, Lightning } from '@element-plus/icons-vue';
import { CountTo } from 'vue3-count-to';
// import RechargeDialog from ... (如果需要在当前页弹窗)

// 模拟 Props 或 Store
const props = defineProps({
  balance: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['refresh', 'to-account', 'to-recharge']);

const refreshing = ref(false);

// 刷新余额逻辑
const handleRefresh = async () => {
  refreshing.value = true;
  try {
    emit('refresh'); // 通知父组件重新获取余额
    // 模拟一点延迟让动画显示
    await new Promise((resolve) => setTimeout(resolve, 800));
  } finally {
    refreshing.value = false;
  }
};

// 跳转到账户详情页
const goAccountBalance = () => {
  console.log('to account balance page');
  emit('to-account');
  // router.push('/user/wallet');
};

// 点击充值
const onRechargeClick = () => {
  // 方案A：跳转页面
  // goAccountBalance();

  // 方案B：触发事件打开充值弹窗
  emit('to-recharge');
};

// 初始化
onMounted(() => {
  // loadBalance();
});
</script>

<style scoped>
/* Unocss 已经处理了大部分样式，这里只需补充少量动画 */
.animate-spin {
  animation: spin 1s linear infinite;
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
