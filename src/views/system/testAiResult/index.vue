<template>
  <div class="p-0">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!--      <el-table v-loading="loading" :data="testAiResultList" @selection-change="handleSelectionChange">-->
      <!--        <el-table-column type="selection" width="55" align="center" />-->
      <!--        <el-table-column label="id" align="center" prop="id" v-if="true" />-->
      <!--        <el-table-column label="操作" align="center" prop="action" />-->
      <!--        <el-table-column label="杠杆" align="center" prop="leverage" />-->
      <!--        <el-table-column label="数量" align="center" prop="size" />-->
      <!--        <el-table-column label="币对" align="center" prop="symbol" />-->
      <!--        <el-table-column label="止盈" align="center" prop="takeProfit" />-->
      <!--        <el-table-column label="止损" align="center" prop="stopLoss" />-->
      <!--        <el-table-column label="分析EN" align="center" prop="reasoningEn" />-->
      <!--        <el-table-column label="分析zh" align="center" prop="reasoningZh" />-->
      <!--      </el-table>-->

      <AiCardList :test-ai-result-list="testAiResultList" v-if="testAiResultList.length > 0"></AiCardList>
      <el-empty v-else></el-empty>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改AI 操作日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="testAiResultFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="操作" prop="action">
          <el-input v-model="form.action" placeholder="请输入操作" />
        </el-form-item>
        <el-form-item label="杠杆" prop="leverage">
          <el-input v-model="form.leverage" placeholder="请输入杠杆" />
        </el-form-item>
        <el-form-item label="数量" prop="size">
          <el-input v-model="form.size" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="币对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币对" />
        </el-form-item>
        <el-form-item label="止盈" prop="takeProfit">
          <el-input v-model="form.takeProfit" placeholder="请输入止盈" />
        </el-form-item>
        <el-form-item label="止损" prop="stopLoss">
          <el-input v-model="form.stopLoss" placeholder="请输入止损" />
        </el-form-item>
        <el-form-item label="分析EN" prop="reasoningEn">
          <el-input v-model="form.reasoningEn" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="分析zh" prop="reasoningZh">
          <el-input v-model="form.reasoningZh" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
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
  queryParams.value.taskId = taskId;
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
