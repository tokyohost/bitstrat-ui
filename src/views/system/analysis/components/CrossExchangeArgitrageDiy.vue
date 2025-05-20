<template>
  <div>
    <el-dialog v-model="visibleRef" :title="title" width="1200px" style="min-height: 700px" :close-on-click-modal="false" @close="$emit('close')">
      <template v-slot:header>
        <div class="flex justify-between">
          <div>
            <span>{{ title }}</span>
          </div>
          <div class="flex justify-end mr-10">
            <el-icon class="hover:cursor-pointer ml-1" size="20" color="#E6A23C" @click="importCode"><Download /></el-icon>
            <el-icon class="hover:cursor-pointer" size="20" color="#409EFF" @click="shareCode"><Share /></el-icon>
          </div>
        </div>
      </template>
      <!-- 显示传入对象内容 -->
      <el-form ref="arbitrageFormRef" :model="arbitrageForm" :rules="roles" :label-position="'top'" :key="new Date().getMilliseconds()">
        <div class="ab-card" :key="refershKey">
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
                      :diyExLogo="true"
                    >
                      <template v-slot:default>
                        <el-button type="primary" link @click="selectLongEx">选择交易所/币对</el-button>
                      </template>
                    </TradePairTag>

                    <div class="flex justify-center items-center">
                      <FundingRate
                        v-if="localData.buy?.exchangeName"
                        :exchange="localData.buy?.exchangeName"
                        :symbol="localData.buy?.symbol"
                        :key="new Date().getMilliseconds()"
                        @change="
                          (f) => {
                            arbitrageForm.buy.fundingRate = f;
                          }
                        "
                      ></FundingRate>
                      <span v-if="localData.buy && localData.buy.fundingIntervalHours">每{{ localData.buy.fundingIntervalHours }}小时</span>
                      <span v-else>-</span>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :label="''">
                  <BalanceCard
                    ref="buyBalanceRef"
                    v-if="localData.buy?.exchangeName"
                    coin="USDT"
                    :symbol="localData.buy?.symbol"
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
                        v-model.number="arbitrageForm.buy.leverage"
                        :min="1"
                        :max="buyCoinInfoData.maxLeverage"
                        :step="1"
                        placeholder="请输入杠杆倍数"
                      >
                        <template #suffix>倍</template>
                      </el-input-number>
                      <span class="font-200 size--small m1" v-if="buyCoinInfoData.maxLeverage"> 最大{{ buyCoinInfoData.maxLeverage }} 倍</span>
                      <span class="font-200 size--small m1" v-else><el-skeleton :rows="1" :count="1" animated /></span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item :label="'套利数量'" prop="buy.size">
                      <el-input-number
                        v-model.number="arbitrageForm.buy.size"
                        placeholder=""
                        :step="minStep"
                        :max="maxSize"
                        type="number"
                        :style="{ width: '100%' }"
                        :min="minStep"
                      >
                        <template #suffix>{{ localData.buy?.symbol }}</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item :label="'预计持仓金额'" prop="buy.actualSize">
                  <el-input v-model="arbitrageForm.buy.actualSize" placeholder="0" disabled :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      <AutoFetcherMarketPrice
                        v-if="localData.buy?.symbol"
                        :exchange="localData.buy?.exchangeName"
                        :symbol="localData.buy?.symbol"
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
                <el-form-item :label="'预计成本'" prop="buy.actualSize">
                  <el-input v-model="arbitrageForm.buy.marginSize" placeholder="0" disabled :formatter="(value) => `≈$ ${value}`"> </el-input>
                </el-form-item>
                <el-form-item :label="'预估强平价'" prop="buy.actualSize">
                  <el-input
                    v-model="arbitrageForm.buy.liqPrice"
                    placeholder="0"
                    disabled
                    :formatter="(value) => `≈$ ${value} (${calculatePriceChangePercent(buyPrice, arbitrageForm.buy.liqPrice)})`"
                  >
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
                    <template #suffix></template>
                  </el-input>
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
                      :diyExLogo="true"
                    >
                      <template v-slot:default>
                        <el-button type="primary" link @click="selectShortEx">选择交易所/币对</el-button>
                      </template>
                    </TradePairTag>
                    <div class="flex justify-center items-center">
                      <FundingRate
                        v-if="localData.sell?.exchangeName"
                        :exchange="localData.sell?.exchangeName"
                        :symbol="localData.sell?.symbol"
                        :key="new Date().getMilliseconds()"
                        @change="
                          (f) => {
                            arbitrageForm.sell.fundingRate = f;
                          }
                        "
                      ></FundingRate>
                      <span v-if="localData.sell && localData.sell.fundingIntervalHours">每{{ localData.sell.fundingIntervalHours }}小时</span>
                      <span v-else>-</span>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item :label="''">
                  <BalanceCard
                    ref="sellBalanceRef"
                    v-if="localData.sell?.exchangeName"
                    coin="USDT"
                    :symbol="localData.sell?.symbol"
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
                        v-model.number="arbitrageForm.sell.leverage"
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
                    <el-form-item :label="'套利数量'" prop="sell.size">
                      <el-input-number
                        v-model.number="arbitrageForm.sell.size"
                        type="number"
                        :style="{ width: '100%' }"
                        placeholder=""
                        :step="minStep"
                        :max="maxSize"
                        :min="minStep"
                      >
                        <template #suffix>{{ localData.sell?.symbol }}</template>
                      </el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-form-item :label="'预计持仓金额'" prop="sell.actualSize">
                  <el-input v-model="arbitrageForm.sell.actualSize" placeholder="0" disabled :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      <AutoFetcherMarketPrice
                        v-if="localData.sell?.symbol"
                        :exchange="localData.sell?.exchangeName"
                        :symbol="localData.sell?.symbol"
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
                <el-form-item :label="'预计成本'" prop="sell.actualSize">
                  <el-input v-model="arbitrageForm.sell.marginSize" placeholder="0" disabled :formatter="(value) => `≈$ ${value}`"> </el-input>
                </el-form-item>
                <el-form-item :label="'预估强平价'" prop="sell.actualSize">
                  <el-input
                    v-model="arbitrageForm.sell.liqPrice"
                    :key="arbitrageForm.sell.liqPrice"
                    placeholder="0"
                    disabled
                    :formatter="(value) => `≈$ ${value} (${calculatePriceChangePercent(sellPrice, arbitrageForm.sell.liqPrice)})`"
                  >
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
                    <template #suffix></template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </el-card>
        </div>
        <div class="ab-foot">
          <el-card :shadow="'never'">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-form-item :label="'最终收益(手续费未计入)'">
                  <el-input v-model.number="finalPrice" readonly :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      <!--                      年化{{calcAnnualizedReturnSimple(arbitrageForm.sell.actualSize + arbitrageForm.buy.actualSize,finalPrice,props.data.buy.fundingIntervalHours)}}%-->
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="'手续费(开仓)'">
                  <el-input v-model.number="finalFee" readonly :formatter="(value) => `$ ${value}`">
                    <template #suffix>
                      {{ feeCalc }}
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div class="ab-foot">
          <!--        <el-card :shadow="'never'">-->
          <!--          <el-row :gutter="5">-->
          <!--            <el-col :span="12">-->
          <!--              <el-form-item :label="'分批入场'">-->
          <!--                <el-select v-model="arbitrageForm.batchIncome" placeholder="Select" style="width: 240px">-->
          <!--                  <el-option-->
          <!--                    v-for="item in batchIncomeSelectOptions"-->
          <!--                    :key="item.value"-->
          <!--                    :label="item.name"-->
          <!--                    :value="item.value"-->
          <!--                  />-->
          <!--                </el-select>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--            <el-col :span="12" v-if="arbitrageForm.batchIncome == 1">-->
          <!--              <el-form-item :label="'每批入场数量比例'">-->
          <!--                <el-input-number-->
          <!--                  v-model.number="arbitrageForm.batchPrice"-->
          <!--                  type="number"-->
          <!--                  :style="{width:'100%'}"-->
          <!--                  placeholder="" :step="0.1"-->
          <!--                  :min="0.1" :max="100"-->
          <!--                >-->
          <!--                  <template #suffix>共{{batchCount}}批</template>-->
          <!--                </el-input-number>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--        </el-card>-->
        </div>
      </el-form>
      <!-- 插槽：用于自定义内容 -->
      <slot :data="data"></slot>
      <ExchangeSymbolSelect v-model:visible="showSelectLongEx" :disabledExchange="'Coinbase'" @confirm="longExConfirm" />
      <ExchangeSymbolSelect v-model:visible="showSelectShortEx" @confirm="shortExConfirm"></ExchangeSymbolSelect>
      <template #footer>
        <el-button @click="handleSwitch">交换</el-button>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { ArbitrageTaskForm, CoinContractInformation } from '@/api/system/analysis/types';
