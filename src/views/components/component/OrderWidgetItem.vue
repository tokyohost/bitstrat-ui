<script setup lang="ts">
import { OrderVO } from '@/api/system/order/types';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';

const props = defineProps<{
  order: OrderVO
}>();

</script>

<template>
  <div>
    <el-card class="w-full" shadow="hover">
      <div class="flex flex-row ">
        <div class="flex justify-between w-full">
          <div class="flex justify-start text-center align--center ml-2">
            <TradePairTag :direction="props.order.side" :symbol="props.order.symbol"
                          :exchange="props.order.ex" :diy-ex-logo="true" :exchange-logo="'default'"></TradePairTag>
            <el-tag v-if="props.order.closePositionOrder == 1" disable-transitions type="danger" size="small" class="ml-2">平</el-tag>
          </div>

          <div>{{props.order.status}}</div>
        </div>

      </div>
      <div class="flex flex-row  w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">下单数量</div>
          <div class="border-b-unset ml-1 color-blue">{{props.order.size ?? '-'}}</div>
        </div>
        <div class="flex flex-1 text-xs">
          <div class="font-400">下单价格</div>
          <div class="border-b-unset ml-1">{{props.order.price ?? '-'}}</div>
        </div>
      </div>
      <div class="flex flex-row  w-full">
        <div class="flex flex-1 text-xs">
          <div class="font-400">未交数量</div>
          <div class="border-b-unset ml-1 color-blue">{{props.order.leavesQty ?? '-'}}</div>
        </div>
        <div class="flex flex-1 text-xs">
          <div class="font-400">平均成交价</div>
          <div class="border-b-unset ml-1">{{props.order.marketPrice ?? '-'}}</div>
        </div>
      </div>

      <div class="flex justify-end  w-full text-xs mt-2">
        <div>{{props.order.createTime}}</div>
      </div>
    </el-card>
  </div>

</template>

<style scoped lang="scss">
::v-deep .el-card__body{
  //padding:0 !important;
  padding:5px 5px 5px 5px !important;
}
</style>
