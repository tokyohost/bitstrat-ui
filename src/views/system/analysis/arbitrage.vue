<script setup lang="ts">
import { ArbitrageItem, ArbitrageQuery, CoinFundingInfo, ExchangeItem } from '@/api/system/analysis/types';
import { getInterestArbitrageV2, querySupportSymbol } from '@/api/system/analysis/analysis';
import CountdownTimer from '@/views/system/analysis/components/CountdownTimer.vue';
import PrettyNumber from '@/views/system/analysis/components/PrettyNumber.vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import CoinTag from '@/views/system/analysis/components/CoinTag.vue';
import { SymbolVO } from '@/api/system/task/types';
import { getSupportExchange } from '@/api/system/common/common';
import { ExchangeVo } from '@/api/system/common/types';
import CrossExchangeArgitrage from '@/views/system/analysis/components/CrossExchangeArgitrage.vue';
import ExchangeSelector from '@/views/system/analysis/components/ExchangeSelector.vue';
import FixedNumber from '@/views/system/analysis/components/FixedNumber.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const datalist = ref<CoinFundingInfo[]>();

const loading = ref(true);
const inited = ref(false);
const symbolList = ref<SymbolVO[]>([]);
const supportExchangeList = ref<ExchangeVo[]>([]);
const tableData = ref<CoinFundingInfo[]>();
const uniqueExchanges = ref<ExchangeItem[]>();
const queryParams = ref<ArbitrageQuery>({
  exchange: undefined
});

const currentPage = ref(1);
const pageSize = ref(10);
const showSearch = ref(true);
const arbitragePage = ref(false);
const arbitrageData = ref<CoinFundingInfo>();

const loadDataList = async () => {
  loading.value = true;
  try {
    const data = await getInterestArbitrageV2(queryParams.value.exchange);
    console.log(data);
    if (data.code == 200) {
      datalist.value = data.data || [];
      initExchangeList();
      updateTableData();
    }
  } finally {
    loading.value = false;
  }
};
const initExchangeList = () => {
  if (inited.value == true) {
    return;
  }
  const exchanges = datalist.value.flatMap((item) => [
    {
      name: item.buy.exchangeName,
      logo: item.buy.exchangeLogo
    },
    {
      name: item.sell.exchangeName,
      logo: item.sell.exchangeLogo
    }
  ]);
  uniqueExchanges.value = Array.from(new Map(exchanges.map((item) => [item.name, item])).values());
  inited.value = true;
};

const loadSymbolData = async () => {
  loading.value = true;
  try {
    const data = await querySupportSymbol();
    console.log(data);
    if (data.code == 200) {
      console.log(data.data);
      // datalist.value = data.data || [];
    }
  } finally {
    loading.value = false;
  }
};

const loadExchange = async () => {
  // loading.value = true;
  const res = await getSupportExchange();
  console.log(res);
  if (res.code == 200) {
    supportExchangeList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
  // loading.value = false;
};

// 更新 tableData
const updateTableData = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  tableData.value = datalist.value.slice(start, end);
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
const handleQuery = (row) => {
  loadDataList();
};
const resetQuery = (row) => {};

// 监听分页变化
watch([currentPage, pageSize], updateTableData);
onMounted(() => {
  loadDataList();
  loadExchange();
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
            <el-form-item :label="''" prop="symbol" :label-width="120">
              <!--              <el-input v-model="queryParams.exchange" :placeholder="'请输入交易所'" clearable @keyup.enter="handleQuery" />-->
              <ExchangeSelector :exchanges="uniqueExchanges" v-model="queryParams.exchange" @change="handleQuery"></ExchangeSelector>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">{{ proxy.$t('common.opt.search') }}</el-button>
              <el-button icon="Refresh" @click="resetQuery">{{ proxy.$t('common.opt.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>
    <el-card shadow="never">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <!--        <el-table-column prop="symbol" label="排名" />-->
        <el-table-column prop="symbol" label="币种">
          <template #default="scope">
            <CoinTag :icon="scope.row.symbolLogo" :symbol="scope.row.symbol" />
          </template>
        </el-table-column>
        <el-table-column prop="feeGroup" label="费率组合" width="280">
          <template #default="scope">
            <TradePairTag
              direction="long"
              :symbol="scope.row.buy?.symbol"
              :exchange="scope.row.buy?.exchangeName"
              :exchangeLogo="scope.row.buy?.exchangeLogo"
            />
            <TradePairTag
              direction="short"
              :symbol="scope.row.sell?.symbol"
              :exchange="scope.row.sell?.exchangeName"
              :exchangeLogo="scope.row.sell?.exchangeLogo"
            />
          </template>
        </el-table-column>
        <el-table-column prop="apr" label="当前年化" width="180">
          <template #default="scope">
            <FixedNumber :value="scope.row.apr" :suffix="'%'" :decimals="2" :show-color="false"></FixedNumber>
          </template>
        </el-table-column>
        <el-table-column prop="funding" label="净费率">
          <template #default="scope">
            <FixedNumber :value="scope.row.funding" :suffix="'%'" :decimals="4" :show-color="false"></FixedNumber>
          </template>
        </el-table-column>
        <el-table-column prop="fee" label="手续费">
          <template #default="scope">
            {{ scope.row.fee ? scope.row.fee + '%' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="spread" label="差价率">
          <template #default="scope">
            {{ scope.row.spread ? scope.row.spread + '%' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="openInterest" label="持仓">
          <template #default="scope">
            <div class="interestLine">
              <PrettyNumber :value="scope.row.buy?.openInterest"></PrettyNumber>
              <PrettyNumber :value="scope.row.sell?.openInterest"></PrettyNumber>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nextFundingTime" label="距离结算">
          <template #default="scope">
            <CountdownTimer :timestamp="scope.row.nextFundingTime" />
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
          :total="datalist?.length || 0"
          layout="total, sizes, prev, pager, next, jumper"
          class="mt-4 text-right"
        />
      </div>
    </el-card>
    <CrossExchangeArgitrage v-model:visible="arbitragePage" :data="arbitrageData" :title="'创建套利任务'"></CrossExchangeArgitrage>
  </div>
</template>

<style scoped lang="scss">
.interestLine {
  display: flex;
  flex-direction: column;
}
</style>
