<script setup lang="ts">
import { ArbitrageItem, ArbitrageQuery, CoinFundingInfo, ExchangeItem, SportFundingRateItem } from '@/api/system/analysis/types';
import { fundingRateSpot, getInterestArbitrageV2, querySupportSymbol } from '@/api/system/analysis/analysis';
import CountdownTimer from '@/views/system/analysis/components/CountdownTimer.vue';
import PrettyNumber from '@/views/system/analysis/components/PrettyNumber.vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import CoinTag from '@/views/system/analysis/components/CoinTag.vue';
import { SymbolVO } from '@/api/system/task/types';
import { getSupportExchange } from '@/api/system/common/common';
import { ExchangeVo } from '@/api/system/common/types';
import DialogWrapper from '@/views/system/analysis/components/DialogWrapper.vue';
import ExchangeSelector from '@/views/system/analysis/components/ExchangeSelector.vue';
import SportTradeInfoTag from '@/views/system/analysis/components/SportTradeInfoTag.vue';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import FixedNumber from '@/views/system/analysis/components/FixedNumber.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const datalist = ref<SportFundingRateItem[]>([]);
const filterExchange = ref('');

const exchangeList = ref<string[]>({
  name: ''
});

const loading = ref(true);
const inited = ref(false);
const symbolList = ref<SymbolVO[]>([]);
const supportExchangeList = ref<ExchangeVo[]>([]);
const tableData = ref<SportFundingRateItem[]>();
const uniqueExchanges = ref<ExchangeItem[]>();
const queryParams = ref<ArbitrageQuery>({
  exchange: undefined
});

const currentPage = ref(1);
const pageSize = ref(10);
const showSearch = ref(true);
const arbitragePage = ref(false);
const arbitrageData = ref<SportFundingRateItem>();

const loadDataList = async () => {
  loading.value = true;
  try {
    const data = await fundingRateSpot();
    console.log(data);
    if (data.code == 200) {
      datalist.value = data.data || [];
      // initExchangeList();
      // updateTableData();
    }
  } finally {
    loading.value = false;
  }
};
const handle = (row: CoinFundingInfo) => {
  console.log({ ...row });
  //检查两个交易所是否都支持
  const filter = supportExchangeList.value.filter((item) => {
    return (
      item.name.toLowerCase().indexOf(row.buy.exchangeName.toLowerCase()) > -1 ||
      item.name.toLowerCase().indexOf(row.sell.exchangeName.toLowerCase()) > -1
    );
  });
  console.log(filter);
  if (filter.length == 2) {
    //支持
    arbitrageData.value = row;
    arbitragePage.value = true;
  } else {
    ElMessage.warning(`暂不支持交易所 ${row.buy.exchangeName} 与 ${row.sell.exchangeName} 套利！敬请期待`);
  }
};
// 筛选后的数据
const filteredList = computed(() => {
  console.log(datalist.value);
  return datalist.value.filter((item) => {
    // const matchSymbol = item.symbol.toLowerCase().includes(filterSymbol.value.toLowerCase());
    const matchExchange = item.exchangeName.toLowerCase().includes(filterExchange.value.toLowerCase());
    return matchExchange;
  });
});

// 当前页数据
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredList.value.slice(start, start + pageSize.value);
});

const total = computed(() => filteredList.value.length);

const handleQuery = (row) => {
  loadDataList();
};
const resetQuery = (row) => {};

// 监听分页变化
watch([currentPage, pageSize], paginatedList);
onMounted(() => {
  datalist.value = [];
  loadDataList();
  exchangeList.value = [{ name: 'Bybit' }, { name: 'Bitget' }, { name: 'OKX' }, { name: 'Binance' }];
  // loadSymbolData();
});
</script>

<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!--            <el-form-item :label="proxy.$t('bybit.task.form.symbol')" prop="symbol" :label-width="120">-->
            <!--              <el-input v-model="queryParams.symbol" :placeholder="'请输入币对'" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <el-form-item :label="'交易所'" prop="symbol" :label-width="120">
              <el-select v-model="filterExchange" placeholder="选择交易所" style="width: 240px" clearable>
                <el-option v-for="item in exchangeList" :key="item.name" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">{{ proxy.$t('common.opt.search') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
    <el-card shadow="never">
      <el-table :data="paginatedList" style="width: 100%" v-loading="loading">
        <!--        <el-table-column prop="symbol" label="排名" />-->
        <el-table-column prop="symbol" label="币种">
          <template #default="scope">
            <CoinTag :icon="scope.row.currencyLog" :symbol="scope.row.symbol" />
          </template>
        </el-table-column>
        <el-table-column prop="feeGroup" label="套利组合">
          <template #default="scope">
            <SportTradeInfoTag :side="'现货'" :spot-type="scope.row.spotType" :symbol="scope.row.symbol" :logo="scope.row.currencyLog" />
            <SportTradeInfoTag :side="'永续合约'" :futuresType="scope.row.futuresType" :symbol="scope.row.symbol" :logo="scope.row.currencyLog" />
          </template>
        </el-table-column>
        <el-table-column prop="apr" label="交易所" width="180">
          <template #default="scope">
            <ExchangeLogo :exchange="scope.row.exchangeName" :key="new Date()"></ExchangeLogo>
          </template>
        </el-table-column>
        <el-table-column prop="apr" label="资金费率">
          <template #default="scope">
            <FixedNumber :value="scope.row.fundingRate" :suffix="'%'"></FixedNumber>
            <!--            {{ scope.row.fundingRate ? scope.row.fundingRate + '%' : '-' }}-->
          </template>
        </el-table-column>
        <el-table-column prop="apr" label="三日累计费率">
          <template #default="scope">
            <FixedNumber :value="scope.row.threeDayFundingRate" :suffix="'%'"></FixedNumber>
          </template>
        </el-table-column>
        <el-table-column prop="apr" label="年化费率">
          <template #default="scope">
            <FixedNumber :value="scope.row.yearFundingRate" :suffix="'%'"></FixedNumber>
          </template>
        </el-table-column>

        <el-table-column :label="proxy.$t('common.opt.opt')" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Promotion" @click="handle(scope.row)">立即套利</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          class="mt-4 text-right"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.interestLine {
  display: flex;
  flex-direction: column;
}
</style>
