<template>
  <el-dialog :title="title+'('+form.symbol+')'" v-model="localVisible" width="900px" append-to-body>
    <el-form ref="arbitrageWarningConfigFormRef" :model="form" :rules="rules" label-width="180px">
      <el-card shadow="hover" class="warning-card">
        <template #header>
          <div class="card-header">
            <span>套利预警配置</span>
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
            />
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="套利警告阈值" prop="warningThreshold" label-width="120px">
              <el-input-number
                v-model="form.warningThreshold"
                :disabled="form.status == 0"
                style="width: 100%"
                placeholder="请输入警告阈值"
                :precision="4"
                :step="0.1"
                :max="10"
              >
                <template #suffix>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="warning-card">
        <template #header>
          <div class="card-header">
            <span>爆仓预警配置</span>
            <el-switch
              v-model="form.liquidationConfigStatus"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
            />
          </div>
        </template>
        <div class="liquidation-config-container">
          <!-- 左侧做多交易所配置 -->
          <div class="liquidation-section">
            <div class="exchange-info">
              <span class="exchange-name"><ExchangeLogo :exchange="form.longEx" :key="new Date().getMilliseconds()"/></span>
              <span class="position-type">(做多强平)</span>
            </div>
            <div class="market-price-container">
              <span class="market-price-label">现价:</span>
              <span class="market-price-value">{{ longMarketPrice }}</span>
              <el-icon :class="{ 'is-loading': true }" class="refresh-icon"><Refresh /></el-icon>
            </div>
            <div class="price-info-container">
              <div class="price-row">
                <span class="price-label">
                  强平价格
                  <el-tooltip content="当价格触及强平线时，将被交易所强制平仓" placement="top">
                    <el-icon class="info-icon"><Warning /></el-icon>
                  </el-tooltip>
                </span>
                <span class="price-value danger-text">{{ form.longLiqPx }}</span>
              </div>
              <template v-if="form.liquidationConfigStatus === 1 && form.longLiquidationThreshold && longMarketPrice !== '-'">
                <div class="threshold-row">
                  <div class="threshold-info">
                    <span class="threshold-label">
                      当价格从
                      <el-tag size="small" type="info" class="threshold-tag">
                        {{ longMarketPrice }}
                      </el-tag>
                    </span>
                    <el-tooltip 
                      :content="`如果从当前价格${longMarketPrice}下跌${form.longLiquidationThreshold}%后的预期价格`"
                      placement="top"
                    >
                      <el-icon class="info-icon"><InfoFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="threshold-row">
                  <span class="threshold-label">
                    上涨{{ form.longLiquidationThreshold }}%:
                    <el-tag 
                      size="small" 
                      :type="isNearLongLiqPrice('up') ? 'danger' : 'info'"
                      class="threshold-tag"
                    >
                      {{ calculateThresholdPrice(longMarketPrice, form.longLiquidationThreshold, 'up') }}
                    </el-tag>
                  </span>
                </div>
              </template>
            </div>
            <el-form-item label="预警阈值" prop="longLiquidationThreshold" label-width="80px">
              <el-input-number
                v-model="form.longLiquidationThreshold"
                :disabled="form.liquidationConfigStatus == 0"
                style="width: 100%"
                placeholder="请输入预警阈值"
                :precision="4"
                :step="0.1"
                :max="100"
              >
                <template #suffix>%</template>
              </el-input-number>
            </el-form-item>
            <!-- <el-form-item label="预警间隔" prop="longLiquidationInterval">
              <el-input-number
                v-model="form.longLiquidationInterval"
                :disabled="form.liquidationConfigStatus == 0"
                style="width: 100%"
                placeholder="请输入预警间隔"
                :min="1"
                :max="1440"
              >
                <template #suffix>分钟</template>
              </el-input-number>
            </el-form-item> -->
          </div>

          <!-- 右侧做空交易所配置 -->
          <div class="liquidation-section">
            <div class="exchange-info">
              <span class="exchange-name"><ExchangeLogo :exchange="form.shortEx" :key="new Date().getMilliseconds()"/></span>
              <span class="position-type">(做空强平)</span>
            </div>
            <div class="market-price-container">
              <span class="market-price-label">现价:</span>
              <span class="market-price-value">{{ shortMarketPrice }}</span>
              <el-icon :class="{ 'is-loading': true }" class="refresh-icon"><Refresh /></el-icon>
            </div>
            <!-- 右侧做空部分 -->
            <div class="price-info-container">
              <div class="price-row">
                <span class="price-label">
                  强平价格
                  <el-tooltip content="当价格触及强平线时，将被交易所强制平仓" placement="top">
                    <el-icon class="info-icon"><Warning /></el-icon>
                  </el-tooltip>
                </span>
                <span class="price-value danger-text">{{ form.shortLiqPx }}</span>
              </div>
              <template v-if="form.liquidationConfigStatus === 1 && form.shortLiquidationThreshold && shortMarketPrice !== '-'">
                <div class="threshold-row">
                  <div class="threshold-info">
                    <span class="threshold-label">
                      当价格从
                      <el-tag size="small" type="info" class="threshold-tag">
                        {{ shortMarketPrice }}
                      </el-tag>
                    </span>
                    <el-tooltip 
                      :content="`如果从当前价格${shortMarketPrice}上涨${form.shortLiquidationThreshold}%后的预期价格`" 
                      placement="top"
                    >
                      <el-icon class="info-icon"><InfoFilled /></el-icon>
                    </el-tooltip>
                  </div>
                </div>
                <div class="threshold-row">
                  <span class="threshold-label">
                    上涨{{ form.shortLiquidationThreshold }}%:
                    <el-tag 
                      size="small" 
                      :type="isNearShortLiqPrice('up') ? 'danger' : 'info'"
                      class="threshold-tag"
                    >
                      {{ calculateThresholdPrice(shortMarketPrice, form.shortLiquidationThreshold, 'up') }}
                    </el-tag>
                  </span>
                </div>
              </template>
            </div>
            <el-form-item label="预警阈值" prop="shortLiquidationThreshold" label-width="80px">
              <el-input-number
                v-model="form.shortLiquidationThreshold"
                :disabled="form.liquidationConfigStatus == 0"
                style="width: 100%"
                placeholder="请输入预警阈值"
                :precision="4"
                :step="0.1"
                :max="100"
              >
                <template #suffix>%</template>
              </el-input-number>
            </el-form-item>
            <!-- <el-form-item label="预警间隔" prop="shortLiquidationInterval">
              <el-input-number
                v-model="form.shortLiquidationInterval"
                :disabled="form.liquidationConfigStatus == 0"
                style="width: 100%"
                placeholder="请输入预警间隔"
                :min="1"
                :max="1440"
              >
                <template #suffix>分钟</template>
              </el-input-number>
            </el-form-item> -->
          </div>
        </div>
      </el-card>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { listCrossExchangeArbitrageTask } from '@/api/system/crossExchangeArbitrageTask';
