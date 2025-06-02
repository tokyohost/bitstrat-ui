<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { emitter } from '@/utils/eventBus'
import { OrderVO } from '@/api/system/order/types';
import OrderWidgetItem from '@/views/components/component/OrderWidgetItem.vue';

const orderList = ref<OrderVO[]>([]);
const orderMap = ref<Map<string | number, OrderVO>>(new Map());

function handleWsMessage(data: OrderVO) {
  // console.log('收到 order 消息:', data)
  const id = data.orderId;

  if (orderMap.value.has(id)) {
    // console.log("存在");
    // 已存在，找到索引并替换原位置
    const index = orderList.value.findIndex(item => item.orderId === id);
    if (index !== -1) {
      orderList.value.splice(index, 1, data); // 原地替换
    }
  } else {
    // console.log("不存在");
    // 不存在，插入最前
    orderList.value.unshift(data);

    // ⚠️ 插入后判断是否超过 99 个订单
    if (orderList.value.length > 99) {
      const removed = orderList.value.pop()
      if (removed) {
        orderMap.value.delete(removed.orderId)
      }
    }
  }

  // 无论是否存在，都更新 map
  orderMap.value.set(id, data);


}

onMounted(() => {
  emitter.on('orderMessage', handleWsMessage)
})

onBeforeUnmount(() => {
  emitter.off('orderMessage', handleWsMessage)
})
</script>


<template>
  <div class="flex-1 overflow-y-auto p-3 overflow-y-hidden hover:overflow-y-auto ">
    <div class="flex flex-col gap-y-1">
      <OrderWidgetItem v-for="(item) in orderList" :order="item" :key="item.orderId" class="hover:cursor-pointer"></OrderWidgetItem>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
