<template>
  <div class="flex items-center space-x-2">
    <span>
      {{ formattedValue }}
    </span>
    <el-popover v-if="showWarning" placement="top" trigger="click" :content="popoverContent" :title="exchangeName.toUpperCase()">
      <template #reference>
        <el-icon :size="15" :color="' rgb(234 179 8)'" class="flex justify-initial">
          <Warning class="text-yellow-500 cursor-pointer width-10px height-10px" />
        </el-icon>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { roundTo } from '@/api/tool/utils';
import { Warning } from '@element-plus/icons-vue';
interface Props {
  value: number;
  precision?: number;
  exchangeName: string;
}

const props = defineProps<Props>();
const precision = computed(() => props.precision ?? 4);

const formattedValue = computed(() => {
  if (props.value != null && props.value != undefined) {
    const val = roundTo(props.value, precision.value);
    // const val = props.value.toFixed(precision.value);
    return props.value >= 0 ? `+${val}` : val;
  } else {
    return '-';
  }
});

const exchangePopoverMap: Record<string, string> = {
  bybit: 'Bybit 此值指的资金费用包含当前持仓期间的已实现盈亏，包括部分平仓、资金费用和手续费。'
};

const popoverContent = computed(() => exchangePopoverMap[props.exchangeName.toLowerCase()] ?? '无说明信息');
const showWarning = computed(() => !!exchangePopoverMap[props.exchangeName.toLowerCase()]);
</script>

<style scoped></style>
