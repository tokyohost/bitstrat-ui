<template>
  <el-dialog v-model="visible" :title="title" width="400px" @close="handleClose">
    <div class="flex flex-col gap-4">
      <el-radio-group v-model="isMarket">
        <el-radio :label="true">市价单</el-radio>
        <el-radio :label="false">限价单</el-radio>
      </el-radio-group>

      <el-input v-if="!isMarket" v-model="price" placeholder="请输入新价格" type="number" :disabled="isMarket" />

      <div class="text-right mt-4">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title?: string;
  orderId?: string | number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', payload: { isMarket: boolean; price?: string; orderId?: string | number }): void;
}>();

const visible = ref(props.modelValue);
const isMarket = ref(true);
const price = ref('');

// 双向绑定弹框开关
watch(
  () => props.modelValue,
  (val) => (visible.value = val)
);
watch(visible, (val) => emit('update:modelValue', val));

const handleConfirm = () => {
  emit('confirm', {
    isMarket: isMarket.value,
    price: isMarket.value ? undefined : price.value,
    orderId: props.orderId
  });
  visible.value = false;
};

const handleClose = () => {
  visible.value = false;
};
</script>
