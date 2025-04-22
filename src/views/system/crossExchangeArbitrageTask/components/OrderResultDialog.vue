<template>
  <el-dialog v-model="visible" :title="success ? '下单成功' : '下单失败'" width="600px" :before-close="onClose">
    <el-alert :title="success ? '下单成功！' : '下单失败'" :type="success ? 'success' : 'error'" show-icon class="mb-4" />
    <div ref="logContainer" class="log-box margin-top-10">
      <p v-for="(item, index) in logs" :key="index">{{ item }}</p>
    </div>
    <template #footer>
      <el-button @click="onClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    success: boolean;
    logs: string[];
  }>(),
  {
    success: false,
    logs: () => [] // 注意：对象/数组类型必须写成函数返回
  }
);

const emit = defineEmits(['update:modelValue', 'close']);

const visible = ref(false);
const logContainer = ref<HTMLElement | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
    if (val) {
      // 滚动到底部
      nextTick(() => {
        if (logContainer.value) {
          logContainer.value.scrollTop = logContainer.value.scrollHeight;
        }
      });
    }
  }
);

function onClose() {
  visible.value = false;
  emit('update:modelValue', false);
  emit('close');
}
</script>

<style scoped>
.log-box {
  max-height: 300px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 10px;
  font-size: 13px;
  line-height: 1.5;
}
</style>