import BalanceCard from '@/views/system/analysis/components/BalanceCard.vue';
import { ElForm, FormItemRule } from 'element-plus';
import { Arrayable } from 'element-plus/es/utils';
import { orderTypeSelectOptions } from '@/constants/order-options';
import FundingRate from '@/views/system/analysis/components/FundingRate.vue';
import { querySymbolContractInfo, querySymbolMarketPrice } from '@/api/system/common/common';
import AutoFetcherMarketPrice from '@/views/system/analysis/components/AutoFetcherMarketPrice.vue';
import {
  calcAnnualizedReturnSimple,
  calculateFundingIncome,
  calculateMargin,
  calculatePriceChangePercent,
  estimateLiquidationPriceDecimal,
  formatToDecimal
} from '@/api/system/analysis/fundingCalculator';
import { SymbolFee } from '@/api/system/common/types';
import { createTask } from '@/api/system/crossExchangeArbitrageTask';
import ExchangeSymbolSelect from '@/views/system/analysis/components/ExchangeSymbolSelect.vue';

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
  data: {
    type: Object,
    default: () => ({})
  }
});
const showSelectLongEx = ref(false);
const showSelectShortEx = ref(false);
const refershKey = ref(1);

const sellBalanceRef = useTemplateRef('sellBalanceRef');
const buyBalanceRef = useTemplateRef('buyBalanceRef');

