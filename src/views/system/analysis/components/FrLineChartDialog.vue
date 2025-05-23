<template>
  <div class="flex justify-center items-center ml1">
    <el-dialog v-model="visible" title="资金费历史趋势" width="1000px" :destroy-on-close="true" :append-to-body="true">
      <template v-slot:title>
        <div class="flex justify-start">
          <div>资金费历史趋势</div>
          <div><el-button size="small" @click="refresh" :loading="loading" class="ml1" icon="Refresh"></el-button></div>
        </div>
      </template>
      <div v-if="loading" class="text-center p-4 h-400px" v-loading="loading">加载中...</div>
      <FrLineChart v-else :frDataMap="chartData.frDataMap" :dateList="chartData.dateList" :selected-ex="chartData.selectedEx" class="w-full" />
    </el-dialog>

    <el-button size="small" @click="showChart" class="ml0">
      <img class="hover:cursor-pointer" src="@/assets/icons/png/frChart.png" height="18" width="18" />
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FrLineChart from './FrLineChart.vue'; // 请确保路径正确
import axios from 'axios';
import { queryFundingRateBySymbolInterval } from '@/views/system/analysis/components/index';

interface ChartData {
  frDataMap: Record<string, number[]>;
  dateList: number[];
  selectedEx: string[];
}

interface Props {
  symbol: string;
  selectedEx?: string[];
}
const props = defineProps<Props>();
watch(
  () => props.symbol,
  (nValue) => {
    // open(nValue);
  },
  { immediate: true } // 初始值也执行一次
);

const visible = ref(false);
const loading = ref(false);
const chartData = ref<ChartData>({
  frDataMap: {},
  dateList: [],
  selectedEx: []
});
const showChart = () => {
  open(props.symbol);
};

const refresh = () => {
  open(props.symbol);
};
const open = async (symbol: string) => {
  loading.value = true;
  try {
    const response = await queryFundingRateBySymbolInterval(symbol, 'm5');
    chartData.value = {
      frDataMap: response.data.frDataMap,
      dateList: response.data.dateList,
      selectedEx: props.selectedEx
    };
    visible.value = true;
  } catch (e) {
    console.error('加载失败', e);
    ElMessage.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {});
</script>
