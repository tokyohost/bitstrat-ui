<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { emitter } from '@/utils/eventBus';
import { OrderVO } from '@/api/system/order/types';
import OrderWidgetItem from '@/views/components/component/OrderWidgetItem.vue';
import { PositionWsData, WebsocketMsgData } from '@/views/components/type/type';
import PositionWidgetItem from '@/views/components/component/PositionWidgetItem.vue';
import { syncPosition } from '@/views/components/type';

const positionList = ref<PositionWsData[]>([]);

function handleWsMessage(data: WebsocketMsgData<PositionWsData[]>) {
  // console.log('收到 position 消息:', data)
  const accountId = data.accountId;
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
</script>

<template>
  <div class="flex-1 overflow-y-auto p-3 overflow-y-hidden hover:overflow-y-auto">
    <div class="flex flex-col gap-y-1">
      <div v-for="(item, index) in positionList">
        <PositionWidgetItem
          v-if="item.showFlag != 10"
          :key="new Date().getTime() + index"
          class="hover:cursor-pointer"
          :position="item"
        ></PositionWidgetItem>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
