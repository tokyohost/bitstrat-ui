<template>
  <div>
    <el-button type="primary" @click="openDialog" icon="Plus">充值</el-button>

    <el-dialog v-model="visible" title="账户充值" width="480px" @close="resetState">
      <div class="pay-container">
        <!-- 金额预设 -->
        <div class="pay-title">选择金额</div>
        <div class="amount-box">
          <div
            v-for="preset in presetAmountList"
            :key="preset"
            class="amount-item"
            :class="{ active: form.amount == preset }"
            @click="selectPreset(preset)"
          >
            {{ preset }} 元
          </div>

          <div class="amount-input-wrap">
            <el-input v-model="form.amount" type="number" placeholder="自定义金额" @input="onAmountInput" />
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="pay-title">支付方式</div>
        <div class="pay-method-box">
          <div class="pay-method-item" :class="{ active: form.payType === 'alipay' }" @click="form.payType = 'alipay'">
            <img src="../../../assets/icons/png/alipay.png" class="pay-icon" />
            <span>支付宝</span>
          </div>
        </div>

        <div class="submit-wrap"></div>

        <!-- 二维码展示 -->
        <div v-if="qrCodeBase64 && !paySuccess" class="qrcode-box">
          <p>请使用支付宝扫码支付</p>
          <img :src="qrCodeBase64" class="qrcode-img" />
        </div>

        <!-- 支付成功动画 -->
        <transition name="fade-zoom">
          <div v-if="paySuccess" class="success-box">
            <div class="checkmark-circle">
              <div class="background"></div>
              <div class="checkmark draw"></div>
            </div>
            <p class="success-text">支付成功！</p>
          </div>
        </transition>
      </div>

      <template #footer>
        <el-button type="primary" @click="createOrder">生成支付二维码</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

// dialog 是否显示
const visible = ref(false);

// 二维码（后端返回 Base64）
const qrCodeBase64 = ref('');

// 支付成功动画
const paySuccess = ref(false);

// 轮询计时器
let pollTimer = null;

// 金额预设
const presetAmountList = [10, 30, 50, 100];

// 表单
const form = ref({
  payType: 'alipay',
  amount: ''
});

/** 打开弹框 */
const openDialog = () => {
  visible.value = true;
};

/** 金额预设选择 */
const selectPreset = (val) => {
  form.value.amount = val;
};

/** 格式化金额 */
const onAmountInput = () => {
  if (form.value.amount < 0) form.value.amount = '';
};

/** 创建订单并获取二维码 Base64 */
const createOrder = async () => {
  if (!form.value.amount || form.value.amount <= 0) {
    return ElMessage.error('请输入正确的充值金额');
  }

  try {
    // === ⚠️ 替换为你的真实接口 ===
    const res = await fetch('https://your-api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: form.value.amount,
        payType: form.value.payType
      })
    }).then((r) => r.json());

    if (res.code !== 200) {
      return ElMessage.error(res.msg || '生成订单失败');
    }

    // Base64 二维码
    qrCodeBase64.value = res.data.qrCodeBase64;
    const orderId = res.data.orderId;

    startPolling(orderId);
  } catch (e) {
    console.error(e);
    ElMessage.error('请求失败');
  }
};

/** 开始轮询订单状态 */
const startPolling = (orderId) => {
  clearInterval(pollTimer);

  pollTimer = setInterval(async () => {
    // TODO：你的真实订单查询接口
    const res = await fetch(`https://your-api/orderStatus/${orderId}`).then((r) => r.json());

    if (res.data?.status === 'SUCCESS') {
      handlePaySuccess();
    }
  }, 1500);
};

/** 支付成功处理 */
const handlePaySuccess = () => {
  clearInterval(pollTimer);

  paySuccess.value = true;

  setTimeout(() => {
    visible.value = false;
    resetState();
  }, 1800);
};

/** 重置状态 */
const resetState = () => {
  clearInterval(pollTimer);
  qrCodeBase64.value = '';
  paySuccess.value = false;
  form.value = {
    payType: 'alipay',
    amount: ''
  };
};
</script>

<style scoped>
.pay-title {
  margin: 12px 0 6px;
  font-weight: bold;
}

.pay-method-box {
  display: flex;
  gap: 14px;
}

.pay-method-item {
  width: 120px;
  height: 70px;
  border: 2px solid #dcdcdc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.pay-method-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.pay-icon {
  width: 26px;
  height: 26px;
  margin-bottom: 4px;
}

.amount-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.amount-item {
  padding: 8px 16px;
  background: #f7f7f7;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
}

.amount-item.active {
  background: #ecf5ff;
  border: 2px solid #409eff;
}

.amount-input-wrap {
  width: 140px;
}

.submit-wrap {
  margin-top: 18px;
  text-align: center;
}

.qrcode-box {
  text-align: center;
  margin-top: 18px;
}

.qrcode-img {
  width: 200px;
  height: 200px;
}

/* 支付成功动画 */
.success-box {
  text-align: center;
  margin-top: 20px;
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  border: 4px solid #4caf50;
}

.checkmark {
  width: 45px;
  height: 25px;
  border-left: 4px solid #4caf50;
  border-bottom: 4px solid #4caf50;
  transform: rotate(-45deg);
  position: absolute;
  top: 35%;
  left: 28%;
}

.fade-zoom-enter-active {
  animation: zoomIn 0.5s ease;
}

@keyframes zoomIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-text {
  margin-top: 10px;
  color: #4caf50;
  font-size: 18px;
  font-weight: bold;
}
</style>
