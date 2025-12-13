<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <div class="font-bold text-lg mb-3 md:mb-0">
            {{ taskVo?.name || '-' }}
          </div>

          <div class="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              unlink-panels
              :range-separator="t('aiLogs.rangeSeparator')"
              :start-placeholder="t('aiLogs.startDate')"
              :end-placeholder="t('aiLogs.endDate')"
              size="default"
              :shortcuts="shortcuts"
              @change="handleDateChange"
              class="chart-date-picker w-full"
            />

            <div class="flex w-full md:w-auto gap-3">
              <el-button type="primary" size="default" @click="handleQuery" class="flex-grow md:w-auto">
                {{ t('aiLogs.query') }}
              </el-button>
              <el-button circle icon="Refresh" @click="getChat" class="flex-shrink-0" />
            </div>
          </div>
        </div>
      </template>
      <div class="flex flex-col md:flex-row gap-2">
        <LineChart
          :key="taskVo?.startBalance || 0"
          :xData="xData"
          :seriesData="seriesData"
          :title="t('aiLogs.accountFundsTrend')"
          :tooltipUnit="t('aiLogs.usdt')"
          height="360px"
          :center-line="true"
        >
        </LineChart>
        <LineChart
          :xData="xDataFreeBalance"
          :seriesData="seriesDataFreeBalance"
          :title="t('aiLogs.accountAvailableTrend')"
          :tooltipUnit="t('aiLogs.usdt')"
          height="360px"
        >
        </LineChart>
      </div>
    </el-card>
    <el-card shadow="never" class="mt-2">
      <template #header>
        <el-row :gutter="10" class="mb8 justify-between flex">
          <div>{{ t('aiLogs.realtimePosition') }}</div>
          <right-toolbar :search="false" @queryTable="refshPosition"></right-toolbar>
        </el-row>
      </template>
      <PositionWidget ref="positionWidget" :accountId="taskVo?.apiId"></PositionWidget>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="t('aiLogs.requestLog')" name="request">
        <TestAiRequest :task-id="taskId" ref="aiRequestRef"></TestAiRequest>
      </el-tab-pane>
      <el-tab-pane :label="t('aiLogs.operationLog')" name="log">
        <TestAiResult ref="aiResultref"></TestAiResult>
      </el-tab-pane>
      <el-tab-pane :label="t('aiLogs.historyPosition')" name="history">
        <HistoryPosition ref="aiHistoryRef" :task="taskVo as AiTaskVO"></HistoryPosition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="AiLogs" lang="ts">
import { useI18n } from 'vue-i18n';
import { listAiLogs, getAiLogs, delAiLogs, addAiLogs, updateAiLogs, loadChartData, loadChartDataFreeBalance } from '@/api/system/aiLogs';
import { AiLogsVO, AiLogsQuery, AiLogsForm } from '@/api/system/aiLogs/types';
import LineChart from '@/views/system/aiTaskLogs/LineChart.vue';
import TestAiResult from '@/views/system/testAiResult/index.vue';
import TestAiRequest from '@/views/system/testAiRequest/index.vue';
import type { TabsPaneContext } from 'element-plus';
import { getAiTask } from '@/api/system/aiTask';
import { AiTaskVO } from '@/api/system/aiTask/types';
import PositionWidget from '@/views/components/widgets/PositionWidget.vue';
import HistoryPosition from '@/views/system/historyPosition/HistoryPosition.vue';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();

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

const xData = ref<any[]>([]);
const seriesData = ref<any[]>([]);
const xDataFreeBalance = ref<any[]>([]);
const seriesDataFreeBalance = ref<any[]>([]);

const positionWidget = useTemplateRef('positionWidget');
const aiResultref = useTemplateRef('aiResultref');
const aiRequestRef = useTemplateRef('aiRequestRef');
const aiHistoryRef = useTemplateRef('aiHistoryRef');

const refshPosition = () => {
  positionWidget.value?.openRefresh();
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

/**
 * 搜索按钮操作
 */
const handleQuery = () => {
  // 1. 检查日期范围是否有效
  if (!dateRange.value || dateRange.value.length !== 2) {
    proxy?.$modal.msgWarning(t('aiLogs.selectDateRange'));
    return;
  }

  const [rawStartDate, rawEndDate] = dateRange.value;

  // 1. 调整开始日期：确保从当天的 00:00:00 开始
  const start = new Date(rawStartDate.getFullYear(), rawStartDate.getMonth(), rawStartDate.getDate(), 0, 0, 0);
  const startDateISO = start.toISOString();

  // 2. 调整结束日期：确保到当天的 23:59:59 结束
  const end = new Date(rawEndDate.getFullYear(), rawEndDate.getMonth(), rawEndDate.getDate(), 23, 59, 59, 999);
  const endDateISO = end.toISOString();

  // 设置查询参数
  queryParams.value.pageNum = 1;
  queryParams.value.startDate = startDateISO;
  queryParams.value.endDate = endDateISO;
  handleLoadChat();
};

const handleLoadChat = () => {
  console.log('handleLoadChat');
  getChat();
  getChatFreeBalance();
};

// 时间选择逻辑
const dateRange = ref<[Date, Date] | null>(null);

// 快捷选项配置 - 使用 computed 以支持动态翻译
const shortcuts = computed(() => [
  {
    text: t('aiLogs.lastWeek'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: t('aiLogs.lastMonth'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: t('aiLogs.lastThreeMonths'),
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
]);

/**
 * 处理时间选择器值变化
 */
const handleDateChange = (val: [Date, Date] | null) => {
  console.log('选定的时间范围:', val);
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
  aiRequestRef.value?.getList(taskId.value);
  aiHistoryRef.value?.fetchData(false);
};

const taskId = ref<string>('');
const taskVo = ref<AiTaskVO | undefined>(undefined);
let timer: NodeJS.Timeout | null = null;

onMounted(async () => {
  const shortcutValue = shortcuts.value[0].value() as [Date, Date];
  dateRange.value = shortcutValue;

  const id = route.query.id;
  if (!id) {
    ElMessage.error(t('aiLogs.anomalyWarning'));
    return;
  }
  taskId.value = String(id);

  const res = await getAiTask(String(id));
  taskVo.value = res.data;

  await getList();
  handleLoadChat();

  const loop = () => {
    timer = setTimeout(() => {
      handleLoadChat();
      if (activeName.value === 'request') {
        aiRequestRef.value?.getList(taskId.value);
      } else if (activeName.value === 'log') {
        aiResultref.value?.getList();
      } else if (activeName.value === 'history') {
        aiHistoryRef.value?.fetchData(false);
      }
      loop(); // 下一轮
    }, 1000 * 10);
  };

  loop();
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
});
</script>

<style lang="scss">
.chart-date-picker {
  /* 确保 width 生效并覆盖 Element Plus 默认样式 */
  width: 250px !important;
  max-width: 250px;
}
</style>
