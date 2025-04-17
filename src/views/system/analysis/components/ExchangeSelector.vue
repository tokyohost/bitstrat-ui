<template>
  <div>
    <el-dropdown trigger="click">
      <el-button>
        <el-icon><i class="el-icon-setting" /></el-icon>
        <el-icon><Operation /></el-icon>过滤交易所
        <el-icon class="el-icon--right"><i class="el-icon-arrow-down" /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu class="exchange-dropdown">
          <div class="dropdown-title">交易所</div>
          <el-checkbox-group v-model="selected">
            <div class="exchange-item" v-for="ex in exchanges" :key="ex.name">
              <el-checkbox :label="ex.name">
                <img :src="ex.logo" alt="logo" class="logo" />
                {{ ex.name }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

interface ExchangeItem {
  name: string;
  logo: string;
}

const props = defineProps<{
  exchanges: ExchangeItem[];
  modelValue?: string[]; // 允许父组件控制默认选中
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();

const selected = ref<string[]>(props.modelValue || []);

// 监听选中变化，emit 拼接字符串和数组
watch(selected, (val) => {
  emit('update:modelValue', val.join(','));
  emit('change', val.join(','));
});
</script>

<style scoped>
.exchange-dropdown {
  padding: 10px;
  width: 220px;
}
.dropdown-title {
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 5px;
}
.exchange-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
}
.logo {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
