<template>
  <div class="p-0">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" :search="false" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <AiCardList :test-ai-result-list="testAiResultList" v-if="testAiResultList.length > 0"></AiCardList>
      <el-empty v-else></el-empty>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="TestAiResult" lang="ts">
import { listTestAiResult, getTestAiResult, delTestAiResult, addTestAiResult, updateTestAiResult } from '@/api/system/testAiResult';
import { TestAiResultVO, TestAiResultQuery, TestAiResultForm } from '@/api/system/testAiResult/types';
import AiCardList from '@/views/system/testAiResult/AiCardList.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const testAiResultList = ref<TestAiResultVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const testAiResultFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TestAiResultForm = {
  id: undefined,
  action: undefined,
  leverage: undefined,
  size: undefined,
  symbol: undefined,
  takeProfit: undefined,
  stopLoss: undefined,
  reasoningEn: undefined,
  reasoningZh: undefined
};
const data = reactive<PageData<TestAiResultForm, TestAiResultQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    action: undefined,
    leverage: undefined,
    size: undefined,
    symbol: undefined,
    takeProfit: undefined,
    stopLoss: undefined,
    reasoningEn: undefined,
    reasoningZh: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询AI 操作日志列表 */
const getList = async (taskId: string) => {
  loading.value = true;
  if (taskId) {
    queryParams.value.taskId = taskId;
  }
  const res = await listTestAiResult(queryParams.value);
  testAiResultList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  testAiResultFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: TestAiResultVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加AI 操作日志';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TestAiResultVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getTestAiResult(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改AI 操作日志';
};

/** 提交按钮 */
const submitForm = () => {
  testAiResultFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTestAiResult(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTestAiResult(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TestAiResultVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除AI 操作日志编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTestAiResult(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/testAiResult/export',
    {
      ...queryParams.value
    },
    `testAiResult_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
defineExpose({
  getList
});
</script>
