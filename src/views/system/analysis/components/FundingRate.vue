<template>
  <div class="flex items-center space-x-2 p-3 rounded border shadow-sm">
    <div v-if="showCountDown">
      <el-popover placement="right" :width="180" trigger="click" :title="'下一次结算倒计时'">
        <template #reference>
          <div class="funding-size hover:cursor-pointer">
            <div v-if="loading">
              <el-skeleton :rows="1" :count="1" animated />
            </div>
            <div :class="['text-base', 'font-semibold', 'text-600', rate > 0 ? 'down-color' : 'red']" v-else>
              {{ displayRate }}
            </div>
          </div>
        </template>
        <template #default>
          <!-- bybit 1745323200000         显示倒计时-->
          <!-- okx 1745352000000         显示倒计时-->
          <CountdownTimer :key="rateData.nextFundingTime" :timestamp="rateData?.nextFundingTime"></CountdownTimer>
        </template>
      </el-popover>
    </div>
    <div class="funding-size" v-else>
      <div v-if="loading">
        <el-skeleton :rows="1" :count="1" animated />
      </div>
      <div :class="['text-base', 'font-semibold', 'text-600', rate > 0 ? 'down-color' : 'red']" v-else>
        {{ displayRate }}
      </div>
    </div>

    <el-button size="small" @click="emitRefresh" :loading="loading" icon="Refresh" v-if="!showRefresh == false"></el-button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { querySymbolFundingRate } from '@/api/system/common/common';
import { SymbolFundingRate } from '@/views/system/analysis/components/type';
import CountdownTimer from '@/views/system/analysis/components/CountdownTimer.vue';

interface Props {
  exchange: string; // 交易所名称
  symbol: string; // 币种符号，如 BTC/USDT
  showRefresh?: boolean;
  showCountDown?: boolean;
}
const rate = ref<number>(-99);
const nextFundingTime = ref<number>(0);
const rateData = ref<SymbolFundingRate>({});
const loading = ref<boolean>(false);
const props = withDefaults(defineProps<Props>(), {
  showRefresh: true, // 设置默认值
  showCountDown: false // 设置默认值
});

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'change', val: number): void;
}>();

const loadRate = async () => {
  loading.value = true;
  const response = await querySymbolFundingRate(props.exchange, props.symbol);
  if (response.code == 200) {
    const data = response.data;
    rateData.value = data;
    rate.value = Number(data?.fundingRate) * 100;
    rateData.value.fundingRate = Number(data?.fundingRate) * 100;
    nextFundingTime.value = Number(data?.nextFundingTime);
  }
  console.log('rate', rate.value);
  emit('change', rate.value);
  loading.value = false;
};

const displayRate = computed(() => {
  return `${rate.value.toFixed(4)}%`;
});

function emitRefresh() {
  loadRate();
}
onMounted(() => {
  loadRate();
});
</script>
<style lang="scss" scoped>
.funding-size {
  min-width: 50px;
  min-height: 20px;
}
.red {
  color: red;
}
.down-color {
  color: green;
}
</style>
