<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  rawText: {
    type: String,
    default: ''
  },
  previewLines: {
    type: Number,
    default: 4 // 默认显示 4 行
  }
});

const expanded = ref(false);

// 将 "\n" 转成真实换行
const formattedText = computed(() => {
  if (!props.rawText) {
    return '';
  }
  return props.rawText?.replace(/\\n/g, '\n');
});

// 判断是否超行
const isOverflow = computed(() => {
  const lines = formattedText.value?.split('\n');
  return lines.length > props.previewLines;
});

// 折叠状态下，只取前几行
const previewText = computed(() => {
  if (expanded.value) return formattedText.value;

  const lines = formattedText.value.split('\n');

  if (lines.length <= props.previewLines) return formattedText.value;

  return lines.slice(0, props.previewLines).join('\n') + '\n...';
});
</script>

<template>
  <div class="content-wrapper">
    <pre class="content-block"
      >{{ previewText || '-' }}
    </pre>

    <!-- 展开 / 收起按钮 -->
    <div v-if="isOverflow" class="toggle-btn" @click="expanded = !expanded">
      {{ expanded ? '收起' : '展开更多' }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.content-wrapper {
  margin-bottom: 8px;
}

.content-block {
  white-space: pre-wrap;
  background: #f7f7f8;
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  font-family: 'JetBrains Mono', Consolas, monospace;
  overflow-x: auto;
  transition: max-height 0.3s ease;
}

.toggle-btn {
  color: #409eff;
  cursor: pointer;
  margin-top: 4px;
  font-size: 13px;
  user-select: none;
  transition: color 0.2s;
}

.toggle-btn:hover {
  color: #66b1ff;
}
</style>
