<template>
  <div class="flex justify-center items-center ml1">
    <el-dialog v-model="visible" title="资金费历史趋势" width="1000px" :destroy-on-close="true" :append-to-body="true">
      <template v-slot:title>
        <div class="flex justify-start">
          <div>
            实时价差监控 {{ props.exchangeA }}[{{ props.symbolA }}]<span class="color-green">A</span> - {{ props.exchangeB }}[{{
              props.symbolB
            }}]<span class="color-red">B</span>
          </div>
          <div><el-button size="small" @click="refresh" :loading="loading" class="ml1" icon="Refresh"></el-button></div>
        </div>
      </template>
      <CompareLinerChart
        :exchange-a="props.exchangeA"
        :symbol-a="props.symbolA"
        :type-a="props.typeA"
        :exchange-b="props.exchangeB"
        :symbol-b="props.symbolB"
        :type-b="props.typeB"
      ></CompareLinerChart>
    </el-dialog>

    <el-button size="small" @click="showChart" class="ml0">
      <img class="hover:cursor-pointer" src="@/assets/icons/png/compareMoniter.png" height="18" width="18" />
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CompareLinerChart from '@/views/system/analysis/components/CompareLinerChart.vue';

const props = defineProps<{
  businessType?: string;
  exchangeA: string;
  symbolA: string;
  typeA: string;
  exchangeB: string;
  symbolB: string;
  typeB: string;
}>();
watch(
  () => props,
  (nValue) => {},
  { immediate: true } // 初始值也执行一次
);

const visible = ref(false);
const loading = ref(false);
const showChart = () => {
  visible.value = true;
};

const refresh = () => {};

onMounted(() => {});
</script>
