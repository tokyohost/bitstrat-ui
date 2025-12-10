<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { emitter } from '@/utils/eventBus';
import { OrderVO } from '@/api/system/order/types';
import OrderWidgetItem from '@/views/components/component/OrderWidgetItem.vue';
import { PositionWsData, WebsocketMsgData } from '@/views/components/type/type';
import PositionWidgetItem from '@/views/components/component/PositionWidgetItem.vue';
import { syncPosition } from '@/views/components/type';
import { queryPositionTpslBySymbol } from '@/views/system/historyPosition';
import { HistoryPositionTpslQuery, TpSlOrder } from '@/views/system/historyPosition/type';

const positionList = ref<PositionWsData[]>([]);

const props = defineProps({
  accountId: {
    type: String,
    required: false
  }
});

function handleWsMessage(data: WebsocketMsgData<PositionWsData[]>) {
  // console.log('收到 position 消息:', data)
  const accountId = data.accountId;
  if (props.accountId) {
    if (props.accountId != accountId) {
      console.log('过滤掉 position 消息:', data);
      return;
    }
  } else {
    return;
  }
  //根据accountId 删除positionList 中的持仓
  const result = positionList.value.filter((item) => item.accountId != accountId);
  // console.log("result", result);
  positionList.value = result;

  const positions = data.data;
  for (const position of positions) {
    positionList.value.unshift(position);
  }

  // 按 accountId 升序排序
  positionList.value.sort((a, b) => {
    if (a.accountId < b.accountId) return -1;
    if (a.accountId > b.accountId) return 1;
    return 0;
  });
  // console.log("positions", toRaw(positionList.value));
}

const openRefresh = async () => {
  const axiosResponse = await syncPosition();
  ElMessage.success('已同步');
};
defineExpose({
  openRefresh
});

onMounted(() => {
  emitter.on('positionMessage', handleWsMessage);
});

onBeforeUnmount(() => {
  emitter.off('positionMessage', handleWsMessage);
});
const showTpslTable = ref(false);
const showTpslHandle = (position: PositionWsData) => {
  syncTpsl(position);
};

const tpslOrders = ref<TpSlOrder[]>([]);

const syncTpsl = async (position: PositionWsData) => {
  const data = {
    exchange: position.exchange,
    symbol: position.symbol,
    apiId: props.accountId
  } as HistoryPositionTpslQuery;
  const res = await queryPositionTpslBySymbol(data);
  tpslOrders.value = res.data;
  showTpslTable.value = true;
};
</script>

<template>
  <div class="flex-1 overflow-y-auto overflow-y-hidden hover:overflow-y-auto">
    <div class="flex flex-col gap-y-1">
      <div v-for="(item, index) in positionList" :key="index">
        <PositionWidgetItem
          v-if="item.showFlag != 10"
          :key="new Date().getTime() + index"
          class="hover:cursor-pointer"
          :position="item"
          @show-tpsl="showTpslHandle"
          :accountId="accountId"
        ></PositionWidgetItem>
      </div>
      <el-empty v-if="!positionList || positionList.length == 0" class="h-[100px]" :image-size="50"></el-empty>
    </div>
    <el-dialog v-model="showTpslTable" append-to-body>
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

<style scoped lang="scss"></style>
