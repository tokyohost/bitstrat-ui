<template>
  <div style="cursor: pointer; color: #409EFF;">
    <!-- 显示简短异常内容 -->
    <el-button text @click="openDialog">查看</el-button>
  </div>

  <el-dialog v-model="showDialog" title="异常信息" append-to-body>
    <p style="word-break: break-all;">{{ fullMsg }}</p>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

// 接收外部传入异常信息
const props = defineProps({
  msg: {
    type: String,
    required: true,
  }
});

const showDialog = ref(false);

// 全部异常信息
const fullMsg = computed(() => {
  return props.msg || '';
});

// 简短显示（前20个字）
const shortMsg = computed(() => {
  return fullMsg.value.length > 20
    ? fullMsg.value.slice(0, 20) + '...'
    : fullMsg.value;
});

function openDialog() {
  showDialog.value = true;
}
</script>

<style scoped>
/* 你可以加一点 hover 效果 */
div:hover {
  text-decoration: underline;
}
</style>
