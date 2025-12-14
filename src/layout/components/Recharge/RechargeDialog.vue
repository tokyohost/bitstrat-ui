<template>
  <el-dialog
    v-loading="loading"
    v-model="dialogVisible"
    :title="t('recharge.title')"
    width="600px"
    class="recharge-dialog rounded-xl"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="px-4 pb-2">
      <div v-if="!showQrCode">
        <div class="mb-6">
          <div class="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <el-icon class="mr-1 text-blue-500"><Wallet /></el-icon> {{ t('recharge.paymentMethod') }}
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div
              class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors gap-2"
              :class="payType === 'alipay' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'"
              @click="payType = 'alipay'"
            >
              <i class="i-carbon-logo-alipay text-2xl text-blue-500"></i><img src="../../../assets/icons/png/alipay.png" height="20" width="20" />
              <span class="font-medium text-gray-700">{{ t('recharge.alipay') }}</span>
              <el-icon v-if="payType === 'alipay'" class="text-blue-500 ml-auto"><Select /></el-icon>
            </div>
            <div
              class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors gap-2"
              :class="payType === 'stripe' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'"
              @click="payType = 'stripe'"
            >
              <i class="i-carbon-logo-alipay text-2xl text-blue-500"></i><img src="../../../assets/icons/png/stripe.png" height="20" width="40" />
              <span class="font-medium text-gray-700">stripe</span>
              <el-icon v-if="payType === 'stripe'" class="text-blue-500 ml-auto"><Select /></el-icon>
            </div>
            <!--            <div-->
            <!--              disabled="true"-->
            <!--              class="flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors gap-2 bg-[#ef4444]"-->
            <!--              :class="payType === 'wechat' ? 'border-green-500 bg-green-50/50' : 'border-gray-200'"-->
            <!--              @click="payType = 'wechat'"-->
            <!--            >-->
            <!--              <i class="i-carbon-logo-wechat text-2xl text-green-500"></i>-->
            <!--              <span class="font-medium text-gray-700">{{ t('recharge.wechat') }}{{ t('recharge.adapting') }}</span>-->
            <!--              <el-icon v-if="payType === 'wechat'" class="text-green-500 ml-auto"><Select /></el-icon>-->
            <!--            </div>-->
          </div>
        </div>
        <div class="text-sm font-bold text-gray-700 mb-4 flex items-center">
          <el-icon class="mr-1 text-blue-500"><Money /></el-icon> {{ t('recharge.selectAmount') }}
        </div>
        <div class="grid grid-cols-3 gap-4 mb-6" v-if="payType == 'alipay'">
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
              {{ t('recharge.popular') }}
            </div>

            <div
              class="text-xl font-bold font-mono group-hover:scale-105 transition-transform"
              :class="selectedAmount === amount ? 'text-blue-600' : 'text-gray-800'"
            >
              ¥{{ amount }}
            </div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-6" v-if="payType == 'stripe'">
          <div
            v-for="(amount, index) in stripe_pay_amount"
            :key="index"
            class="relative cursor-pointer border-2 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-md group"
            :class="selectedAmountId === amount.value ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white hover:border-blue-300'"
            @click="selectAmountId(amount.value)"
          >
            <div
              v-if="index === 2"
              class="absolute -top-3 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm transform rotate-6"
            >
              {{ t('recharge.popular') }}
            </div>

            <div
              class="text-xl font-bold font-mono group-hover:scale-105 transition-transform"
              :class="selectedAmount === amount.value ? 'text-blue-600' : 'text-gray-800'"
            >
              {{ amount.label }}
            </div>
          </div>
        </div>

        <div class="mb-8" v-if="payType == 'alipay'">
          <div class="text-xs text-gray-500 mb-2">{{ t('recharge.customAmount') }}</div>
          <el-input-number
            v-model="customAmount"
            :min="0.01"
            :max="50000"
            :precision="2"
            controls-position="right"
            class="!w-full"
            :placeholder="t('recharge.enterAmount')"
            size="large"
            @focus="selectedAmount = 0"
          >
            <template #prefix>$</template>
          </el-input-number>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-4 animate-fade-in-up">
        <div class="text-center mb-6">
          <p class="text-gray-500 text-sm mb-1">{{ t('recharge.payableAmount') }}</p>
          <p class="text-4xl font-bold font-mono text-gray-900">$ {{ payData.payAmount }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100 relative mb-6">
          <div v-if="qrLoading" class="w-48 h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <el-icon class="is-loading text-2xl text-gray-400"><Loading /></el-icon>
          </div>
          <div v-else class="relative group">
            <!--            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SimulatePayment" alt="Payment QR" class="w-48 h-48 rounded-lg" />-->
            <img :src="payData.qrCodeBase64" :alt="t('recharge.qrCode')" class="w-48 h-48 rounded-lg" />
            <div
              v-if="isExpired"
              class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center cursor-pointer"
              @click="refreshQrCode"
            >
              <el-icon class="text-2xl text-red-500 mb-2"><RefreshRight /></el-icon>
              <span class="text-sm font-bold text-gray-600">{{ t('recharge.qrExpired') }}</span>
              <span class="text-xs text-blue-500 mt-1">{{ t('recharge.qrExpiredTip') }}</span>
            </div>
          </div>

          <div class="mt-4 text-center flex items-center justify-center gap-2 text-sm text-gray-600">
            <el-icon :color="payType === 'alipay' ? '#1677ff' : '#07c160'"></el-icon>
            {{ t('recharge.qrScanTip', { method: payType === 'alipay' ? t('recharge.alipay') : t('recharge.wechat') }) }}
          </div>
        </div>

        <div class="text-xs text-gray-400">
          {{ t('recharge.qrValidity') }} <span class="text-red-400">60:00</span>{{ t('recharge.minute') }}{{ t('recharge.instantPayment') }}
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer flex justify-between items-center px-4">
        <div class="text-xs text-gray-400">
          <span v-if="!showQrCode">{{ t('recharge.instantPayment') }}</span>
          <span v-else class="text-blue-500 cursor-pointer hover:underline" @click="showQrCode = false">
            {{ t('recharge.backToModify') }}
          </span>
        </div>

        <div>
          <el-button @click="handleClose">{{ t('recharge.cancel') }}</el-button>

          <el-button
            v-if="!showQrCode"
            type="primary"
            class="!px-8 bg-gradient-to-r from-blue-600 to-blue-500 border-none hover:shadow-lg transition-shadow"
            @click="toPay"
            :disabled="finalAmount <= 0 && selectedAmountId == null"
          >
            {{ t('recharge.payNow') }}
          </el-button>

          <!--          <el-button v-else type="success" @click="simulateSuccess" :loading="checkingStatus"> {{ t('recharge.simulateSuccess') }} ({{ t('recharge.testOnly') }}) </el-button>-->
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, computed, watch } from 'vue';
import { Money, Wallet, Select, Loading, RefreshRight } from '@element-plus/icons-vue';
import { payByredict, qrPay } from '@/layout/components/Recharge/pay';
import { PayParams, QrPayResponse } from '@/layout/components/Recharge/types';
import { usePaymentPolling } from '@/hooks/usePaymentPolling';
import { getToken } from '@/utils/auth';

