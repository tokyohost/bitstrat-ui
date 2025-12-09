<template>
  <div class="exchange-info">
    <img v-if="logoUrl" :src="logoUrl" :alt="exchange" class="exchange-logo" @error="onError" />
    {{ exchange ? exchange.toUpperCase() : '' }}
    <slot name="default" style="color: var(--el-text-color)"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

// 预加载所有 png 图标文件
const logoMap = import.meta.glob('@/assets/exchanges/*.png', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

const props = defineProps<{
  exchange: string;
}>();

const defaultLogo = logoMap['/src/assets/exchanges/default.png'];
const logoUrl = ref(defaultLogo);

const normalizedKey = computed(() => {
  if (props.exchange) {
    return props.exchange
      .trim()
      .toLowerCase()
      .replace(/[\s\.]/g, '');
  } else {
    return '';
  }
});

for (const path in logoMap) {
  const key = path.match(/\/([a-zA-Z0-9]+)\.png$/)?.[1];
  if (key) {
    logoMap[key.toLowerCase()] = logoMap[path];
  }
}

if (logoMap[normalizedKey.value]) {
  logoUrl.value = logoMap[normalizedKey.value];
}

function onError() {
  logoUrl.value = defaultLogo;
}
</script>

<style scoped>
.exchange-logo {
  width: 15px;
  height: 15px;
  vertical-align: middle;
}
.exchange-info {
  display: flex;
  align-items: center;
}
</style>
