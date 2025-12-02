<template>
  <div class="p-0">
    <!--    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">-->
    <!--      <div v-show="showSearch" class="mb-[10px]">-->
    <!--        <el-card shadow="hover">-->
    <!--          <el-form ref="queryFormRef" :model="queryParams" :inline="true">-->
    <!--            <el-form-item label="请求key" prop="requestKey">-->
    <!--              <el-input v-model="queryParams.requestKey" placeholder="请输入请求key" clearable @keyup.enter="handleQuery" />-->
    <!--            </el-form-item>-->
    <!--            <el-form-item>-->
    <!--              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
    <!--              <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
    <!--            </el-form-item>-->
    <!--          </el-form>-->
    <!--        </el-card>-->
    <!--      </div>-->
    <!--    </transition>-->

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:testAiRequest:add']">新增</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:testAiRequest:edit']"-->
          <!--              >修改</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:testAiRequest:remove']"-->
          <!--              >删除</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:testAiRequest:export']">导出</el-button>-->
          <!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" :search="false" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <AiRequestCardList :list="testAiRequestList" @view="handleView" v-if="testAiRequestList.length > 0"></AiRequestCardList>
      <el-empty v-else></el-empty>

      <pagination
        :auto-scroll="false"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="loadList"
      />
    </el-card>
    <!-- 添加或修改AI 用户请求提示词对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%" append-to-body>
      <el-form ref="testAiRequestFormRef" :model="form" :rules="rules" label-width="80px" label-position="top">
        <el-form-item label="请求key" prop="requestKey">
          <el-input v-model="form.requestKey" placeholder="请输入请求key" disabled />
        </el-form-item>
        <el-form-item label="系统提示词">
          <ShowPrompt :raw-text="form.sysContent" :previewLines="4"></ShowPrompt>
        </el-form-item>
        <el-form-item label="用户提示词">
          <ShowPrompt :raw-text="form.content"></ShowPrompt>
        </el-form-item>
        <el-form-item label="响应">
          <ShowPrompt :raw-text="form.result"></ShowPrompt>
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

<script setup name="TestAiRequest" lang="ts">
import { listTestAiRequest, getTestAiRequest, delTestAiRequest, addTestAiRequest, updateTestAiRequest } from '@/api/system/testAiRequest';
import { TestAiRequestVO, TestAiRequestQuery, TestAiRequestForm } from '@/api/system/testAiRequest/types';
import ShowPrompt from '@/views/system/aiTask/ShowPrompt.vue';
import AiRequestCardList from '@/views/system/testAiRequest/AiRequestCardList.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const testAiRequestList = ref<TestAiRequestVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const testAiRequestFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TestAiRequestForm = {
  id: undefined,
  requestKey: undefined,
  content: undefined
};
const data = reactive<PageData<TestAiRequestForm, TestAiRequestQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    requestKey: undefined,
    content: undefined,
    taskId: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});
const { queryParams, form, rules } = toRefs(data);

/** 查询AI 用户请求提示词列表 */
const getList = async (taskId: string) => {
  loading.value = true;
  if (taskId) {
    queryParams.value.taskId = taskId;
  }
  const res = await listTestAiRequest(queryParams.value);
  testAiRequestList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
const loadList = async () => {
  loading.value = true;
  const res = await listTestAiRequest(queryParams.value);
  testAiRequestList.value = res.rows;
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
  testAiRequestFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TestAiRequestVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加AI 用户请求提示词';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TestAiRequestVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getTestAiRequest(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.disabled = true;
  dialog.title = '修改AI 用户请求提示词';
};
/** 修改按钮操作 */
const handleView = async (row?: TestAiRequestVO) => {
  reset();
  console.log(row);
  const _id = row?.id || ids.value[0];
  const res = await getTestAiRequest(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.disabled = true;
  dialog.title = '查看详情';
};

/** 提交按钮 */
const submitForm = () => {
  testAiRequestFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTestAiRequest(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTestAiRequest(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TestAiRequestVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除AI 用户请求提示词编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTestAiRequest(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/testAiRequest/export',
    {
      ...queryParams.value
    },
    `testAiRequest_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
defineExpose({
  getList
});
</script>
