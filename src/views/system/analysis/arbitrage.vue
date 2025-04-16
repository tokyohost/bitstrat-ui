<script setup lang="ts">
import { ArbitrageItem, ArbitrageQuery, CoinFundingInfo } from '@/api/system/analysis/types';
import { getInterestArbitrageV2 } from '@/api/system/analysis/analysis';
import CountdownTimer from '@/views/system/analysis/components/CountdownTimer.vue';
import PrettyNumber from '@/views/system/analysis/components/PrettyNumber.vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import CoinTag from '@/views/system/analysis/components/CoinTag.vue';
import { SymbolVO } from '@/api/system/task/types';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const datalist = ref<CoinFundingInfo[]>();

const symbolList = ref<SymbolVO[]>([]);
const tableData = ref<CoinFundingInfo[]>();
const queryParams = ref<ArbitrageQuery>({
  name: undefined,
  symbol: undefined
});

const currentPage = ref(1);
const pageSize = ref(10);
const showSearch = ref(true);

const loadDataList = async () => {
  const data = await getInterestArbitrageV2('');
  console.log(data);
  if (data.code == 200) {
    datalist.value = data.data || [];
    updateTableData();
  }
};
// 更新 tableData
const updateTableData = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  tableData.value = datalist.value.slice(start, end);
};

const handle = (row) => {};
const handleQuery = (row) => {};
const resetQuery = (row) => {};

// 监听分页变化
watch([currentPage, pageSize], updateTableData);
onMounted(() => {
  loadDataList();
});
</script>

<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item :label="proxy.$t('bybit.task.form.symbol')" prop="symbol" :label-width="120">
              <el-input v-model="queryParams.symbol" :placeholder="'请输入币对'" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item :label="'交易所'" prop="symbol" :label-width="120">
              <el-input v-model="queryParams.exchange" :placeholder="'请输入交易所'" clearable @keyup.enter="handleQuery" />
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
      <el-table :data="tableData" style="width: 100%">
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
            {{ scope.row.apr ? scope.row.apr + '%' : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="funding" label="净费率">
          <template #default="scope">
            {{ scope.row.funding ? scope.row.funding + '%' : '-' }}
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
  </div>
</template>

<style scoped lang="scss">
.interestLine {
  display: flex;
  flex-direction: column;
}
</style>
