<script setup lang="ts">
import { OrderVO } from '@/api/system/order/types';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { PositionWsData } from '@/views/components/type/type';

const props = defineProps<{
  position: PositionWsData;
}>();
</script>

<template>
  <div>
    <el-card class="w-full" shadow="hover">
      <div class="flex flex-row">
        <div class="flex justify-between w-full">
          <div class="flex justify-start text-center align--center ml-2 gap-col-1">
            <TradePairTag
              :direction="props.position.side"
              :symbol="props.position.symbol"
              :exchange="props.position.exchange"
              :diy-ex-logo="true"
              :exchange-logo="'default'"
            ></TradePairTag>
            <el-tag type="danger" size="small" disable-transitions>{{ props.position.leverage }}x</el-tag>
            <el-tag type="warning" size="small" disable-transitions>{{ props.position.marginType }}</el-tag>
          </div>

          <div>{{ props.position.accountName }}</div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">持仓数量</div>
          <div class="border-b-unset ml-1 color-blue">{{ props.position.size ?? '-' }} {{ props.position.symbol }}</div>
        </div>
        <div class="flex flex-1 text-xs">
          <div class="font-400">平均入场价格</div>
          <div class="border-b-unset ml-1">{{ props.position.avgPrice ?? '-' }}</div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">未实现盈亏</div>
          <div class="border-b-unset ml-1">{{ props.position.unrealizedProfit ?? '-' }}</div>
        </div>
        <div class="flex flex-1 text-xs">
          <div class="font-400">已实现盈亏</div>
          <div class="border-b-unset ml-1">{{ props.position.profit ?? '-' }}</div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">保证金</div>
          <div class="border-b-unset ml-1">{{ props.position.marginPrice ?? '-' }} U</div>
        </div>
        <div class="flex flex-1 text-xs">
          <div class="font-400">MMR</div>
          <div class="border-b-unset ml-1">{{ props.position.marginRatio ?? '-' }}%</div>
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">预估强平价</div>
          <div class="border-b-unset ml-1">{{ props.position.liqPrice ?? '-' }}</div>
        </div>
        <!--        <div class="flex flex-1 text-xs">-->
        <!--          <div class="font-400">保证金率</div>-->
        <!--          <div class="border-b-unset ml-1">{{ props.position.marginRatio ?? '-' }}%</div>-->
        <!--        </div>-->
      </div>

      <div class="flex justify-end w-full text-xs mt-2">
        <div>{{ props.position.updateTime }}</div>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
::v-deep .el-card__body {
  //padding:0 !important;
  padding: 5px 5px 5px 5px !important;
}
</style>
