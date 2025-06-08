<script setup lang="ts">


import { onBeforeUnmount, onMounted } from 'vue';
import { emitter } from '@/utils/eventBus';
import { ABOrderData, CoinsAbOrderLog } from '@/views/components/type/type';

const listAll = ref<CoinsAbOrderLog[]>([]);

const handleWsMessage = (data: CoinsAbOrderLog) => {
  console.log('收到日志 ', data);
  listAll.value.unshift(data);

  // ⚠️ 插入后判断是否超过 99 个日志
  if (listAll.value.length > 99) {
    const removed = listAll.value.pop()
  }
};


onBeforeUnmount(() => {
  emitter.off('abOrderLog', handleWsMessage);
});
onMounted(() => {
  emitter.on('abOrderLog', handleWsMessage);
});
</script>

<template>
  <div class="flex-1 w-full p-2 gap-y-1 overflow-y-hidden hover:overflow-y-auto">
    <el-card v-for="item in listAll" class="flex flex-col gap-1 justify-start mb-1" shadow="hover">
      <div>
        {{item.log}}
      </div>
      <div class="flex flex-col gap-1 justify-end ">
        {{item.createTime}}
      </div>
    </el-card>


  </div>
</template>

<style scoped lang="scss">

</style>
