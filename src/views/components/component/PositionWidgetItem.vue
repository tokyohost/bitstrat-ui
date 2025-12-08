<script setup lang="ts">
import { OrderVO } from '@/api/system/order/types';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { PositionWsData } from '@/views/components/type/type';
import { queryPositionTpslBySymbol } from '@/views/system/historyPosition';
import { HistoryPositionTpslQuery, TpSlOrder } from '@/views/system/historyPosition/type';

const props = defineProps<{
  position: PositionWsData;
  accountId: string | number;
}>();

const customColor = computed(() => {
  if (props.position.marginRatio < 30) {
    return '#67c23a';
  }
  if (props.position.marginRatio < 70) {
    return '#e6a23c';
  }
  return '#f56c6c';
});

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);
const showTpslTable = ref(false);
const tpslOrders = ref<TpSlOrder[]>([]);

const syncTpsl = async () => {
  const data = {
    exchange: props.position.exchange,
    symbol: props.position.symbol,
    apiId: props.accountId
  } as HistoryPositionTpslQuery;
  const res = await queryPositionTpslBySymbol(data);
  tpslOrders.value = res.data;
  showTpslTable.value = true;
};
</script>

<template>
  <div class="w-full">
    <el-card class="w-full" :shadow="'never'">
      <div class="flex flex-col md:flex-row justify-between w-full border-b pb-2 mb-2">
        <div class="flex flex-wrap items-center gap-1 md:gap-x-2 md:gap-y-0 mb-2 md:mb-0">
          <TradePairTag
            :direction="props.position.side"
            :symbol="props.position.symbol"
            :exchange="props.position.exchange"
            :diy-ex-logo="true"
            :exchange-logo="'default'"
            class="flex-shrink-0"
          ></TradePairTag>
          <el-tag type="danger" size="small" disable-transitions>{{ props.position.leverage }}x</el-tag>
          <el-tag type="warning" size="small" disable-transitions>{{ props.position.marginType }}</el-tag>
          <el-tag type="success" size="small" disable-transitions>TP:{{ props.position.takeProfit || '-' }}</el-tag>
          <el-tag type="danger" size="small" disable-transitions>SL:{{ props.position.stopLoss || '-' }}</el-tag>
          <el-button type="primary" link size="small" disable-transitions @click="syncTpsl">SYNC TPSL</el-button>
        </div>

        <div class="text-right text-xs md:text-sm text-gray-500 font-medium flex-shrink-0">
          {{ props.position.accountName }}
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div class="flex flex-col md:flex-row w-full gap-2 md:gap-4">
          <div class="flex justify-between md:justify-start md:flex-1 text-xs md:items-center">
            <div class="text-gray-500 flex-shrink-0">持仓数量</div>
            <div class="font-medium text-blue-600 ml-1">{{ props.position.size ?? '-' }} {{ props.position.symbol }}</div>
          </div>
          <div class="flex justify-between md:justify-start md:flex-1 text-xs md:items-center">
            <div class="text-gray-500 flex-shrink-0">平均入场价格</div>
            <div class="font-medium ml-1">{{ props.position.avgPrice ?? '-' }}</div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row w-full gap-2 md:gap-4">
          <div class="flex justify-between md:justify-start md:flex-1 text-xs md:items-center">
            <div class="text-gray-500 flex-shrink-0">未实现盈亏</div>
            <div class="font-medium text-green-600 ml-1">{{ props.position.unrealizedProfit ?? '-' }}</div>
          </div>
          <div class="flex justify-between md:justify-start md:flex-1 text-xs md:items-center">
            <div class="text-gray-500 flex-shrink-0">已实现盈亏</div>
            <div class="font-medium ml-1">{{ props.position.profit ?? '-' }}</div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row w-full gap-2 md:gap-4">
          <div class="flex justify-between md:justify-start md:flex-1 text-xs md:items-center">
            <div class="text-gray-500 flex-shrink-0">保证金</div>
            <div class="font-medium ml-1">{{ props.position.marginPrice ?? '-' }} U</div>
          </div>
          <div class="flex flex-col md:flex-1 text-xs">
            <div class="flex justify-between items-center w-full">
              <div class="text-gray-500 flex-shrink-0">MMR</div>
              <div class="font-medium ml-1 md:hidden">{{ props.position.marginRatio ?? '-' }}%</div>
            </div>
            <div class="flex w-full mt-1 items-center">
              <el-progress
                :stroke-width="5"
                :format="format"
                :text-inside="false"
                :show-text="false"
                :duration="1000"
                :percentage="props.position.marginRatio"
                :color="customColor"
                class="w-full"
              />
              <span class="ml-2 hidden md:block text-gray-800">{{ props.position.marginRatio ?? '-' }}%</span>
            </div>
          </div>
        </div>

        <div class="flex justify-between md:justify-start md:flex-row w-full text-xs md:items-center">
          <div class="text-gray-500 flex-shrink-0">预估强平价</div>
          <div class="font-medium text-red-500 ml-1">{{ props.position.liqPrice ?? '-' }}</div>
        </div>
      </div>

      <div class="flex flex-col md:flex-row justify-between w-full text-xs text-gray-500 mt-3 pt-2 border-t gap-1">
        <div class="text-left md:text-right">同步时间: {{ props.position.serverTime }}</div>
        <div class="text-left md:text-right">仓位变更时间: {{ props.position.updateTime }}</div>
      </div>
    </el-card>
    <el-dialog v-model="showTpslTable">
      <template #title>
        <span class="font-bold text-lg">止盈止损订单列表 (TPSL)</span>
      </template>

      <el-table :data="tpslOrders" border stripe max-height="400">
        <el-table-column prop="symbol" label="交易对" width="120" fixed />

        <el-table-column prop="takeProfitPrice" label="止盈价格 (TP)" min-width="150">
          <template #default="{ row }">
            <span :class="{ 'text-green-600 font-medium': row.takeProfitPrice }">
              {{ row.takeProfitPrice || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="stopLossPrice" label="止损价格 (SL)" min-width="150">
          <template #default="{ row }">
            <span :class="{ 'text-red-600 font-medium': row.stopLossPrice }">
              {{ row.stopLossPrice || '-' }}
            </span>
          </template>
        </el-table-column>

        <template v-if="tpslOrders && tpslOrders.length === 0" #empty> 暂无止盈止损订单 </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
::v-deep .el-card__body {
  //padding:0 !important;
  //padding: 5px 5px 5px 5px !important;
}
</style>