const { t } = useI18n();
const { startPolling, stopPolling } = usePaymentPolling();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { stripe_pay_amount } = toRefs<any>(proxy?.useDict('stripe_pay_amount'));

// --- Props & Emits ---
const props = defineProps({
  visible: { type: Boolean, default: false },
  showButton: { type: Boolean, default: false }
});
const emit = defineEmits(['update:visible', 'recharge-success']);

// --- State ---
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
});

const presetAmounts = [10, 50, 100, 200, 500, 1000];
const selectedAmount = ref(null);
const selectedAmountId = ref(null);
const customAmount = ref<number | undefined>(undefined);
const payType = ref<'alipay' | 'wechat' | 'stripe' | string>('stripe');

const showQrCode = ref(false);
const qrLoading = ref(false);
const loading = ref(false);
const isExpired = ref(false);
const checkingStatus = ref(false);

// --- Computed ---
const finalAmount = computed(() => {
  if (customAmount.value && customAmount.value > 0) {
    return customAmount.value;
  }
  return selectedAmount.value;
});

// --- Methods ---

const selectAmount = (val: number) => {
  selectedAmount.value = val;
  customAmount.value = undefined;
};
const selectAmountId = (val: string) => {
  selectedAmountId.value = val;
  customAmount.value = undefined;
};

const payParams = ref<PayParams>({
  payAmount: 0,
  payType: 'alipay'
});

const payData = ref<QrPayResponse>();

const toPay = () => {
  if (payType.value === 'alipay') {
    handleCreateOrder();
  } else if (payType.value === 'stripe') {
    redictToStripeCheckout();
  }
};
const redictToStripeCheckout = async () => {
  if (selectedAmountId.value == null) {
    return ElMessage.error(t('recharge.stripeAmountError'));
  }
  payParams.value.priceId = selectedAmountId.value;
  payParams.value.payType = payType.value;
  // 开始 Loading
  showQrCode.value = false;
  loading.value = true;
  const payCallBack = await payByredict(payParams.value);
  if (payCallBack.code === 200) {
    console.log(payCallBack);
    const stripe = window as any;
    stripe.window.location.href = payCallBack.data.redirectUrl;
    loading.value = false;
  } else {
    ElMessage.error({
      message: payCallBack?.msg,
      type: 'error',
      duration: 2000
    });
    loading.value = false;
  }
};

// 步骤1：创建订单并获取二维码
const handleCreateOrder = async () => {
  if (finalAmount.value <= 0) return;
  payParams.value.payAmount = finalAmount.value;
  payParams.value.payType = payType.value;
  // 开始 Loading
  showQrCode.value = true;
  qrLoading.value = true;

  const response = await qrPay(payParams.value);
  if (response.code === 200) {
    const data = response.data;
    startPolling(
      data.outTradeNo,
      () => {
        // 成功回调
        ElMessage.success(t('recharge.paymentSuccess'));
        showQrCode.value = false;
        emit('recharge-success');
        handleClose();
      },
      () => {
        // 失败或超时回调
        ElMessage.error(t('recharge.failureMessage'));
        showQrCode.value = false;
      }
    );

    payData.value = data;
    qrLoading.value = false;
  } else {
    qrLoading.value = false;
    ElMessage.error({
      message: t('recharge.orderFailedMessage'),
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

// 监听自定义金额输入
watch(customAmount, (newVal) => {
  if (newVal) {
    selectedAmount.value = 0;
  }
});

onUnmounted(() => {
  stopPolling();
});
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