import { getArbitrageWarningConfig, addArbitrageWarningConfig, updateArbitrageWarningConfig, getByTaskId } from '@/api/system/arbitrageWarningConfig';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { Refresh, Warning, InfoFilled } from '@element-plus/icons-vue'
import { querySymbolMarketPrice } from '@/api/system/common/common';


const props = defineProps({
  title: {
    type: String,
    default: '配置套利告警'
  },
  visible: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: [String, Number],
    default: 0
  },
});
const arbitrageWarningConfigFormRef = ref<ElFormInstance>();
const emit = defineEmits(['update:visible', 'submit']);

const taskIdV = ref(0);
const arbitrageTypeV = ref(0);

// 使用本地变量来管理可见性，确保与父组件的双向绑定
const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const form = ref({
  taskId: undefined,
  warningThreshold: undefined,
  configName: undefined,
  status: 0,
  remark: undefined,
  liquidationConfigStatus: 0,
  longLiquidationThreshold: undefined,
  longLiquidationInterval: undefined,
  shortLiquidationThreshold: undefined,
  shortLiquidationInterval: undefined,
  longEx: undefined,
  shortEx: undefined,
});

// 动态计算校验规则
const rules = computed(() => ({
  warningThreshold: [{ 
    required: form.value.status === 1, 
    message: '请输入警告阈值', 
    trigger: 'change' 
  }],
  longLiquidationThreshold: [{ 
    required: form.value.liquidationConfigStatus === 1, 
    message: '请输入做多预警阈值', 
    trigger: 'change' 
  }],
  shortLiquidationThreshold: [{ 
    required: form.value.liquidationConfigStatus === 1, 
    message: '请输入做空预警阈值', 
    trigger: 'change' 
  }]
}));

// Watch status changes to trigger validation
watch([
  () => form.value.status,
  () => form.value.liquidationConfigStatus
], () => {
  // 延迟执行以确保DOM更新
  nextTick(() => {
    arbitrageWarningConfigFormRef.value?.validateFields([
      'warningThreshold',
      'longLiquidationThreshold',
      'shortLiquidationThreshold'
    ]);
  });
});

const buttonLoading = ref(false);


const fetchWarningConfig = async (arbitrageType, configParam) => {
  const res = await getByTaskId(arbitrageType, configParam.taskId);
  arbitrageTypeV.value = arbitrageType;
  taskIdV.value = configParam.taskId;
  console.log('fetchWarningConfig', res)
  if (res.data) {
    form.value = {
      ...res.data,
      ...configParam,
      status: res.data.status || 0, // 确保status有默认值
      liquidationConfigStatus: res.data.liquidationConfigStatus || 0 // 确保liquidationConfigStatus有默认值
    };
  }
};
defineExpose({ fetchWarningConfig })


