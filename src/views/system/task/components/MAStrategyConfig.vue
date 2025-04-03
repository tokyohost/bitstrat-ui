<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';
import 'jsoneditor';
import JsonEditorVue from 'json-editor-vue3';

// 通过 defineProps 获取父组件传递的 props
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const updataModel = (val: any) => {
  // data.value = val;
  // console.log(val);
  // emit('update:modelValue', val);
};

// 通过 defineEmits 定义一个事件，用来将数据更新同步到父组件
const emit = defineEmits(['update:modelValue']);
const defaultValue: object = {
  order: ['此处填写下单规则,可多个，参数可用 MA7 MA21 MA63 MA189', '示例', 'MA7>MA21>MA63>MA189'],
  sell: [
    '此处填写卖出规则，卖出规则可多个,参数可用 MA7 MA21 MA63 MA189',
    '示例：',
    { role: '卖出条件,示例：MA7<MA21<MA63<MA189', unit: '单位：可选percentage(百分比)/quantity(具体数量)', limit: '卖出数量，示例：1' }
  ]
};
// 初始化默认值，检查 modelValue 是否为空对象
const data = ref(props.modelValue && Object.keys(props.modelValue).length ? props.modelValue : defaultValue);

// const data = ref(props.modelValue);

// 数据更新时发射事件
const validate = async (editor) => {
  const res = await editor.validate();
  // res 是错误列表，如果是空数组，则表示检测没有错误
  console.log(res);
  console.log(data.value);
  // ElMessage.success('已保存');
  // 发射事件更新父组件的 data
  emit('update:modelValue', data.value);
};
</script>

<template>
  <JsonEditorVue class="editor" @update:modelValue="updataModel" v-model="data" @blur="validate" />
  <el-button>保存</el-button>
</template>

<style scoped lang="scss"></style>
