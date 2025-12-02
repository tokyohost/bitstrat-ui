<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!--            <el-form-item label="金额" prop="equity">-->
            <!--              <el-input v-model="queryParams.equity" placeholder="请输入金额" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="可用" prop="freeBalance">-->
            <!--              <el-input v-model="queryParams.freeBalance" placeholder="请输入可用" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="时间戳" prop="time">-->
            <!--              <el-date-picker clearable v-model="queryParams.time" type="date" value-format="YYYY-MM-DD" placeholder="请选择时间戳" />-->
            <!--            </el-form-item>-->
            <el-form-item>
              <!--              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
              <el-button type="primary" icon="Search" @click="getChat">刷新图表</el-button>
              <!--              <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <LineChart
        :key="taskVo?.startBalance || 0"
        :xData="xData"
        :base-line-price="taskVo?.startBalance"
        :seriesData="seriesData"
        title="账户资金趋势"
        tooltipUnit="USDT"
        height="360px"
        :center-line="true"
      >
      </LineChart>
      <LineChart :xData="xDataFreeBalance" :seriesData="seriesDataFreeBalance" title="账户可用余额趋势" tooltipUnit="USDT" height="360px">
      </LineChart>
    </el-card>
    <el-card shadow="never" title="实时持仓" class="mt-2">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <div>实时持仓</div>
          <right-toolbar :search="false" @queryTable="refshPosition"></right-toolbar>
        </el-row>
      </template>
      <PositionWidget ref="positionWidget"></PositionWidget>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="请求日志" name="request">
        <TestAiRequest ref="aiRequestRef"></TestAiRequest>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <TestAiResult ref="aiResultref"></TestAiResult>
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" style="display: none">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:aiLogs:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:aiLogs:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:aiLogs:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:aiLogs:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="aiLogsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="金额" align="center" prop="equity" />
        <el-table-column label="可用" align="center" prop="freeBalance" />
        <el-table-column label="时间戳" align="center" prop="time" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:aiLogs:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:aiLogs:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改AI 测试趋势对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="aiLogsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="金额" prop="equity">
          <el-input v-model="form.equity" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="可用" prop="freeBalance">
          <el-input v-model="form.freeBalance" placeholder="请输入可用" />
        </el-form-item>
        <el-form-item label="时间戳" prop="time">
          <el-date-picker clearable v-model="form.time" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择时间戳">
          </el-date-picker>
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

<script setup name="AiLogs" lang="ts">
import { listAiLogs, getAiLogs, delAiLogs, addAiLogs, updateAiLogs, loadChartData, loadChartDataFreeBalance } from '@/api/system/aiLogs';
import { AiLogsVO, AiLogsQuery, AiLogsForm } from '@/api/system/aiLogs/types';
import LineChart from '@/views/system/aiLogs/LineChart.vue';
import TestAiResult from '@/views/system/testAiResult/index.vue';
import TestAiRequest from '@/views/system/testAiRequest/index.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const aiLogsList = ref<AiLogsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const aiLogsFormRef = ref<ElFormInstance>();
import type { TabsPaneContext } from 'element-plus';
import { getAiTask } from '@/api/system/aiTask';
import { AiTaskVO } from '@/api/system/aiTask/types';
import PositionWidget from '@/views/components/widgets/PositionWidget.vue';
const xData = ref([]);
const seriesData = ref([]);
const xDataFreeBalance = ref([]);
const seriesDataFreeBalance = ref([]);
const positionWidget = useTemplateRef('positionWidget');

const aiResultref = useTemplateRef('aiResultref');
const aiRequestRef = useTemplateRef('aiRequestRef');

const refshPosition = () => {
  positionWidget.value.openRefresh();
};

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AiLogsForm = {
  id: undefined,
  equity: undefined,
  freeBalance: undefined,
  time: undefined
};
const data = reactive<PageData<AiLogsForm, AiLogsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    taskId: undefined,
    pageSize: 10,
    equity: undefined,
    freeBalance: undefined,
    time: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询AI 测试趋势列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.taskId = taskId.value;
  const res = await listAiLogs(queryParams.value);
  aiLogsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
const getChat = async () => {
  loading.value = true;
  queryParams.value.taskId = taskId.value;
  const res = await loadChartData(queryParams.value);
  xData.value = res.data.xData;
  seriesData.value = res.data.seriesData;
  loading.value = false;
};
const getChatFreeBalance = async () => {
  loading.value = true;
  queryParams.value.taskId = taskId.value;
  const res = await loadChartDataFreeBalance(queryParams.value);
  xDataFreeBalance.value = res.data.xData;
  seriesDataFreeBalance.value = res.data.seriesData;
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
  aiLogsFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};
const handleLoadChat = () => {
  getChat();
  getChatFreeBalance();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: AiLogsVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加AI 测试趋势';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AiLogsVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAiLogs(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改AI 测试趋势';
};

/** 提交按钮 */
const submitForm = () => {
  aiLogsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAiLogs(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addAiLogs(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: AiLogsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除AI 测试趋势编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delAiLogs(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

const activeName = ref<string>('request');

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/aiLogs/export',
    {
      ...queryParams.value
    },
    `aiLogs_${new Date().getTime()}.xlsx`
  );
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
  aiRequestRef.value.getList(taskId.value);
  aiResultref.value.getList(taskId.value);
};
const taskId = ref<string>(undefined);
const taskVo = ref<AiTaskVO>(undefined);
onMounted(async () => {
  const id = useRoute().query.id;
  if (!id) {
    ElMessage.error('参数异常！');
    return;
  }
  taskId.value = id as string;
  const res = await getAiTask(id as string);
  taskVo.value = res.data;
  getList();
  handleLoadChat();

  setInterval(() => {
    handleLoadChat();
    if (activeName.value == 'request') {
      aiRequestRef.value.getList(taskId.value);
    } else {
      aiResultref.value.getList(taskId.value);
    }
  }, 1000 * 10);
});
</script>
