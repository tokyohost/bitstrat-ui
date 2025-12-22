<script setup lang="ts">
import { reactive, ref, watch, nextTick } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { extConfigItem, FormSchemaItem, OptionsItem } from '@/components/SmartSelectSchema/type';
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  modelValue: extConfigItem[];
  schema: FormSchemaItem;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: extConfigItem[]): void;
}>();

/* ===== 表单实例 ===== */
const formRef = ref<FormInstance>();

/* ===== 已确认的行（只读） ===== */
const rows = reactive<{ type: string; value: any; locked: true }[]>([]);

/* ===== 新增弹框 ===== */
const dialogVisible = ref(false);
const dialogForm = reactive({
  type: '' as string,
  value: null as any
});

const dialogFormRef = ref<FormInstance>();

/* ===== 初始化 & 同步外部值 ===== */
watch(
  () => props.modelValue,
  (val) => {
    rows.length = 0;
    val?.forEach((item) => {
      rows.push({
        type: item.type,
        value: item.value,
        locked: true
      });
    });
  },
  { immediate: true, deep: true }
);

/* ===== 工具方法 ===== */
function findOption(type: string) {
  return props.schema.options?.find((o) => o.value === type);
}

function syncEmit() {
  emit(
    'update:modelValue',
    rows.map((r) => ({
      type: r.type,
      value: String(r.value)
    }))
  );
}

/* ===== 新增逻辑 ===== */
function openAddDialog() {
  dialogForm.type = '';
  dialogForm.value = null;
  dialogVisible.value = true;
}

function confirmAdd() {
  dialogFormRef.value?.validate((valid) => {
    if (!valid) return;

    // 防重复
    const key = dialogForm.type + dialogForm.value;
    if (rows.some((r) => r.type + r.value === key)) {
      return ElMessage.error('该指标已存在');
    }

    rows.push({
      type: dialogForm.type,
      value: dialogForm.value,
      locked: true
    });

    dialogVisible.value = false;
    nextTick(syncEmit);
  });
}

/* ===== 删除 ===== */
function removeRow(index: number) {
  rows.splice(index, 1);
  nextTick(syncEmit);
}

/* ===== 弹框校验规则 ===== */
const dialogRules: FormRules = {
  type: [{ required: true, message: '请选择指标', trigger: 'change' }],
  value: [
    {
      validator: (_r, v, cb) => {
        const opt = findOption(dialogForm.type);
        if (opt?.children?.required && (v === null || v === undefined)) {
          cb(new Error(`${opt.children.label}不能为空`));
        } else {
          cb();
        }
      },
      trigger: 'change'
    }
  ]
};
const option = ref<OptionsItem>({});
const createModify = (val) => {
  option.value = props.schema.options.find((item) => {
    return item.value === val;
  });
};

defineExpose({ formRef });
</script>

<template>
  <!-- 已确认指标列表（只读） -->
  <el-form ref="formRef" :model="rows" class="w-full mt-5">
    <div v-for="(row, index) in rows" :key="index" class="config-row">
      <el-form-item :label="`${schema.label}（${index + 1}）`">
        <el-select v-model="row.type" disabled style="width: 140px">
          <el-option v-for="opt in schema.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="findOption(row.type)?.children" :label="findOption(row.type)?.children?.label" style="margin-left: 12px">
        <el-input-number v-model="row.value" disabled v-bind="findOption(row.type)?.children?.props" />
      </el-form-item>

      <el-button type="danger" text @click="removeRow(index)"> 删除 </el-button>
    </div>

    <el-button type="primary" plain @click="openAddDialog"> + 新增指标 </el-button>
  </el-form>

  <!-- 新增弹框 -->
  <el-dialog v-model="dialogVisible" title="新增指标" destroy-on-close>
    <el-form ref="dialogFormRef" :model="dialogForm" :rules="dialogRules" label-position="top">
      <el-form-item label="指标" prop="type">
        <template #label>
          <span
            >指标<span
              ><el-popover :title="option.label" :content="option.desc" placement="top-start" v-if="option?.desc">
                <template #reference>
                  <el-icon class="hover:cursor-pointer"><InfoFilled /></el-icon>
                </template> </el-popover></span
          ></span>
        </template>

        <el-select v-model="dialogForm.type" @change="createModify">
          <el-option v-for="opt in schema.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="findOption(dialogForm.type)?.children" :label="findOption(dialogForm.type)?.children?.label" prop="value">
        <el-input-number v-model="dialogForm.value" v-bind="findOption(dialogForm.type)?.children?.props" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmAdd">确认</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.config-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
</style>
