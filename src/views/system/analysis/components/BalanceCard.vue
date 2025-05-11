<template>
  <el-card class="w-full card-balance" :shadow="false">
    <template #header>
      <div class="flex justify-between items-center">
        <span>{{ exchange }} - {{ coin }} 余额</span>
        <el-button size="small" @click="flushed" :loading="loading" icon="Refresh"> 刷新 </el-button>
      </div>
    </template>

    <div v-if="balance">
      <!--      <p style="margin: 0"><strong>统一账户可用余额：</strong>{{ balance.balance }} {{ props.coin }}</p>-->
      <!--      <p><strong>冻结余额：</strong>{{ balance.frozen }}</p>-->
      <ExchangeBalance :exchange="exchange" :balance="balance" :coin="props.coin"></ExchangeBalance>
    </div>
    <div v-else-if="loading">
      <el-skeleton :rows="1" animated />
    </div>
    <div v-else>
      <!--      <el-empty description="暂无数据" />-->
      <p>加载失败</p>
    </div>
    <div v-if="fee" class="fee-list">
      <div>
        <p style="margin: 0"><strong>合约挂单手续费：</strong>{{ fee.linerMakerFeeRate == null ? '-' : fee.linerMakerFeeRate * 100 }}%</p>
        <p style="margin: 0"><strong>合约吃单手续费：</strong>{{ fee.linerTakerFeeRate == null ? '-' : fee.linerTakerFeeRate * 100 }}%</p>
      </div>
      <div>
        <p style="margin: 0"><strong>现货挂单手续费：</strong>{{ fee.sportMakerFeeRate == null ? '-' : fee.sportMakerFeeRate * 100 + '%' }}</p>
        <p style="margin: 0"><strong>现货吃单手续费：</strong>{{ fee.sportTakerFeeRate == null ? '-' : fee.sportTakerFeeRate * 100 + '%' }}</p>
      </div>

      <!--      <p><strong>冻结余额：</strong>{{ balance.frozen }}</p>-->
    </div>

    <div v-else-if="loading">
      <el-skeleton :rows="1" animated />
    </div>
    <div v-else>
      <!--      <el-empty description="暂无数据" />-->
      <p>加载失败</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { AccountBalance, QueryBalanceBody, QueryFeeBody, SymbolFee } from '@/api/system/common/types';
import { queryBalanceByEx, queryFeeByExSymbol } from '@/api/system/common/common';
import ExchangeBalance from '@/views/system/analysis/components/ExchangeBalance.vue';

const props = defineProps<{
  symbol: string;
  coin: string;
  exchange: string;
}>();

const loading = ref(false);
const balance = ref<AccountBalance | null>(null);
const fee = ref<SymbolFee | null>(null);
const emit = defineEmits<{
  (e: 'changeFee', val: SymbolFee): void;
}>();

const flushed = async () => {
  loading.value = true;
  balance.value = null;
  fee.value = null;
  await fetchBalance();
  await fetchFee();
  loading.value = false;
};
const fetchBalance = async () => {
  if (!props.symbol || !props.exchange) return;

  loading.value = true;
  try {
    const { data } = await queryBalanceByEx({
      coin: props.coin,
      exchange: props.exchange
    } as QueryBalanceBody);
    balance.value = data;
  } catch (err) {
    console.error('获取余额失败', err);
    balance.value = null;
  } finally {
    loading.value = false;
  }
};
const fetchFee = async () => {
  if (!props.symbol || !props.exchange) return;

  loading.value = true;
  try {
    const { data } = await queryFeeByExSymbol({
      symbol: props.symbol,
      exchange: props.exchange
    } as QueryFeeBody);
    fee.value = data;
    emit('changeFee', fee.value);
  } catch (err) {
    console.error('获取手续费失败', err);
    fee.value = null;
  } finally {
    loading.value = false;
  }
};

// 初始化加载
onMounted(() => {
  fetchBalance();
  fetchFee();
});

// 响应 symbol / exchange 变更
watch(() => [props.symbol, props.exchange], fetchBalance);
</script>

<style scoped>
.el-card {
  border-radius: 10px;
}
.fee-list {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.card-balance {
  min-height: 100%;
}
</style>