const submitForm = async () => {
  arbitrageWarningConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        buttonLoading.value = true;
        form.value.arbitrageType = arbitrageTypeV.value;
        form.value.taskId = taskIdV.value;
        if (form.value.id) {
          await updateArbitrageWarningConfig(form.value);
        } else {
          await addArbitrageWarningConfig(form.value);
        }
        ElMessage.success('操作成功');
        localVisible.value = false; // 更新本地可见性
        emit('submit', form.value);
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        buttonLoading.value = false;
      }
    }
  })
}

const cancel = () => {
  localVisible.value = false; // 更新本地可见性
};

const longMarketPrice = ref('-')
const shortMarketPrice = ref('-')
let priceTimer: NodeJS.Timer | null = null

const updateMarketPrices = async () => {
  try {
    if (form.value.longEx && form.value.symbol) {
      const longRes = await querySymbolMarketPrice(form.value.longEx, form.value.symbol)
      if (longRes.code === 200) {
        longMarketPrice.value = longRes.data
      }
    }
    if (form.value.shortEx && form.value.symbol) {
      const shortRes = await querySymbolMarketPrice(form.value.shortEx, form.value.symbol)
      if (shortRes.code === 200) {
        shortMarketPrice.value = shortRes.data
      }
    }
  } catch (error) {
    console.error('Failed to update market prices:', error)
  }
}

// Start price updates when dialog opens
watch(() => localVisible.value, (newVal) => {
  if (newVal) {
    updateMarketPrices()
    priceTimer = setInterval(updateMarketPrices, 5000)
  } else {
    if (priceTimer) {
      clearInterval(priceTimer)
      priceTimer = null
    }
  }
})

// Clean up on component unmount
onUnmounted(() => {
  if (priceTimer) {
    clearInterval(priceTimer)
  }
})

const isNearLongLiqPrice = (direction: 'up' | 'down') => {
  if (!form.value.longLiqPx || !longMarketPrice.value || longMarketPrice.value === '-') return false;
  
  const currentPrice = parseFloat(longMarketPrice.value);
  const liqPrice = parseFloat(form.value.longLiqPx);
  const threshold = parseFloat(form.value.longLiquidationThreshold || '0');
  
  if (direction === 'down') {
    const downPrice = currentPrice * (1 - threshold / 100);
    return Math.abs(downPrice - liqPrice) / liqPrice < 0.05; // 5% threshold
  }
  return false;
};

const isNearShortLiqPrice = (direction: 'up' | 'down') => {
  if (!form.value.shortLiqPx || !shortMarketPrice.value || shortMarketPrice.value === '-') return false;
  
  const currentPrice = parseFloat(shortMarketPrice.value);
  const liqPrice = parseFloat(form.value.shortLiqPx);
  const threshold = parseFloat(form.value.shortLiquidationThreshold || '0');
  
  if (direction === 'up') {
    const upPrice = currentPrice * (1 + threshold / 100);
    return Math.abs(upPrice - liqPrice) / liqPrice < 0.05; // 5% threshold
  }
  return false;
};

// 添加价格计算函数
const calculateThresholdPrice = (currentPrice: string, threshold: number, direction: 'up' | 'down') => {
  const price = parseFloat(currentPrice);
  if (isNaN(price) || !threshold) return '-';
  
  const multiplier = direction === 'up' ? (1 + threshold / 100) : (1 - threshold / 100);
  return (price * multiplier).toFixed(4);
};
</script>

<style scoped>
.warning-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.liquidation-config-container {
  display: flex;
  gap: 20px;
}

.liquidation-section {
  flex: 1;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.exchange-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 8px;
}

.exchange-name {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.position-type {
  color: #666;
  align-self: flex-start;
}

.warning-card :deep(.el-form-item__label) {
  padding-left: 0;
}

.warning-card :deep(.el-form-item) {
  margin-left: 0;
}

.market-price-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: var(--el-bg-color-page);
  border-radius: 4px;
}

.market-price-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.market-price-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.refresh-icon {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  animation: rotate 2s linear infinite;
}

.price-info-container {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(to right, rgba(var(--el-color-primary-rgb), 0.02), rgba(var(--el-color-primary-rgb), 0.05));
  border-radius: 8px;
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--el-border-color);
}

.price-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--el-text-color-regular);
  font-size: 14px;
}

.info-icon {
  font-size: 14px;
  color: var(--el-color-info);
  cursor: help;
  transition: color 0.2s;
}

.info-icon:hover {
  color: var(--el-color-primary);
}

.price-value {
  font-size: 16px;
  font-weight: 600;
}

.danger-text {
  color: var(--el-color-danger);
  background: rgba(var(--el-color-danger-rgb), 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.threshold-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.threshold-row:hover {
  background-color: var(--el-fill-color-light);
}

.threshold-label {
  color: var(--el-text-color-secondary);
}

.threshold-value {
  font-weight: 500;
  color: var(--el-text-color-primary);
  font-family: var(--el-font-family-monospace);
}

.threshold-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.threshold-tag {
  margin: 0 4px;
  font-family: var(--el-font-family-monospace);
}

.warning-indicator {
  display: flex;
  align-items: center;
  animation: pulse 2s infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
