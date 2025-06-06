<script setup lang="ts">
import { OrderVO } from '@/api/system/order/types';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { PositionWsData } from '@/views/components/type/type';

const props = defineProps<{
  position: PositionWsData;
}>();

const customColor = computed(() => {
  if (props.position.marginRatio < 30) {
    return '#67c23a';
  }
  if (props.position.marginRatio < 70) {
    return '#e6a23c';
  }
  return '#f56c6c';
});

const format = (percentage) => (percentage === 100 ? 'Full' : `${percentage}%`);
</script>

<template>
  <div>
    <el-card class="w-full" :shadow="'never'">
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
        <div class="flex flex-1 justify-start text-xs w-full">
          <div class="font-400">MMR</div>
          <div class="border-b-unset ml-1 w-[200px] align--center text-center pt-[5px]">
            <el-progress
              class="w-full"
              :stroke-width="5"
              indeterminate
              :format="format"
              :text-inside="true"
              :duration="1000"
              :percentage="props.position.marginRatio"
              :color="customColor"
            />
            <!--            <el-progress :percentage="100" status="success" :indeterminate="true" :duration="5" class="w-full" />-->

            {{ props.position.marginRatio ?? '-' }}%
          </div>
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

      <div class="flex justify-end w-full text-xs mt-2 gap-4">
        <div>同步时间:{{ props.position.serverTime }}</div>
        <div>仓位变更时间:{{ props.position.updateTime }}</div>
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
