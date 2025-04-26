<template>
  <div>
    <el-dialog v-model="visibleRef" :title="title" width="1200px" style="min-height: 700px" :close-on-click-modal="false" @close="$emit('close')">
      <!-- 显示传入对象内容 -->
      <el-form ref="arbitrageFormRef" :model="arbitrageForm" :rules="roles" :label-position="'top'" :key="new Date()">
        <div class="ab-card">
          <el-card :shadow="'never'" style="flex: 1">
            <div class="form-item-algin">
              <div>
                <el-form-item :label="''">
                  <div class="tradePairHeader">
                    <TradePairTag
                      direction="long"
                      :symbol="localData.buy?.symbol"
                      :exchange="localData.buy?.exchangeName"
                      :exchangeLogo="localData.buy?.exchangeLogo"
                    />
                    <FundingRate
                      :exchange="localData.buy?.exchangeName"
                      :symbol="localData.symbol"
                      :key="new Date()"
                      @change="
                        (f) => {
                          arbitrageForm.buy.fundingRate = f;
                        }
                      "
                    ></FundingRate>
                  </div>
                </el-form-item>
                <el-form-item :label="''">
                  <BalanceCard
                    coin="USDT"
                    :symbol="localData.symbol"
                    :exchange="localData.buy?.exchangeName"
                    @change-fee="
                      (val) => {
                        buyFee = val;
                      }
                    "
                  ></BalanceCard>
                </el-form-item>
              </div>
              <div class="info-block">
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="'杠杆倍数'" prop="buy.leverage">
                      <el-input-number
                        disabled
                        :model-value="localTask?.longLeverage"
                        :min="1"
                        :max="buyCoinInfoData.maxLeverage"
                        step="1"
                        placeholder="请输入杠杆倍数"
                      >
                        <template #suffix>倍</template>
                      </el-input-number>
                      <span class="font-200 size--small m1" v-if="buyCoinInfoData.maxLeverage"> 最大{{ buyCoinInfoData.maxLeverage }} 倍</span>
                      <span class="font-200 size--small m1" v-else><el-skeleton :rows="1" :count="1" animated /></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="'下单数量'" prop="buy.size">
                      <el-input-number
                        v-model.number="arbitrageForm.buy.size"
                        placeholder=""
                        :step="minStep"
                        :max="maxSize"
                        type="number"
                        :style="{ width: '100%' }"
                        :min="minStep"
                      >
                        <template #suffix>{{ localData.symbol }}</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item :label="'预计持仓金额'" prop="buy.actualSize">
                  <el-input v-model="arbitrageForm.buy.actualSize" placeholder="0" disabled :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      <AutoFetcherMarketPrice
                        :exchange="localData.buy?.exchangeName"
                        :symbol="localData.symbol"
                        v-model:value="buyPrice"
                        @change="
                          (e) => {
                            sellPrice = e;
                          }
                        "
                      ></AutoFetcherMarketPrice>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="'预计收益'">
                  <el-input
                    v-model="arbitrageForm.buy.fundingIncome"
                    placeholder="0"
                    readonly
                    :formatter="(value) => `≈$ ${value}`"
                    :input-style="{
                      color: arbitrageForm.buy.fundingIncome > 0 ? 'green' : arbitrageForm.buy.fundingIncome < 0 ? 'red' : '#606266'
                    }"
                  >
                    <template #suffix> </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="'下单方式'" prop="buy.orderType">
                  <el-select v-model="arbitrageForm.buy.orderType" placeholder="请选择下单方式">
                    <el-option v-for="item in orderTypeSelectOptions" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-card>
          <el-card :shadow="'never'" style="flex: 1">
            <div class="form-item-algin">
              <div>
                <el-form-item :label="''">
                  <div class="tradePairHeader">
                    <TradePairTag
                      direction="short"
                      :symbol="localData.sell?.symbol"
                      :exchange="localData.sell?.exchangeName"
                      :exchangeLogo="localData.sell?.exchangeLogo"
                    />
                    <FundingRate
                      :exchange="localData.sell?.exchangeName"
                      :symbol="localData.symbol"
                      :key="new Date()"
                      @change="
                        (f) => {
                          arbitrageForm.sell.fundingRate = f;
                        }
                      "
                    ></FundingRate>
                  </div>
                </el-form-item>
                <el-form-item :label="''">
                  <BalanceCard
                    coin="USDT"
                    :symbol="localData.symbol"
                    :exchange="localData.sell?.exchangeName"
                    @change-fee="
                      (val) => {
                        sellFee = val;
                      }
                    "
                  ></BalanceCard>
                </el-form-item>
              </div>

              <div class="info-block">
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="'杠杆倍数'" prop="sell.leverage">
                      <el-input-number
                        disabled
                        :model-value="localTask?.shortLeverage"
                        :min="1"
                        :max="sellCoinInfoData.maxLeverage"
                        :step="1"
                        placeholder="请输入杠杆倍数"
                      >
                        <template #suffix>倍</template>
                      </el-input-number>
                      <span class="font-200 size--small m1" v-if="sellCoinInfoData.maxLeverage"> 最大{{ sellCoinInfoData.maxLeverage }} 倍</span>
                      <span class="font-200 size--small m1" v-else><el-skeleton :rows="1" :count="1" animated /></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="'下单数量'" prop="sell.size">
                      <el-input-number
                        v-model.number="arbitrageForm.sell.size"
                        type="number"
                        :style="{ width: '100%' }"
                        placeholder=""
                        :step="minStep"
                        :max="maxSize"
                        :min="minStep"
                      >
                        <template #suffix>{{ localData.symbol }}</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item :label="'预计持仓金额'" prop="sell.actualSize">
                  <el-input v-model="arbitrageForm.sell.actualSize" placeholder="0" disabled :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      <AutoFetcherMarketPrice
                        :exchange="localData.sell?.exchangeName"
                        :symbol="localData.symbol"
                        v-model:value="sellPrice"
                        @change="
                          (e) => {
                            sellPrice = e;
                          }
                        "
                      ></AutoFetcherMarketPrice>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="'预计收益'">
                  <el-input
                    v-model="arbitrageForm.sell.fundingIncome"
                    placeholder="0"
                    readonly
                    :formatter="(value) => `≈$ ${value}`"
                    :input-style="{
                      color: arbitrageForm.sell.fundingIncome > 0 ? 'green' : arbitrageForm.sell.fundingIncome < 0 ? 'red' : '#606266'
                    }"
                  >
                    <template #suffix> </template>
                  </el-input>
                </el-form-item>
                <el-form-item :label="'下单方式'" prop="buy.orderType">
                  <el-select v-model="arbitrageForm.sell.orderType" placeholder="请选择下单方式">
                    <el-option v-for="item in orderTypeSelectOptions" :key="item.value" :label="item.name" :value="item.value" />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-card>
        </div>
        <div class="ab-foot">
          <el-card :shadow="'never'">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item :label="'手续费(挂单)'">
                  <el-input v-model.number="finalFee" readonly :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      {{ feeCalc }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'手续费(吃单)'">
                  <el-input v-model.number="finalFeeMarket" readonly :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      {{ feeCalcMarket }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div class="ab-foot">
          <div class="ab-foot">
            <el-card :shadow="'never'">
              <el-row :gutter="5">
                <el-col :span="12">
                  <el-form-item :label="'分批下单'">
                    <el-select v-model="arbitrageForm.batchIncome" placeholder="Select" style="width: 240px">
                      <el-option v-for="item in batchIncomeSelectOptions" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="arbitrageForm.batchIncome == 1">
                  <el-form-item :label="'每批入场数量比例(%)'" prop="batchSize">
                    <el-input-number
                      v-model.number="arbitrageForm.batchSize"
                      type="number"
                      :style="{ width: '100%' }"
                      placeholder=""
                      :step="0.1"
                      :min="0.1"
                      :max="100"
                    >
                      <template #suffix>共{{ batchCount }}批</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-card>
          </div>
        </div>
      </el-form>
      <!-- 插槽：用于自定义内容 -->
      <slot :data="data"></slot>

      <template #footer>
        <!--      <el-button @click="handleSwitch">交换</el-button>-->
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">下单</el-button>
      </template>
    </el-dialog>
    <OrderResultDialog v-model.sync="showOrderResult" :success="orderResult?.success" :logs="orderResult?.logs"></OrderResultDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { ArbitrageTaskForm, CoinContractInformation } from '@/api/system/analysis/types';
import BalanceCard from '@/views/system/analysis/components/BalanceCard.vue';
import { ElForm, FormItemRule } from 'element-plus';
import { Arrayable } from 'element-plus/es/utils';
import FundingRate from '@/views/system/analysis/components/FundingRate.vue';
import { querySymbolContractInfo, querySymbolMarketPrice } from '@/api/system/common/common';
import AutoFetcherMarketPrice from '@/views/system/analysis/components/AutoFetcherMarketPrice.vue';
import { calcAnnualizedReturnSimple, calculateFundingIncome, formatToDecimal } from '@/api/system/analysis/fundingCalculator';
import { OrderResult, SymbolFee } from '@/api/system/common/types';
import { createOrder, createTask } from '@/api/system/crossExchangeArbitrageTask';
import OrderResultDialog from '@/views/system/crossExchangeArbitrageTask/components/OrderResultDialog.vue';
import { orderTypeSelectOptions } from '@/constants/order-options';
import { CrossExchangeArbitrageTaskVO } from '@/api/system/crossExchangeArbitrageTask/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '详情'
  },
  taskId: {
    type: [String, Number],
    default: '详情'
  },
  task: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

// 创建本地副本（深克隆）
const localData = reactive({ ...toRaw(props.data) });
const localTask = reactive({ ...toRaw(props.task) });
const arbitrageFormRef = ref<InstanceType<typeof ElForm>>();
const roles = reactive<ElFormRules>({
  buy: {
    size: [
      { required: true, message: '请输入套利金额', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value === 0) {
            callback(new Error('金额不能为 0'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }],
    orderType: [{ required: true, message: '请选择下单方式', trigger: 'blur' }]
    // actualSize: [
    //   {
    //     validator: (rule, value, callback) => {
    //       console.log('value = ', value);
    //       if (value !== arbitrageForm.sell.actualSize) {
    //         callback(new Error('做多做空实际金额必须对等'));
    //       } else {
    //         callback();
    //       }
    //     },
    //     trigger: 'blur'
    //   }
    // ]
  },
  batchSize:[
    { required: true, message: '请输入每次下单比例', trigger: 'blur' },
    {
    validator: (rule, value, callback) => {
      console.log('value = ', value);
      const buyBatchSize = arbitrageForm.buy.size * (value/100)
      const sellBatchSize = arbitrageForm.sell.size * (value/100)

      console.log('buyBatchSize = ', buyBatchSize);
      console.log('sellBatchSize = ', sellBatchSize);
      if (buyBatchSize < minStep.value) {
        callback(new Error('买入金额不能低于最小下单限制'+minStep.value));
      }else
      if (sellBatchSize < minStep.value) {
        callback(new Error('卖出金额不能低于最小下单限制'+minStep.value));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }],
  sell: {
    size: [
      { required: true, message: '请输入套利金额', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value === 0) {
            callback(new Error('金额不能为 0'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }],
    orderType: [{ required: true, message: '请选择下单方式', trigger: 'blur' }]
    // actualSize: [
    //   {
    //     validator: (rule, value, callback) => {
    //       console.log('value = ', value);
    //       if (value !== arbitrageForm.buy.actualSize) {
    //         callback(new Error('做多做空实际金额必须对等'));
    //       } else {
    //         callback();
    //       }
    //     },
    //     trigger: 'blur'
    //   }
    // ]
  }
});
const arbitrageForm = reactive<ArbitrageTaskForm>({
  buy: {
    size: 0,
    leverage: 1,
    actualSize: 0,
    fundingIncome: 0,
    fundingRate: 0,
    symbol: props.data?.symbol,
    exchangeName: props.data?.buy?.exchangeName
  },
  sell: {
    size: 0,
    leverage: 1,
    actualSize: 0,
    fundingIncome: 0,
    fundingRate: 0,
    symbol: props.data?.symbol,
    exchangeName: props.data?.sell?.exchangeName
  },
  batchIncome: 0,
  batchSize: 50,
  side: 1
});
const sellCoinInfoData = ref<CoinContractInformation>({
  maxLeverage: undefined
});
const buyCoinInfoData = ref<CoinContractInformation>({
  maxLeverage: undefined
});
const minStep = ref<number>(0);
const maxSize = ref<number>(0);
const buyPrice = ref<number>(0);
const sellPrice = ref<number>(0);
const finalPrice = ref<number>(0);
const finalFee = ref<number>(0);
const finalFeeMarket = ref<number>(0);
const buyFee = ref<SymbolFee>();
const sellFee = ref<SymbolFee>();
const orderResult = ref<OrderResult>({});
const showOrderResult = ref<boolean>(false);
const feeCalc = ref<string>('');
const feeCalcMarket = ref<string>('');
const batchIncomeSelectOptions = [
  {
    name: '不分批建仓',
    value: 0
  },
  {
    name: '分批建仓',
    value: 1
  }
];
const batchCount = computed(() => {
  if (!arbitrageForm.batchSize || arbitrageForm.batchSize <= 0) return 0;
  return Math.floor(100 / arbitrageForm.batchSize);
});
const load2SideCoinContract = async () => {
  console.log('load2SideCoinContract');
  const sellCoinInfo = await querySymbolContractInfo(localData.sell?.exchangeName, localData.symbol);
  const sellCoin = {};
  if (sellCoinInfo.code == 200) {
    sellCoinInfoData.value = sellCoinInfo.data;
  }
  const buyCoin = {};
  const buyCoinInfo = await querySymbolContractInfo(localData.buy?.exchangeName, localData.symbol);
  if (buyCoinInfo.code == 200) {
    buyCoinInfoData.value = buyCoinInfo.data;
  }
  const sellMinStep = sellCoinInfoData.value.contractValue * sellCoinInfoData.value.ctMult;
  const buyMinStep = buyCoinInfoData.value.contractValue * buyCoinInfoData.value.ctMult;
  minStep.value = Math.max(sellMinStep, buyMinStep);
  maxSize.value = Math.min(sellCoinInfoData.value.maxLmtSz, sellCoinInfoData.value.maxLmtSz);
  console.log('minStep', minStep.value);
  console.log('sellMinStep', sellMinStep);
  console.log('buyMinStep', buyMinStep);
  const buyPriceResult = await querySymbolMarketPrice(localData.buy?.exchangeName, localData.symbol);
  const sellPriceResult = await querySymbolMarketPrice(localData.sell?.exchangeName, localData.symbol);
  buyPrice.value = buyPriceResult.data;
  sellPrice.value = sellPriceResult.data;
};

function setupActualSizeSync(side: 'buy' | 'sell') {
  watch(
    () => [
      arbitrageForm[side].size,
      arbitrageForm[side].leverage,
      arbitrageForm[side].fundingRate,
      buyPrice.value,
      sellPrice.value,
      buyFee.value,
      sellFee.value
    ],
    ([size, leverage, fundingRate, buyPrice, sellPrice, buyFeeValue, sellFeeValue]) => {
      // console.log(size, leverage, fundingRate, buyPrice, sellPrice,buyFeeValue,sellFeeValue);
      arbitrageForm[side].actualSize = size * leverage * (side == 'buy' ? buyPrice : sellPrice);
      arbitrageForm[side].fundingIncome = calculateFundingIncome(arbitrageForm[side].actualSize, fundingRate, side == 'buy' ? 'long' : 'short');
      finalPrice.value = arbitrageForm.buy.fundingIncome + arbitrageForm.sell.fundingIncome;

      //手续费计算公式 = buy 开仓金额
      finalFee.value = Number(
        formatToDecimal(
          arbitrageForm.buy.actualSize * buyFeeValue?.linerMakerFeeRate + arbitrageForm.sell.actualSize * sellFeeValue?.linerMakerFeeRate,
          4
        )
      );
      finalFeeMarket.value = Number(
        formatToDecimal(
          arbitrageForm.buy.actualSize * buyFeeValue?.linerTakerFeeRate + arbitrageForm.sell.actualSize * sellFeeValue?.linerTakerFeeRate,
          4
        )
      );
      feeCalc.value = `${formatToDecimal(arbitrageForm.buy.actualSize, 4)} * ${formatToDecimal(buyFeeValue?.linerMakerFeeRate, 5)} + ${formatToDecimal(arbitrageForm.sell.actualSize, 4)} * ${formatToDecimal(sellFeeValue?.linerMakerFeeRate, 5)}`;
      feeCalcMarket.value = `${formatToDecimal(arbitrageForm.buy.actualSize, 4)} * ${formatToDecimal(buyFeeValue?.linerTakerFeeRate, 5)} + ${formatToDecimal(arbitrageForm.sell.actualSize, 4)} * ${formatToDecimal(sellFeeValue?.linerTakerFeeRate, 5)}`;
    },
    { immediate: true } // 初始化时就执行一次
  );
}

// 监听 buy 和 sell 两边
setupActualSizeSync('buy');
setupActualSizeSync('sell');

// 如果 props.data 可能会变，保持同步（可选）
watch(
  () => props.data,
  (newData) => {
    Object.assign(localData, toRaw(newData));
    load2SideCoinContract();
  }
);
watch(
  () => props.task,
  (newData) => {
    Object.assign(localTask, toRaw(newData));
    // load2SideCoinContract();
  }
);
const emit = defineEmits(['update:visible', 'close', 'confirm']);

// 双向绑定 visible
const visibleRef = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    // console.log('watch visible', val);
    visibleRef.value = val;
  }
);
watch(visibleRef, (val) => emit('update:visible', val));

// 显示数据（去 Proxy）
const toDisplayObject = computed(() => {
  try {
    return JSON.stringify(toRaw(props.data), null, 2);
  } catch {
    return '[无法解析对象]';
  }
});

const handleCancel = () => {
  visibleRef.value = false;
};

const handleSwitch = () => {
  //交换
  swapBuySell();
};
// 对调函数
function swapBuySell() {
  const tmp = localData.buy;
  localData.buy = localData.sell;
  localData.sell = tmp;
}

const handleConfirm = () => {
  emit('confirm', localData);
  arbitrageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      arbitrageForm.taskId = props.taskId;
      const data = {
        argitrageData: { ...localData },
        from: { ...arbitrageForm },
        batchIncome:arbitrageForm.batchIncome,
        batchSize: arbitrageForm.batchSize,
      };
      console.log(JSON.stringify(toRaw(data), null, 2));
      const globalLoading = ElLoading.service({ fullscreen: true });
      const response = await createOrder(data);
      visibleRef.value = false;
      const result = response.data;
      if (result?.success === true) {
        //下单成功
        orderResult.value = result;
      } else {
        //下单失败
        orderResult.value = result;
      }
      showOrderResult.value = true;
      globalLoading.close();
    }
  });
  // visibleRef.value = false;
};
onMounted(() => {});
</script>

<style scoped>
pre {
  background-color: #f8f8f8;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
}

.ab-card {
  display: flex;
  gap: 16px;
}

.form-item-algin {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  height: 100%;
}

>>> .el-card__body {
  height: 100%;
}

.tradePairHeader {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.ab-foot {
  margin-top: 5px;
}
</style>
