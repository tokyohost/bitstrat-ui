<template>
  <el-card class="w-full card-balance" :shadow="false">
    <template #header>
      <div class="flex flex-col">
        <div class="flex justify-between items-center">
          <span>{{ exchange }} - {{ coin }} 余额</span>
          <el-button size="small" @click="flushed" :loading="loading" icon="Refresh"> 刷新 </el-button>
        </div>
        <div class="flex justify-start items-center">
          <span>{{ balance && balance.apiName ? balance.apiName : '-' }}</span>
          <el-icon v-if="!disableSwitchAccount" class="hover:cursor-pointer hover:color-emerald ml1 color-amber" color="amber" @click="showAccount"
            ><Switch
          /></el-icon>
        </div>
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
    <AccountSelectDialog v-model:visible="accountPanelShow" :exchange-name="exchange" @select="selectAccount"></AccountSelectDialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { AccountBalance, QueryBalanceBody, QueryFeeBody, SymbolFee } from '@/api/system/common/types';
import { queryBalanceByEx, queryFeeByExSymbol } from '@/api/system/common/common';
import ExchangeBalance from '@/views/system/analysis/components/ExchangeBalance.vue';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';

const props = withDefaults(
  defineProps<{
    symbol: string;
    coin: string;
    exchange: string;
    apiId?: number;
    disableSwitchAccount?: boolean;
  }>(),
  {
    disableSwitchAccount: false
  }
);

const apiAccount = ref<ApiVO | null>(null);
const apiAccountId = ref(props.apiId);
const loading = ref(false);
const balance = ref<AccountBalance | null>(null);
const fee = ref<SymbolFee | null>(null);
const emit = defineEmits<{
  (e: 'changeFee', val: SymbolFee): void;
  (e: 'changeAccount', val: number): void;
}>();
const accountPanelShow = ref(false);

const showAccount = () => {
  accountPanelShow.value = true;
};
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
      exchange: props.exchange,
      apiId: apiAccountId.value
    } as QueryBalanceBody);
    balance.value = data;
    apiAccountId.value = data.apiId;
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
      exchange: props.exchange,
      apiId: apiAccountId.value
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

const selectAccount = (account: ApiVO) => {
  apiAccount.value = account;
  apiAccountId.value = account.id as number;
  emit('changeAccount', account.id as number);
  flushed();
};
const getAccountId = async (): Promise<number> => {
  console.log('getAccountId', apiAccountId.value);
  if (apiAccountId.value == undefined) {
    await fetchBalance();
  }
  return apiAccountId.value;
};
defineExpose({
  getAccountId
});

// 初始化加载
onMounted(() => {
  fetchBalance();
  fetchFee();
});

// 响应 symbol / exchange 变更
watch(() => [props.symbol, props.exchange], fetchBalance);
watch(
  () => props.apiId,
  async (apiId) => {
    console.log('load apiId', apiId);
    // if (apiId == undefined) {
    //   await fetchBalance();
    // }
  },
  { immediate: true }
);
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