// 创建本地副本（深克隆）
const localData = ref({ ...toRaw(props.data) });
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
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }]
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
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }]
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
const arbitrageForm = ref<ArbitrageTaskForm>({
  buy: {
    size: 0,
    leverage: 1,
    actualSize: 0,
    marginSize: 0,
    liqPrice: 0,
    fundingIncome: 0,
    fundingRate: 0,
    symbol: props.data?.symbol,
    exchangeName: props.data?.buy?.exchangeName
  },
  sell: {
    size: 0,
    leverage: 1,
    actualSize: 0,
    marginSize: 0,
    liqPrice: 0,
    fundingIncome: 0,
    fundingRate: 0,
    symbol: props.data?.symbol,
    exchangeName: props.data?.sell?.exchangeName
  },
  batchIncome: 0,
  batchPrice: 25,
  symbol: null
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
const buyFee = ref<SymbolFee>();
const sellFee = ref<SymbolFee>();
const feeCalc = ref<string>('');
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
  if (!arbitrageForm.value.batchPrice || arbitrageForm.value.batchPrice <= 0) return 0;
  return Math.floor(100 / arbitrageForm.value.batchPrice);
});
const check2SideSymbol = () => {
  try {
    if (!(localData.value.buy.symbol && localData.value.sell.symbol)) {
      console.log('两边币对未选择完成');
      return false;
    }
  } catch (err) {
    console.log('两边币对未选择完成');
    return false;
  }

  // if (localData.value.buy.symbol !== localData.value.sell.symbol) {
  //   console.log('两边币对不一致');
  //   return false;
  // }
  return true;
};
const load2SideCoinContract = async () => {
  if (!check2SideSymbol()) {
    return;
  }
  const sellAccountId = await sellBalanceRef.value.getAccountId();
  const sellCoinInfo = await querySymbolContractInfo(localData.value.sell?.exchangeName, localData.value.sell?.symbol, sellAccountId);
  const sellCoin = {};
  if (sellCoinInfo.code == 200) {
    sellCoinInfoData.value = sellCoinInfo.data;
  }
  const buyAccountId = await buyBalanceRef.value.getAccountId();
  const buyCoin = {};
  const buyCoinInfo = await querySymbolContractInfo(localData.value.buy?.exchangeName, localData.value.buy?.symbol, buyAccountId);
  if (buyCoinInfo.code == 200) {
    buyCoinInfoData.value = buyCoinInfo.data;
  }
  const sellMinStep = sellCoinInfoData.value.step;
  const buyMinStep = buyCoinInfoData.value.step;
  minStep.value = Math.max(sellMinStep, buyMinStep);
  maxSize.value = Math.min(sellCoinInfoData.value.maxLmtSz, buyCoinInfoData.value.maxLmtSz);
  console.log('minStep', minStep.value);
  console.log('sellMinStep', sellMinStep);
  console.log('buyMinStep', buyMinStep);
  const buyPriceResult = await querySymbolMarketPrice(localData.value.buy?.exchangeName, localData.value.buy?.symbol);
  const sellPriceResult = await querySymbolMarketPrice(localData.value.sell?.exchangeName, localData.value.sell?.symbol);
  buyPrice.value = buyPriceResult.data;
  sellPrice.value = sellPriceResult.data;
};

