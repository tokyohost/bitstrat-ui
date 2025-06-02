<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { emitter } from '@/utils/eventBus'
import { OrderVO } from '@/api/system/order/types';
import OrderWidgetItem from '@/views/components/component/OrderWidgetItem.vue';
import AccountWidgetItem from '@/views/components/component/AccountWidgetItem.vue';
import { WebsocketExStatus, WebsocketStatus } from '@/layout/components/NotifySetting/types';

const accountList = ref<WebsocketExStatus[]>([]);

function handleWsMessage(data: WebsocketExStatus[]) {
  console.log('收到 account 消息:', data)

  accountList.value = data


}

onMounted(() => {
  emitter.on('accountMessage', handleWsMessage)
})

onBeforeUnmount(() => {
  emitter.off('accountMessage', handleWsMessage)
})
</script>


<template>
  <div class="flex-1 overflow-y-auto p-3 overflow-y-hidden hover:overflow-y-auto ">
    <div class="flex flex-col gap-y-1">
      <AccountWidgetItem v-for="(item) in accountList" :key="new Date().getTime()" class="hover:cursor-pointer" :account="item"></AccountWidgetItem>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
