<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" :search="false" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="taskLogList" @selection-change="handleSelectionChange">
        <el-table-column label="下单时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ scope.row.createTime ? scope.row.createTime : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单价格" align="center" prop="basePrice">
          <template #default="scope">
            <span>{{ scope.row.basePrice ? scope.row.basePrice + 'USDT' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下单数量" align="center" prop="price">
          <template #default="scope">
            <span>{{ scope.row.price ? scope.row.price + props.modelValue.symbol : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="bybit_task_log_type" :value="scope.row.type" :i18n-profilx="'bybit.task.log.type'" />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="bybit_task_log_status" :value="scope.row.status" :i18n-profilx="'bybit.task.log.status'" />
          </template>
        </el-table-column>
        <el-table-column label="成交状态" align="center" prop="orderStatus">
          <template #default="scope">
            <dict-tag :options="bybit_task_log_order_status" :value="scope.row.orderStatus" :i18n-profilx="'bybit.task.log.status'" />
          </template>
        </el-table-column>
        <el-table-column label="平均成交价" align="center" prop="avgPrice">
          <template #default="scope">
            <span>{{ scope.row.avgPrice ? scope.row.avgPrice + 'USDT' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="持仓数量" align="center" prop="total">
          <template #default="scope">
            <span>{{ scope.row.total ? scope.row.total + props.modelValue.symbol : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="触发条件" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip :content="scope.row.express" placement="top"
              ><el-icon><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="异常" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip :content="scope.row.msg ? scope.row.msg : '无异常'" placement="top"
              ><el-icon><WarningFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改任务买入卖出日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="taskLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务id" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model="form.count" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="总金额" prop="total">
          <el-input v-model="form.total" placeholder="请输入总金额" />
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

<script setup name="TaskLog" lang="ts">
import { listTaskLog, getTaskLog, delTaskLog, addTaskLog, updateTaskLog } from '@/api/system/taskLog';
import { TaskLogVO, TaskLogQuery, TaskLogForm } from '@/api/system/taskLog/types';
import { defineProps } from 'vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { bybit_task_log_order_status } = toRefs<any>(proxy?.useDict('bybit_task_log_order_status'));
const { bybit_task_log_status } = toRefs<any>(proxy?.useDict('bybit_task_log_status'));
const { bybit_task_log_type } = toRefs<any>(proxy?.useDict('bybit_task_log_type'));
const taskLogList = ref<TaskLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const queryFormRef = ref<ElFormInstance>();
const taskLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: '',
  disabled: false
});

const initFormData: TaskLogForm = {
  id: undefined,
  taskId: undefined,
  price: undefined,
  count: undefined,
  type: undefined,
  total: undefined
};
const data = reactive<PageData<TaskLogForm, TaskLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskId: undefined,
    price: undefined,
    count: undefined,
    type: undefined,
    total: undefined,
    orderByColumn: 'create_time',
    isAsc: 'desc',
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询任务买入卖出日志列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.taskId = props.modelValue.id;
  queryParams.value.orderByColumn = 'create_time';
  const res = await listTaskLog(queryParams.value);
  taskLogList.value = res.rows;
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
  taskLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TaskLogVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加任务买入卖出日志';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: TaskLogVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getTaskLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改任务买入卖出日志';
};

/** 提交按钮 */
const submitForm = () => {
  taskLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTaskLog(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTaskLog(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TaskLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除任务买入卖出日志编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTaskLog(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/taskLog/export',
    {
      ...queryParams.value
    },
    `taskLog_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
