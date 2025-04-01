<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入任务名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="币种" prop="symbol">
              <el-select v-model="queryParams.symbol" :placeholder="proxy.$t('bybit.task.placeholder.symbol')" :filterable="true" clearable>
                <el-option :label="item.name" :value="item.name" v-for="item in symbolList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:task:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:task:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:task:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:task:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
<!--        <el-table-column label="id" align="center" prop="id" v-if="true" />-->
        <el-table-column label="任务名称" align="center" prop="name" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="持仓" align="center" prop="balance" >
          <template #default="scope">
            <span>{{ scope.row.balance ?  scope.row.balance : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单次下单数量" align="center" prop="singleOrder" />
        <el-table-column label="冷却时间" align="center" prop="coldSec" />
        <el-table-column label="可用额度" align="center" prop="totalBalance" />
        <el-table-column label="上次下单时间" align="center" prop="lastOrderTime" width="180">
          <template #default="scope">
            <span>{{ scope.row.lastOrderTime ? parseTime(scope.row.lastOrderTime, '{y}-{m}-{d}') : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用策略类型" align="center" prop="taskType" />
        <el-table-column label="创建人" align="center" prop="createUserName" />
        <el-table-column label="任务状态" align="center" prop="status" >
          <template #default="scope">
            <dict-tag :options="bybit_task_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:task:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:task:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改任务管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <el-form ref="taskFormRef" :model="form" :rules="rules" label-width="80px" :label-position="'top'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="proxy.$t('bybit.task.form.name')" prop="name">
              <el-input v-model="form.name" :placeholder="proxy.$t('bybit.task.placeholder.name')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="proxy.$t('bybit.task.form.symbol')" prop="symbol">
              <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
              <el-select v-model="form.symbol" :placeholder="proxy.$t('bybit.task.placeholder.symbol')" :filterable="true">
                <el-option :label="item.name" :value="item.name" v-for="item in symbolList"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单次下单数量" prop="singleOrder">
              <el-input v-model="form.singleOrder" type="number" min="0.0001" max="100000" step="0.0001" placeholder="请输入单次下单数量(币种)" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下单冷却时间" prop="coldSec">
              <el-input v-model="form.coldSec" type="number" min="1" max="100000" step="1" placeholder="下单冷却时间(秒)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="可用额度" prop="totalBalance">
              <el-input v-model="form.totalBalance" placeholder="请输入任务可支配额度" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="策略选择" prop="taskType">
              <el-select v-model="form.taskType" placeholder="请选择策略">
                <el-option label="AI 策略" value="AI"></el-option>
                <el-option label="普通策略" value="normal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" v-if="form.taskType == 'AI'">
            <el-form-item label="AI 策略" prop="aiWorkflowId">
              <el-select v-model="form.aiWorkflowId" placeholder="请选择策略">
                <el-option :label="item.flowName" :value="item.id" v-for="item in workFlowList"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <el-form-item label="普通策略" prop="roleId">
              <el-input v-model="form.roleId" placeholder="敬请期待" disabled />
            </el-form-item>
          </el-col>
        </el-row>
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

<script setup name="Task" lang="ts">
import { listTask, getTask, delTask, addTask, updateTask } from '@/api/system/task';
import { TaskVO, TaskQuery, TaskForm, SymbolVO } from '@/api/system/task/types';
import { AiConfigQuery, AiConfigVO } from '@/api/system/aiConfig/types';
import { listAiConfig4Select, listBybitSupportSymbols } from '@/api/system/common/common';
import { listAiConfig } from '@/api/system/aiConfig';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { bybit_task_status } = toRefs<any>(proxy?.useDict('bybit_task_status'));

const symbolList = ref<SymbolVO[]>([]);
const workFlowList = ref<AiConfigVO[]>([]);
const taskList = ref<TaskVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const taskFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TaskForm = {
  id: undefined,
  name: undefined,
  symbol: undefined,
  balance: undefined,
  singleOrder: undefined,
  coldSec: undefined,
  totalBalance: undefined,
  lastOrderTime: undefined,
  taskType: "AI",
  aiWorkflowId: undefined,
  roleId: undefined,
  createUserId: undefined,
  status: undefined
};
const data = reactive<PageData<TaskForm, TaskQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    symbol: undefined,
    balance: undefined,
    singleOrder: undefined,
    coldSec: undefined,
    totalBalance: undefined,
    lastOrderTime: undefined,
    taskType: undefined,
    aiWorkflowId: undefined,
    roleId: undefined,
    createUserId: undefined,
    status: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: proxy.$t('bybit.task.rule.id'), trigger: 'blur' }],
    name: [{ required: true, message: proxy.$t('bybit.task.rule.name'), trigger: 'blur' }],
    symbol: [{ required: true, message: proxy.$t('bybit.task.rule.symbol'), trigger: 'blur' }],
    singleOrder: [{ required: true, message: '单次下单数量不能为空', trigger: 'blur' }],
    coldSec: [{ required: true, message: '下单冷却时间不能为空', trigger: 'blur' }],
    totalBalance: [{ required: true, message: '任务可支配额度不能为空', trigger: 'blur' }],
    taskType: [{ required: true, message: '请选择策略', trigger: 'blur' }],
    aiWorkflowId: [{ required: true, message: '请选择策略', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择策略', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询任务管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTask(queryParams.value);
  taskList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const loadSymbol = async () => {
  loading.value = true;
  let res = await listBybitSupportSymbols({});
  console.log(res);
  if (res.code == 200) {
    symbolList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
  loading.value = false;
};
const loadAiConfig = async () => {
  loading.value = true;
  const query:Object = {}
  let res = await listAiConfig4Select(query);
  console.log(res);
  if (res.code == 200) {
    workFlowList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
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
  taskFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TaskVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加任务';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getTask(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改任务';
};

/** 提交按钮 */
const submitForm = () => {
  taskFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTask(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTask(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除任务管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTask(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/task/export',
    {
      ...queryParams.value
    },
    `task_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  loadSymbol();
  loadAiConfig();
});
</script>
