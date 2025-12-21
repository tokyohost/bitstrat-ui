<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { ElMessage, FormInstance } from 'element-plus';
import { FormSchemaItem, OptionsItem, SelectItem } from '@/components/SmartSelectSchema/type';
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  modelValue: any;
  options: SelectItem[];
  labelKey: string;
  valueKey: string;
  formSchema: FormSchemaItem;
  dialogTitle?: string;
  multiple?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue', 'create']);

const CREATE_FLAG = '__CREATE__';
const multiple = props.multiple ?? false;
const innerValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (v) => (innerValue.value = v)
);

const visible = ref(false);

watch(innerValue, (val) => {
  if (multiple) {
    if (Array.isArray(val) && val.includes(CREATE_FLAG)) {
      openDialog();
      innerValue.value = val.filter((v) => v !== CREATE_FLAG);
    } else {
      emit('update:modelValue', val);
    }
  } else {
    if (val === CREATE_FLAG) openDialog();
    else emit('update:modelValue', val);
  }
});

/* ---------- 弹窗 ---------- */
const formRef = ref<FormInstance>();
const formModel = reactive({});

const formRules = reactive({});
const buildForm = (formSchema: FormSchemaItem) => {
  if (!formSchema) {
    return;
  }

  formModel[formSchema.field] = null;

  if (formSchema?.defaultValue) {
    formModel[formSchema.field] = formSchema.defaultValue;
    if (formSchema.component === 'select' && formSchema.options.length) {
      formModel[formSchema.field] = formSchema.options[0].value;
      optionsSelect(formModel[formSchema.field], formSchema.options);
    }
  }
  const rules = [];

  if (formSchema.rules) {
    rules.push(...formSchema.rules);
  } else {
    if (formSchema.required) {
      rules.push({ required: true, message: `${formSchema.label}必填`, trigger: 'blur' });
    }
  }
  rules.push({
    validator: (_rule, value, callback) => {
      const value1 = innerValue.value as string[];
      console.log('innerValue.value', innerValue.value);
      const key = formModel[props.formSchema.field] + formModel[children.value.field];
      if (value1.indexOf(key) != -1) {
        callback(new Error('已存在该选项'));
      } else {
        if (props.options.filter((item) => item.code === key).length === 0) {
        } else {
          callback(new Error('已存在该选项'));
        }
      }
      callback();
    },
    trigger: 'change'
  });
  if (rules.length) {
    formRules[formSchema.field] = rules;
  }
  //检查是否已添加存在的目标

  console.log('------', formModel, formRules, formSchema);
};
buildForm(null);

const openDialog = () => {
  console.log('view');
  buildForm(props.formSchema);
  visible.value = true;
};
const children = ref<FormSchemaItem>(null);
const selectOption = ref<OptionsItem>(null);
const submit = async () => {
  await formRef.value?.validate();
  const newItem = { code: formModel[props.formSchema.field] + formModel[children.value.field] } as SelectItem;
  emit('create', newItem);

  if (multiple) {
    innerValue.value = [...(innerValue.value || []), newItem[props.valueKey]];
  } else {
    innerValue.value = newItem[props.valueKey];
  }

  ElMessage.success('新增成功');
  visible.value = false;
  children.value = null;
  formRef.value?.resetFields();
};

const optionsSelect = async (val, options: OptionsItem[]) => {
  console.log(val);
  options.forEach((item: OptionsItem) => {
    if (item.value === val) {
      children.value = item.children;
      selectOption.value = item;
      buildForm(item.children);
    }
  });
};
</script>

<template>
  <el-select v-model="innerValue" :placeholder="placeholder" filterable clearable :multiple="multiple" style="width: 100%">
    <el-option v-for="item in options" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />

    <el-option v-if="multiple || !multiple" :value="CREATE_FLAG" label="自定义" />
  </el-select>

  <!-- 弹窗 -->
  <el-dialog v-model="visible" :title="dialogTitle" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="100px">
      <div :class="children ? 'flex flex-row gap-1 justify-between items-center w-full' : ''">
        <el-popover :title="selectOption.label" :content="selectOption.desc" placement="top-start" v-if="selectOption?.desc">
          <template #reference>
            <el-icon class="hover:cursor-pointer"><InfoFilled /></el-icon>
          </template>
        </el-popover>
        <el-form-item :prop="formSchema.field" :class="children ? 'w-full' : 'flex-1'">
          <div class="w-full">
            <el-input v-if="formSchema.component === 'input'" v-model="formModel[formSchema.field]" v-bind="formSchema.props" />
            <el-input-number v-if="formSchema.component === 'input-number'" v-model="formModel[formSchema.field]" v-bind="formSchema.props" />
            <el-input
              v-else-if="formSchema.component === 'textarea'"
              type="textarea"
              v-model="formModel[formSchema.field]"
              v-bind="formSchema.props"
            />
            <el-select
              v-else-if="formSchema.component === 'select'"
              v-model="formModel[formSchema.field]"
              v-bind="formSchema.props"
              placeholder="请选择自定义指标项"
              @change="optionsSelect($event, formSchema.options)"
            >
              <el-option v-for="op in formSchema.options" :key="op.value" :label="op.label" :value="op.value">
                <div class="flex justify-between items-center w-full">
                  <span>{{ op.label }}</span>
                  <span v-if="op?.shortcut">{{ op.shortcut }}</span>
                </div>
              </el-option>
            </el-select>
            <el-input-number v-else-if="formSchema.component === 'number'" v-model="formModel[formSchema.field]" v-bind="formSchema.props" />
            <el-switch v-else-if="formSchema.component === 'switch'" v-model="formModel[formSchema.field]" />
          </div>
        </el-form-item>
        <el-form-item v-if="children" class="flex-1" :prop="children.field">
          <div>
            <el-input v-if="children.component === 'input'" v-model="formModel[children.field]" v-bind="children.props" />
            <el-input-number v-if="children.component === 'input-number'" v-model="formModel[children.field]" v-bind="children.props" />
            <el-input v-else-if="children.component === 'textarea'" type="textarea" v-model="formModel[children.field]" v-bind="children.props" />
            <el-select v-else-if="children.component === 'select'" v-model="formModel[children.field]" v-bind="children.props">
              <el-option v-for="op in children.options" :key="op.value" :label="op.label" :value="op.value" />
            </el-select>
            <el-input-number v-else-if="children.component === 'number'" v-model="formModel[children.field]" v-bind="children.props" />
            <el-switch v-else-if="children.component === 'switch'" v-model="formModel[children.field]" />
          </div>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit(formSchema, children)">确定</el-button>
    </template>
  </el-dialog>
</template>
