<template>
  <el-form :model="props.modelValue" label-width="100px">
    <el-form-item v-for="field in fields" :key="field.prop" :label="t(`${i18nPrefix}.${field.prop}`)">
      <el-input
        v-model="props.modelValue[field.prop]"
        :type="field.type || 'text'"
        :show-password="field.showPassword || false"
        :placeholder="field.placeholder || ''"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface FieldConfig {
  prop: string;
  type?: string;
  placeholder?: string;
}

const props = defineProps<{
  fields: FieldConfig[];
  modelValue: Record<string, any>;
  i18nPrefix: string; // 例如 'exchange.api'
}>();

const { t } = useI18n();
</script>
