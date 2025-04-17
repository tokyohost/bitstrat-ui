<template>
  <el-dialog v-model="visibleRef" :title="title" width="600px" :close-on-click-modal="false" @close="$emit('close')">
    <!-- 显示传入对象内容 -->
    <el-form :model="arbitrageForm" :label-position="'top'">
      <el-card :shadow="false">
        <el-form-item :label="''">
          <TradePairTag
            direction="long"
            :symbol="props.data.buy?.symbol"
            :exchange="props.data.buy?.exchangeName"
            :exchangeLogo="props.data.buy?.exchangeLogo"
          />
        </el-form-item>
        <el-form-item :label="''">
          <BalanceCard coin="USDT" :symbol="props.data.symbol" :exchange="props.data.buy?.exchangeName"></BalanceCard>
        </el-form-item>
        <el-form-item :label="'套利金额'">
          <el-input
            v-model="arbitrageForm.buy.size"
            placeholder="Please input"
            :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          />
        </el-form-item>
      </el-card>
      <el-card :shadow="false" style="margin-top: 10px">
        <el-form-item :label="''">
          <TradePairTag
            direction="short"
            :symbol="props.data.sell?.symbol"
            :exchange="props.data.sell?.exchangeName"
            :exchangeLogo="props.data.sell?.exchangeLogo"
          />
        </el-form-item>
        <el-form-item :label="''">
          <BalanceCard coin="USDT" :symbol="props.data.symbol" :exchange="props.data.sell?.exchangeName"></BalanceCard>
        </el-form-item>
        <el-form-item :label="'套利金额'">
          <el-input
            v-model="arbitrageForm.buy.size"
            placeholder="Please input"
            :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          />
        </el-form-item>
      </el-card>
    </el-form>
    <!-- 插槽：用于自定义内容 -->
    <slot :data="data"></slot>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { ArbitrageTaskForm } from '@/api/system/analysis/types';
import BalanceCard from '@/views/system/analysis/components/BalanceCard.vue';
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '详情'
  },
  data: {
    type: Object,
    default: () => ({})
  }
});

const arbitrageForm = reactive<ArbitrageTaskForm>({
  buy: {
    size: 0
  },
  sell: {
    size: 0
  }
});
const emit = defineEmits(['update:visible', 'close', 'confirm']);

// 双向绑定 visible
const visibleRef = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    console.log('watch visible', val);
    visibleRef.value = val;
  }
);
watch(visibleRef, (val) => emit('update:visible', val));

// 显示数据（去 Proxy）
const toDisplayObject = computed(() => {
  try {
    return JSON.stringify(toRaw(props.data), null, 2);
  } catch {
    return '[无法解析对象]';
  }
});

const handleCancel = () => {
  visibleRef.value = false;
};

const handleConfirm = () => {
  emit('confirm', props.data);
  visibleRef.value = false;
};
</script>

<style scoped>
pre {
  background-color: #f8f8f8;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
}
</style>
