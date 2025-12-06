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
      <template #header>
        <div class="flex flex-col md:flex-row justify-end items-end md:items-center gap-3">
          <span class="text-sm font-medium text-gray-700">选择查询周期:</span>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="default"
            :shortcuts="shortcuts"
            class="chart-date-picker"
            @change="handleDateChange"
          />
          <el-button type="primary" size="default" @click="handleQuery">查询</el-button>
        </div>
      </template>
      <div class="flex flex-col md:flex-row gap-2">
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
      </div>
    </el-card>
    <el-card shadow="never" title="实时持仓" class="mt-2">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <div>实时持仓</div>
          <right-toolbar :search="false" @queryTable="refshPosition"></right-toolbar>
        </el-row>
      </template>
      <PositionWidget ref="positionWidget" :accountId="taskVo?.apiId"></PositionWidget>
    </el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="请求日志" name="request">
        <TestAiRequest :task-id="taskId" ref="aiRequestRef"></TestAiRequest>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <TestAiResult ref="aiResultref"></TestAiResult>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="AiLogs" lang="ts">
import { listAiLogs, getAiLogs, delAiLogs, addAiLogs, updateAiLogs, loadChartData, loadChartDataFreeBalance } from '@/api/system/aiLogs';
import { AiLogsVO, AiLogsQuery, AiLogsForm } from '@/api/system/aiLogs/types';
import LineChart from '@/views/system/aiTaskLogs/LineChart.vue';
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
/**
 * 辅助函数：将 Date 对象格式化为 YYYY-MM-DD 字符串
 */
const formatDateToYYYYMMDD = (date: Date): string => {
  // 确保日期不因时区偏移而改变
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
/** 搜索按钮操作 */
const handleQuery = () => {
  // 1. 检查日期范围是否有效
  if (!dateRange.value || dateRange.value.length !== 2) {
    proxy?.$modal.msgWarning('请选择有效的时间范围进行查询。');
    return;
  }

  const [rawStartDate, rawEndDate] = dateRange.value;

  // --- 核心国际化时间处理 ---

  // 1. 调整开始日期：确保从当天的 00:00:00 开始
  //    注意：为了消除本地时区的影响，我们通常使用 Date.UTC() 或直接操作 UTC 属性。
  const start = new Date(rawStartDate.getFullYear(), rawStartDate.getMonth(), rawStartDate.getDate(), 0, 0, 0);
  // 转换为 ISO 8601 格式的 UTC 字符串 (e.g., 2025-01-01T00:00:00.000Z)
  const startDateISO = start.toISOString();

  // 2. 调整结束日期：确保到当天的 23:59:59 结束
  //    使用 23:59:59.999 或直接将日期设置为下一天的 00:00:00 来实现 "to the end of day" 的查询
  const end = new Date(rawEndDate.getFullYear(), rawEndDate.getMonth(), rawEndDate.getDate(), 23, 59, 59, 999);
  // 转换为 ISO 8601 格式的 UTC 字符串 (e.g., 2025-01-03T23:59:59.999Z)
  const endDateISO = end.toISOString();

  // --- 设置查询参数 ---

  queryParams.value.pageNum = 1;
  // 将完整的 ISO 字符串作为 Date 参数传递给后端
  queryParams.value.startDate = startDateISO;
  queryParams.value.endDate = endDateISO;
  handleLoadChat();
};
const handleLoadChat = () => {
  console.log('handleLoadChat');
  getChat();
  getChatFreeBalance();
};
// --- 时间选择逻辑 ---
const dateRange = ref<[Date, Date] | null>(null);

// 快捷选项配置
const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: '近三月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

/**
 * 处理时间选择器值变化
 */
const handleDateChange = (val: [Date, Date] | null) => {
  // 可以在这里进行一些即时的数据验证或格式化
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
  aiRequestRef.value.getList(taskId.value);
  aiResultref.value.getList(taskId.value);
};
const taskId = ref<string>(undefined);
const taskVo = ref<AiTaskVO>(undefined);
let timer: any = null;

onMounted(async () => {
  dateRange.value = shortcuts[0].value();
  const id = useRoute().query.id;
  if (!id) {
    ElMessage.error('参数异常！');
    return;
  }
  taskId.value = id as string;

  const res = await getAiTask(id as string);
  taskVo.value = res.data;

  await getList();
  handleLoadChat();

  const loop = () => {
    timer = setTimeout(() => {
      handleLoadChat();
      if (activeName.value == 'request') {
        aiRequestRef.value.getList(taskId.value);
      } else {
        aiResultref.value.getList(taskId.value);
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
