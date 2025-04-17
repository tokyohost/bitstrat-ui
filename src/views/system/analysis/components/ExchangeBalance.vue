<template>
  <div v-if="exchange.toLowerCase() == 'binance'">
    <p><strong>可用余额：</strong>{{ balance.availableBalance }} {{ coin }}</p>
    <p><strong>冻结余额：</strong>{{ balance.lockedBalance }}</p>
  </div>

  <div v-else-if="exchange.toLowerCase() == 'bybit'">
    <p><strong>统一账户余额：</strong>{{ balance.balance == null ? '查询失败' : balance.balance + coin }}</p>
    <p><strong>资金账户余额：</strong>{{ balance.usdtBalance == null ? '查询失败' : balance.usdtBalance + coin }}</p>
  </div>

  <div v-else-if="exchange.toLowerCase() == 'okx'">
    <p><strong>总余额：</strong>{{ balance.total }} {{ coin }}</p>
    <p><strong>可交易：</strong>{{ balance.available }}</p>
  </div>
  <div v-else>
    <el-empty :image-size="50" description="暂不支持的交易所类型" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  exchange: string;
  balance: Record<string, any>;
  coin?: string;
}>();
</script>

<style scoped>
p {
  margin: 0.3em 0;
}
</style>
