<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="告警配置名称" prop="configName" label-width="120px">
              <el-input v-model="queryParams.configName" placeholder="请输入告警配置名称" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:arbitrageWarningConfig:add']">新增</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="arbitrageWarningConfigList" @selection-change="handleSelectionChange">
        <el-table-column label="套利币对" align="center" prop="symbol" />
        <el-table-column label="做多交易所/做空交易所" align="center" prop="longEx" width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              <ExchangeLogo :exchange="scope.row.longEx" :key="new Date().getMilliseconds()"></ExchangeLogo><el-divider direction="vertical" />
              <ExchangeLogo :exchange="scope.row.shortEx" :key="new Date().getMilliseconds()"></ExchangeLogo>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="警告阈值" align="center" prop="warningThreshold" >
          <template #default="scope">
            {{scope.row.warningThreshold}} %
          </template>
        </el-table-column>
        <el-table-column label="告警配置名称" align="center" prop="configName" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:arbitrageWarningConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:arbitrageWarningConfig:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户配置套利警告对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="900px" append-to-body>
      <el-form ref="arbitrageWarningConfigFormRef" :model="form" :rules="rules" label-width="180px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="套利任务" prop="taskId">
              <!--          <el-input v-model="form.taskId" placeholder="请输入跨交易所套利任务ID" />-->
              <el-button type="text" @click="openTaskDialog">选择任务</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="套利币对" prop="taskId">
              <el-input  v-model="form.symbol" disabled placeholder="请选择套利任务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="做多交易所/做空交易所" prop="taskId">
              <el-input v-model="taskDisplayName" disabled placeholder="请选择套利任务" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="警告阈值" prop="warningThreshold">
              <el-input-number v-model="form.warningThreshold" style="width: 100%"
                               placeholder="请输入警告阈值（%）" :precision="4" :step="0.1" :max="10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警配置名称" prop="configName">
              <el-input v-model="form.configName" placeholder="请输入告警配置名称" :maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="正常" :value="1"></el-option>
                <el-option label="停用" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="选择跨交易所套利任务" v-model="taskDialogVisible" width="800px" append-to-body>
      <el-table :data="taskList">
        <el-table-column type="radio" width="50" align="center">
          <template #default="scope">
            <el-radio v-model="selectedTask" :value="scope.row" />
          </template>
        </el-table-column>
        <el-table-column label="任务ID" prop="id" />
        <el-table-column label="套利币对" prop="symbol" />
        <el-table-column label="做多交易所/做空交易所" prop="longEx">
          <template #default="scope">
            <div class="flex items-center">
              <ExchangeLogo :exchange="scope.row.longEx" />
              <el-divider direction="vertical" />
              <ExchangeLogo :exchange="scope.row.shortEx" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 flex justify-between items-center">
        <pagination
          v-show="taskTotal > 0"
          :total="taskTotal"
          v-model:page="taskQueryParams.pageNum"
          v-model:limit="taskQueryParams.pageSize"
          @pagination="getTaskList"
        />
        <el-button type="primary" @click="confirmTaskSelect">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="ArbitrageWarningConfig" lang="ts">
import { listArbitrageWarningConfig, getArbitrageWarningConfig, delArbitrageWarningConfig, addArbitrageWarningConfig, updateArbitrageWarningConfig } from '@/api/system/arbitrageWarningConfig';
import { ArbitrageWarningConfigVO, ArbitrageWarningConfigQuery, ArbitrageWarningConfigForm } from '@/api/system/arbitrageWarningConfig/types';
import ExchangeLogo from "@/views/system/analysis/components/ExchangeLogo.vue";
import {listCrossExchangeArbitrageTask} from "@/api/system/crossExchangeArbitrageTask";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const arbitrageWarningConfigList = ref<ArbitrageWarningConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const arbitrageWarningConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ArbitrageWarningConfigForm = {
  id: undefined,
  taskId: undefined,
  arbitrageType: undefined,
  warningThreshold: undefined,
  configName: undefined,
  remark: undefined,
  status: 1, // 默认值为正常
}

const data = reactive<PageData<ArbitrageWarningConfigForm, ArbitrageWarningConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskId: undefined,
    arbitrageType: undefined,
    warningThreshold: undefined,
    configName: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键ID不能为空", trigger: "blur" }
    ],
    taskId: [
      { required: true, message: "跨交易所套利任务ID不能为空", trigger: "blur" }
    ],
    arbitrageType: [
      { required: true, message: "套利类型：1:跨交易所套利，2:。。。详见枚举类不能为空", trigger: "change" }
    ],
    warningThreshold: [
      { required: true, message: "警告阈值不能为空", trigger: "blur" }
    ],
    configName: [
      { required: true, message: "告警配置名称不能为空", trigger: "blur" },
      { max: 20, message: "告警配置名称长度不能超过20个字符", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
// 新增计算属性
const taskDisplayName = computed(() => {
  if (form.value.taskId && form.value.longEx && form.value.shortEx)
  return `${form.value.longEx}|${form.value.shortEx}`;
});
/** 查询用户配置套利警告列表 */
const getList = async () => {
  loading.value = true;
  const res = await listArbitrageWarningConfig(queryParams.value);
  arbitrageWarningConfigList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  arbitrageWarningConfigFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: ArbitrageWarningConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户配置套利警告";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ArbitrageWarningConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getArbitrageWarningConfig(_id);
  Object.assign(form.value, res.data);
  form.value.longEx = row.longEx;
  form.value.shortEx = row.shortEx;
  form.value.symbol = row.symbol;
  dialog.visible = true;
  dialog.title = "修改用户配置套利警告";
}

/** 提交按钮 */
const submitForm = () => {
  arbitrageWarningConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      // 自动获取用户ID
      form.value.userId = proxy?.userId; // 假设可以通过 proxy 获取用户ID
      if (form.value.id) {
        await updateArbitrageWarningConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addArbitrageWarningConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ArbitrageWarningConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户配置套利警告编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delArbitrageWarningConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/arbitrageWarningConfig/export', {
    ...queryParams.value
  }, `arbitrageWarningConfig_${new Date().getTime()}.xlsx`)
}

const taskDialogVisible = ref(false);
const taskList = ref([]);

const taskQueryParams = ref({
  pageNum: 1,
  pageSize: 10,
});

const taskTotal = ref(0);

const selectedTask = ref(null);

const getTaskList = async () => {
  const res = await listCrossExchangeArbitrageTask(taskQueryParams.value);
  taskList.value = res.rows;
  taskTotal.value = res.total;
};

const openTaskDialog = () => {
  getTaskList();
  taskDialogVisible.value = true;
};

const handleTaskSelect = (row) => {
  selectedTask.value = row;
};

const confirmTaskSelect = () => {
  if (selectedTask.value) {
    form.value.taskId = selectedTask.value.id;
    form.value.shortEx = selectedTask.value.shortEx;
    form.value.longEx = selectedTask.value.longEx;
    form.value.symbol = selectedTask.value.symbol;
    taskDialogVisible.value = false;
  } else {
    ElMessage.warning('请先选择一个任务');
  }
};

onMounted(() => {
  getList();
});
</script>


