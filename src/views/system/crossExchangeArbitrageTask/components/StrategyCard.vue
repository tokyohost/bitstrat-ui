<template>
  <div class="strategy-card">
    <div class="header">
      <span class="coin-name">
        {{data.longSymbol}}

<!--        {{data.shortSymbol}}-->
      </span>
      <div class="symbol-header">
        <dict-tag :options="cross_exchange_task_status" :value="data.status" :i18n-profilx="'bybit.task.status'" />
      </div>

    </div>

    <div
      class="exchange-card"
    >
      <div class="exchange-header">
<!--        <img :src="data.logo" alt="logo" class="logo" />-->
        <ExchangeLogo :exchange="data.longEx"></ExchangeLogo><el-text class="mx-1" type="success">做多</el-text>
      </div>
      <div class="exchange-stats">
        <span>持仓：{{ data.longSymbolSize ?? "-" }}</span>
        <span>盈亏：{{ data.longProfit ?? "-"}}</span>
        <span>开仓价：{{ data.longAvgPrice ?? "-"}}</span>
        <span>资金费率：<FundingRate :exchange="data.longEx" :symbol="data.symbol"></FundingRate></span>
        <span>最新价格：<AutoFetcherMarketPrice :exchange="data.longEx" :symbol="data.symbol"></AutoFetcherMarketPrice></span>
      </div>
    </div>

    <div
      class="exchange-card"
    >
      <div class="exchange-header">
        <!--        <img :src="data.logo" alt="logo" class="logo" />-->
        <ExchangeLogo :exchange="data.shortEx"></ExchangeLogo><el-text class="mx-1" type="danger">做空</el-text>
      </div>
      <div class="exchange-stats">
        <span>持仓：{{ data.shortSymbolSize ?? "-" }}</span>
        <span>盈亏：{{ data.shortProfit ?? "-"}}</span>
        <span>开仓价：{{ data.shortAvgPrice ?? "-"}}</span>
        <span>资金费率：<FundingRate :exchange="data.shortEx" :symbol="data.symbol"></FundingRate></span>
        <span>最新价格：<AutoFetcherMarketPrice :exchange="data.shortEx" :symbol="data.symbol"></AutoFetcherMarketPrice></span>
      </div>
    </div>

    <div class="summary">
      <div class="row">
        <span>创建时间：{{ data.createTime }}</span>
        <span>已运行时间：{{ "-" }}</span>
      </div>
      <div class="row">
        <span>总收益：{{ data.totalProfit }}</span>
        <span>收益率：{{ "-" }}</span>
      </div>
      <div class="row">
        <span>年化收益：{{ "-" }}</span>
        <span>总资金费率：{{ "-" }}</span>
      </div>
    </div>

    <div class="footer">
      <el-button type="danger" @click="onStop" v-if="data.status == 1">停止</el-button>
      <el-button type="danger" @click="onDelete" >删除</el-button>
      <el-button type="success" @click="start" v-if="data.status == 3">启动</el-button>
      <el-button type="info" @click="showLog" >查看日志</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { CrossExchangeArbitrageTaskVO } from '@/api/system/crossExchangeArbitrageTask/types';
import FundingRate from '@/views/system/analysis/components/FundingRate.vue';
import AutoFetcherMarketPrice from '@/views/system/analysis/components/AutoFetcherMarketPrice.vue';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import CoinTag from '@/views/system/analysis/components/CoinTag.vue';
import { delCrossExchangeArbitrageTask, startTask } from '@/api/system/crossExchangeArbitrageTask';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { cross_exchange_task_status } = toRefs<any>(proxy?.useDict('cross_exchange_task_status'));
const props = defineProps<{
  coinName?: string
  exchanges?: ExchangeInfo[]
  summary?: Summary,
  data: CrossExchangeArbitrageTaskVO
}>()

const emits = defineEmits<{
  (e: 'edit'): void
  (e: 'stop'): void
  (e: 'delete'): void
  (e: 'start'): void
}>()

const onEdit = () => emits('edit')
const onDelete = async () =>{
  await delCrossExchangeArbitrageTask(props.data.id);
  emits('delete')
}
const onStop = () => emits('stop')
const start =async () =>{
  let id = props.data.id;
  let response = await startTask({ taskId: id});
  ElMessage.success(response.msg);
}
const showLog = () => emits('start')
</script>

<style scoped>
.strategy-card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
  max-width: 600px;
  font-size: 14px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.edit-btn {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
}

.exchange-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 10px;
}

.exchange-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.logo {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.exchange-stats span {
  margin-right: 10px;
  display: inline-block;
}

.summary .row {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.stop-btn {
  background-color: #f56c6c;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.symbol-header{
  display: flex;
}
</style>
