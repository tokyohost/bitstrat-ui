<script setup lang="ts">

import CompareLinerChart from '@/views/system/analysis/components/CompareLinerChart.vue';

const showSettingFlag = ref(false);



</script>

<template>
  <div style="padding: 8px;">
    <div class="flex justify-end">
      <el-button @click="showSettingFlag =true"><img src="../../../assets/icons/png/setting.png" height="20" width="20" /></el-button>

    </div>
    <compare-liner-chart exchange-a="bitget" symbol-a="btc" type-a="swap" exchange-b="binance" symbol-b="btc" type-b="swap"></compare-liner-chart>
  </div>
</template>

<style scoped lang="scss">

</style>
