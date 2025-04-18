<template>
  <div class="flex items-center space-x-2">
    <el-input v-model="innerValue" readonly placeholder="邀请码" class="w-60" />
    <el-button icon="Refresh" @click="generateCode" circle />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { uploadInviteCodeInput } from '@/api/system/user';

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const innerValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    innerValue.value = val;
  }
);

watch(innerValue, (val) => {
  emit('update:modelValue', val);
});

const generateCode = async () => {
  // 示例：生成一个 8 位的随机邀请码（大写字母+数字）
  const response = await uploadInviteCodeInput();
  if (response.code == 200) {
    innerValue.value = response.msg;
  }
  ElMessage.success('邀请码已刷新');
};

onMounted(() => {
  innerValue.value = props.modelValue;
});
</script>
