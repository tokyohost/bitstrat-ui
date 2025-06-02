<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { emitter } from '@/utils/eventBus'
import { OrderVO } from '@/api/system/order/types';
import OrderWidgetItem from '@/views/components/component/OrderWidgetItem.vue';
import { PositionWsData, WebsocketMsgData } from '@/views/components/type/type';
import PositionWidgetItem from '@/views/components/component/PositionWidgetItem.vue';

const positionList = ref<PositionWsData[]>([]);

function handleWsMessage(data: WebsocketMsgData<PositionWsData[]>) {
  // console.log('收到 position 消息:', data)
  const accountId = data.accountId;
  //根据accountId 删除positionList 中的持仓
  const result = positionList.value.filter(
    item => item.accountId != accountId
  )
  console.log("result", result);
  positionList.value = result

  let positions = data.data;
  for (let position of positions) {
    positionList.value.unshift(position);
  }

  console.log("positions", toRaw(positionList.value));
}

onMounted(() => {
  emitter.on('positionMessage', handleWsMessage)
})

onBeforeUnmount(() => {
  emitter.off('positionMessage', handleWsMessage)
})
</script>


<template>
  <div class="flex-1 overflow-y-auto p-3 overflow-y-hidden hover:overflow-y-auto ">
    <div class="flex flex-col gap-y-1">
      <PositionWidgetItem v-for="(item) in positionList"  :key="new Date().getTime()" class="hover:cursor-pointer" :position="item"></PositionWidgetItem>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
