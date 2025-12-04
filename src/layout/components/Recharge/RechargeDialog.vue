<template>
  <el-dialog
    v-model="dialogVisible"
    title="账户充值"
    width="600px"
    class="recharge-dialog rounded-xl"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="px-4 pb-2">
      <div v-if="!showQrCode">
        <div class="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <el-icon class="mr-1 text-blue-500"><Money /></el-icon> 选择充值金额
        </div>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div
            v-for="(amount, index) in presetAmounts"
            :key="index"
            class="relative cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md group"
            :class="selectedAmount === amount ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-300'"
            @click="selectAmount(amount)"
          >
            <div
              v-if="index === 2"
              class="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transform rotate-6"
            >
              热门
            </div>

            <div
              class="text-xl font-bold font-mono group-hover:scale-105 transition-transform"
              :class="selectedAmount === amount ? 'text-blue-600' : 'text-gray-800'"
            >
              ¥{{ amount }}
            </div>
          </div>
        </div>

        <div class="mb-8">
          <div class="text-xs text-gray-500 mb-2">或输入自定义金额</div>
          <el-input-number
            v-model="customAmount"
            :min="0.01"
            :max="50000"
            :precision="2"
            controls-position="right"
            class="!w-full"
            placeholder="请输入金额"
            size="large"
            @focus="selectedAmount = 0"
          >
            <template #prefix>¥</template>
          </el-input-number>
        </div>

        <div class="mb-6">
          <div class="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <el-icon class="mr-1 text-blue-500"><Wallet /></el-icon> 支付方式
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div
              class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors gap-2"
              :class="payType === 'alipay' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'"
              @click="payType = 'alipay'"
            >
              <i class="i-carbon-logo-alipay text-2xl text-blue-500"></i><img src="../../../assets/icons/png/alipay.png" height="20" width="20" />
              <span class="font-medium text-gray-700">支付宝</span>
              <el-icon v-if="payType === 'alipay'" class="text-blue-500 ml-auto"><Select /></el-icon>
            </div>
            <!--            <div-->
            <!--              disabled="true"-->
            <!--              class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors gap-2 bg-[#ef4444]"-->
            <!--              :class="payType === 'wechat' ? 'border-green-500 bg-green-50/50' : 'border-gray-200'"-->
            <!--              @click="payType = 'wechat'"-->
            <!--            >-->
            <!--              <i class="i-carbon-logo-wechat text-2xl text-green-500"></i>-->
            <!--              <span class="font-medium text-gray-700">微信支付(正在适配)</span>-->
            <!--              <el-icon v-if="payType === 'wechat'" class="text-green-500 ml-auto"><Select /></el-icon>-->
            <!--            </div>-->
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-4 animate-fade-in-up">
        <div class="text-center mb-6">
          <p class="text-gray-500 text-sm mb-1">应付金额</p>
          <p class="text-4xl font-bold font-mono text-gray-900">¥ {{ payData.payAmount }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative mb-6">
          <div v-if="qrLoading" class="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <el-icon class="is-loading text-2xl text-gray-400"><Loading /></el-icon>
          </div>
          <div v-else class="relative group">
            <!--            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SimulatePayment" alt="Payment QR" class="w-48 h-48 rounded-lg" />-->
            <img :src="payData.qrCodeBase64" alt="Payment QR" class="w-48 h-48 rounded-lg" />
            <div
              v-if="isExpired"
              class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center cursor-pointer"
              @click="refreshQrCode"
            >
              <el-icon class="text-2xl text-red-500 mb-2"><RefreshRight /></el-icon>
              <span class="text-sm font-bold text-gray-600">二维码已过期</span>
              <span class="text-xs text-blue-500 mt-1">点击刷新</span>
            </div>
          </div>

          <div class="mt-4 text-center flex items-center justify-center gap-2 text-sm text-gray-600">
            <el-icon :color="payType === 'alipay' ? '#1677ff' : '#07c160'"></el-icon>
            请使用{{ payType === 'alipay' ? '支付宝' : '微信' }}扫一扫
          </div>
        </div>

        <div class="text-xs text-gray-400">二维码有效期 <span class="text-red-400">60:00</span>，请尽快完成支付</div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer flex justify-between items-center px-4">
        <div class="text-xs text-gray-400">
          <span v-if="!showQrCode">即时到账，安全快捷</span>
          <span v-else class="text-blue-500 cursor-pointer hover:underline" @click="showQrCode = false"> &lt; 返回修改金额 </span>
        </div>

        <div>
          <el-button @click="handleClose">取 消</el-button>

          <el-button
            v-if="!showQrCode"
            type="primary"
            class="!px-8 bg-gradient-to-r from-blue-600 to-blue-500 border-none hover:shadow-lg transition-shadow"
            @click="handleCreateOrder"
            :disabled="finalAmount <= 0"
          >
            立即支付 ¥{{ finalAmount.toFixed(2) }}
          </el-button>

          <el-button v-else type="success" @click="simulateSuccess" :loading="checkingStatus"> 模拟支付成功 (测试用) </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Money, Wallet, Select, Loading, RefreshRight } from '@element-plus/icons-vue';
import { qrPay } from '@/layout/components/Recharge/pay';
import { PayParams, QrPayResponse } from '@/layout/components/Recharge/types';
import { usePaymentPolling } from '@/hooks/usePaymentPolling';

const { startPolling, stopPolling } = usePaymentPolling();
// --- Props & Emits ---
const props = defineProps({
  visible: { type: Boolean, default: false },
  showButton: { type: Boolean, default: false } // 兼容旧代码，暂不使用
});
const emit = defineEmits(['update:visible', 'recharge-success']);

// --- State ---
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const presetAmounts = [10, 50, 100, 200, 500, 1000];
const selectedAmount = ref(100);
const customAmount = ref<number | undefined>(undefined);
const payType = ref<'alipay' | 'wechat' | string>('alipay');

const showQrCode = ref(false);
const qrLoading = ref(false);
const isExpired = ref(false);
const checkingStatus = ref(false);

// --- Computed ---
// 最终支付金额：如果输入了自定义金额，优先使用自定义；否则使用选中金额
const finalAmount = computed(() => {
  if (customAmount.value && customAmount.value > 0) {
    return customAmount.value;
  }
  return selectedAmount.value;
});

// --- Methods ---

const selectAmount = (val: number) => {
  selectedAmount.value = val;
  customAmount.value = undefined; // 清空自定义输入，避免混淆
};
const payParams = ref<PayParams>({
  payAmount: 0,
  payType: 'alipay'
});

const payData = ref<QrPayResponse>();

// 步骤1：创建订单并获取二维码
const handleCreateOrder = async () => {
  if (finalAmount.value <= 0) return;
  payParams.value.payAmount = finalAmount.value;
  payParams.value.payType = payType.value;
  // 开始 Loading
  showQrCode.value = true;
  qrLoading.value = true;

  // 模拟 API 请求延迟
  // setTimeout(() => {
  //   qrLoading.value = false;
  //   // 这里应该是请求后端接口，获取 codeUrl
  //   // startPollingPaymentStatus(); // 真实场景：开始轮询支付状态
  //
  //
  // }, 1000);
  const response = await qrPay(payParams.value);
  if (response.code === 200) {
    // 这里应该是请求后端接口，获取 codeUrl
    // 真实场景：开始轮询支付状态
    const data = response.data;
    startPolling(
      data.outTradeNo,
      () => {
        // 成功回调
        ElMessage.success('支付成功！');
        showQrCode.value = false;
        emit('recharge-success');
        handleClose();
      },
      () => {
        // 失败或超时回调
        ElMessage.error('支付失败或超时');
        showQrCode.value = false;
      }
    );

    payData.value = data;
    qrLoading.value = false;
  } else {
    qrLoading.value = false;
    ElMessage.error({
      message: response.msg || '创建支付订单失败，请重试',
      type: 'error',
      duration: 2000
    });
    showQrCode.value = false;
  }
};

// 刷新二维码
const refreshQrCode = () => {
  isExpired.value = false;
  handleCreateOrder();
};

// 关闭弹窗
const handleClose = () => {
  dialogVisible.value = false;
  // 重置状态
  setTimeout(() => {
    showQrCode.value = false;
    isExpired.value = false;
    selectedAmount.value = 100;
    customAmount.value = undefined;
  }, 300);
};

// 模拟支付成功 (仅供演示)
const simulateSuccess = () => {
  checkingStatus.value = true;
  setTimeout(() => {
    checkingStatus.value = false;
    ElMessage.success({
      message: '充值成功！资金已到账',
      type: 'success',
      duration: 2000
    });
    emit('recharge-success');
    handleClose();
  }, 1000);
};

// 监听自定义金额输入，如果用户开始输入，取消预设选中
watch(customAmount, (newVal) => {
  if (newVal) {
    selectedAmount.value = 0;
  }
});

onUnmounted(()=>{
  stopPolling()
})
</script>

<style scoped>
/* 定义一个淡入向上的动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

/* 覆盖 Element Dialog 默认样式，使其更圆润 */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid #f3f4f6;
  padding: 20px;
}
:deep(.el-dialog__footer) {
  padding: 20px;
  border-top: 1px solid #f3f4f6;
  background-color: #f9fafb;
}
</style>
