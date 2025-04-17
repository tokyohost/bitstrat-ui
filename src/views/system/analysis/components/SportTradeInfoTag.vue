<template>
  <div class="flex items-center space-x-1">
    <span v-if="spotType" :class="['side', spotType]">{{ spotType == 'sell' ? '卖出' : '买入' }}</span>
    <span v-if="futuresType" :class="['side', futuresType]">{{ futuresType == 'long' ? '做多' : '做空' }}</span>
    <!--    <img :src="logo" class="exchange-logo" alt="exchange logo" />-->
    <span class="symbol">{{ symbol }} {{ side }}</span>
    <span class="market-type">{{ marketType }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  spotType: string;
  futuresType: string;
  logo: string;
  symbol: string;
  side: string;
  marketType: string;
}>();
</script>

<style scoped>
.trade-info {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}
.side {
  font-weight: bold;
  margin-right: 4px;
}
.sell {
  color: #f56c6c;
}
.buy {
  color: #67c23a;
}
.short {
  color: #f56c6c;
}
.long {
  color: #67c23a;
}
.exchange-logo {
  width: 16px;
  height: 16px;
  margin: 0 4px;
  vertical-align: middle;
}
.symbol {
  margin-right: 4px;
}
.market-type {
  color: #606266;
}
</style>
