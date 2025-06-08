<script setup lang="ts">
import CompareLinerChart from '@/views/system/analysis/components/CompareLinerChart.vue';
import ExchangeSelector from '@/views/system/analysis/components/ExchangeSelector.vue';
import { getSupportExchange } from '@/api/system/common/common';
import { ElOption, ElSelect } from 'element-plus';
import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { ExchangeVo } from '@/api/system/common/types';
import { ABOrderData, ABOrderForm, CompareWidget } from '@/views/components/type/type';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import OperateForm from '@/views/components/component/OperateForm.vue';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';
import { emitter } from '@/utils/eventBus';
import { syncAbOrderTask } from '@/views/components/type';

const props = withDefaults(
  defineProps<{
    id: number | string;
    componentData: any;
  }>(),
  {
    componentData: () => ({})
  }
);

let emits = defineEmits(['selectTask']);

const selectTask = (item: ABOrderData) => {
  emits('selectTask', item);
  emitter.emit('selectTask', item);
};
const addNew = () => {
  const data = {
    exchangeA: null,
    exchangeB: null,
    symbolA: null,
    symbolB: null,
    typeA: null,
    typeB: null,
    operate: {
      status: 'stop',
      type: 'plusAminB',
      size: null,
      coldSec: null,
      maxSize: null,
      gap: null,
      closeGap: null,
      openGap: null
    }
  } as ABOrderData;


  emitter.emit('addNew', data);
};

// 创建一个本地响应式副本（避免直接修改 props）
const listAll = ref<ABOrderData[]>([]);

const loading = ref<boolean>(false);


const handleWsMessage = (data: ABOrderData[]) => {
  console.log('收到任务列表 ', data);
  listAll.value = data;
};

onBeforeUnmount(() => {
  emitter.off('abOrderMessage', handleWsMessage);
});
onMounted(() => {
  emitter.on('abOrderMessage', handleWsMessage);
});
</script>

<template>
  <div class="flex-1 w-full p-2 overflow-y-hidden hover:overflow-y-auto">

    <el-card class="flex flex-col  gap-1 hover:cursor-pointer" v-for="item in listAll" shadow="hover"
             @click="selectTask(item)">

      <el-card title="A" class="w-full" shadow="never">
        <div class="flex justify-between w-full">
          <div class="flex gap-x-2 flex-row">
            <div class="font-400 color-green">A</div>
            <ExchangeLogo :exchange="item.exchangeA" :key="item.exchangeA">
              {{ item.symbolA }}
            </ExchangeLogo>
          </div>
          <div class="flex justify-end hover:cursor-pointer text-xs">
            <div v-if="item.accountA">{{ item.accountA?.name || '-' }}</div>
            <!--            <img src="@/assets/icons/png/switch.png" height="18" width="18" v-if="item.accountA" />-->
            <div class="color-#409EFF" v-else>未选择账户</div>
          </div>
        </div>
      </el-card>
      <el-card title="B" class="w-full" shadow="never">
        <div class="flex justify-between w-full">
          <div class="flex gap-x-2 flex-row">
            <div class="font-400 color-red">B</div>
            <ExchangeLogo :exchange="item.exchangeB" :key="item.exchangeB">
              {{ item.symbolB }}
            </ExchangeLogo>
          </div>
          <div class="flex justify-end hover:cursor-pointer text-xs">
            <div v-if="item.accountB">{{ item.accountB?.name || '-' }}</div>
            <!--            <img src="@/assets/icons/png/switch.png" height="18" width="18" v-if="item.accountB" />-->
            <div class="color-#409EFF" v-else>未选择账户</div>
          </div>
        </div>
      </el-card>
      <div class="text-xs flex justify-between flex-items-center mt-1">
        <div>
          <el-tag :type="item.operate.status == 'run' ? 'success' : 'error'" effect="plain" round>
            {{ item.operate.status == 'run' ? '正在运行' : '已停止' }}
          </el-tag>
        </div>
        <div>
          ID:{{ item.taskId }}
        </div>

      </div>

    </el-card>
    <el-card class="mt-1 flex flex-items-center flex-col">
      <div>
        <el-button type="text" @click="addNew">新增</el-button>
      </div>
    </el-card>
    <el-card class="mt-1" v-if="listAll.length == 0">
      <el-empty description="无任务" />
    </el-card>

  </div>
</template>

<style scoped lang="scss"></style>