function setupActualSizeSync(side: 'buy' | 'sell') {
  watch(
    () => [
      arbitrageForm.value[side].size,
      arbitrageForm.value[side].leverage,
      arbitrageForm.value[side].fundingRate,
      buyPrice.value,
      sellPrice.value,
      buyFee.value,
      sellFee.value
    ],
    ([size, leverage, fundingRate, buyPrice, sellPrice, buyFeeValue, sellFeeValue]) => {
      // console.log(size, leverage, fundingRate, buyPrice, sellPrice,buyFeeValue,sellFeeValue);
      arbitrageForm.value[side].actualSize = size * (side == 'buy' ? buyPrice : sellPrice);
      arbitrageForm.value[side].marginSize = calculateMargin(size, side == 'buy' ? buyPrice : sellPrice, leverage);
      arbitrageForm.value[side].liqPrice = estimateLiquidationPriceDecimal(
        side == 'buy' ? buyPrice : sellPrice,
        leverage,
        size,
        side == 'buy' ? 'long' : 'short'
      );
      arbitrageForm.value[side].fundingIncome = calculateFundingIncome(
        arbitrageForm.value[side].actualSize,
        fundingRate,
        side == 'buy' ? 'long' : 'short'
      );
      finalPrice.value = arbitrageForm.value.buy.fundingIncome + arbitrageForm.value.sell.fundingIncome;

      //手续费计算公式 = buy 开仓金额
      finalFee.value = formatToDecimal(
        arbitrageForm.value.buy.actualSize * buyFeeValue?.linerMakerFeeRate + arbitrageForm.value.sell.actualSize * sellFeeValue?.linerMakerFeeRate,
        4
      );
      feeCalc.value = `${formatToDecimal(arbitrageForm.value.buy.actualSize, 4)} * ${formatToDecimal(buyFeeValue?.linerMakerFeeRate, 4)} + ${formatToDecimal(arbitrageForm.value.sell.actualSize, 4)} * ${formatToDecimal(sellFeeValue?.linerMakerFeeRate, 4)}`;
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
    Object.assign(localData.value, toRaw(newData));
    load2SideCoinContract();
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

const longExConfirm = (exSymbol) => {
  console.log(exSymbol);
  localData.value.buy = exSymbol;
  refershKey.value++;
  load2SideCoinContract();
};
const shortExConfirm = (exSymbol) => {
  console.log(exSymbol);
  localData.value.sell = exSymbol;
  refershKey.value++;
  load2SideCoinContract();
};

const selectLongEx = () => {
  showSelectLongEx.value = true;
  console.log(showSelectLongEx);
};
const selectShortEx = () => {
  showSelectShortEx.value = true;
};

const handleCancel = () => {
  visibleRef.value = false;
};

const handleSwitch = () => {
  //交换
  swapBuySell();
};

const shareCode = () => {
  //分享
  ElMessage.info('分享套利规则正在开发中');
};
const importCode = () => {
  //导入
  ElMessage.info('导入套利规则正在开发中');
};

// 对调函数
function swapBuySell() {
  const tmp = localData.value.buy;
  localData.value.buy = localData.value.sell;
  localData.value.sell = tmp;
}

const handleConfirm = async () => {
  emit('confirm', localData.value);
  const apiId = await buyBalanceRef.value.getAccountId();

  if (!apiId) {
    ElMessage.error('please choose account first');
    return;
  }
  arbitrageForm.value.buy.accountId = apiId;
  const apiIdsell = await sellBalanceRef.value.getAccountId();

  if (!apiIdsell) {
    ElMessage.error('please choose account first');
    return;
  }
  arbitrageForm.value.sell.accountId = apiIdsell;
  arbitrageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (!check2SideSymbol()) {
        ElMessage.error('多空币对不一致！请确认多空币对为同一币对');
        return;
      }
      arbitrageForm.value.buy.symbol = localData.value.buy.symbol;
      arbitrageForm.value.buy.exchangeName = localData.value.buy.exchangeName;
      arbitrageForm.value.sell.symbol = localData.value.sell.symbol;
      arbitrageForm.value.sell.exchangeName = localData.value.sell.exchangeName;
      arbitrageForm.value.symbol = localData.value.sell.symbol;
      localData.value.symbol = localData.value.sell.symbol;
      const data = {
        argitrageData: localData.value,
        from: arbitrageForm.value
      };
      console.log(JSON.stringify(toRaw(data), null, 2));
      const response = await createTask(data);
      ElMessage.success('创建成功!');
      proxy.$router.push({
        path: '/arbitrage/crossExchangeArbitrageTask',
        query: { id: null }
      });
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
