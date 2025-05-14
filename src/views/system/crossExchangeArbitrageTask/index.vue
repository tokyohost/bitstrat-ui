<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item :label="'任务状态'">
              <el-select v-model="queryParams.status" placeholder="请选择任务状态" style="width: 240px" clearable>
                <el-option v-for="item in crossTaskOptions" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
            <el-form-item
              ><span
                ><img src="../../../assets/icons/png/warning.png" height="20" width="20" /> 由于不同交易所盈亏规则、平仓收益、资金费结算 API
                数据不同，平仓后的盈亏可能会不准，仅供参考</span
              >
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="crossExchangeArbitrageTaskList" @selection-change="handleSelectionChange">
        <el-table-column label="套利币对" align="center" prop="symbol" />
        <el-table-column label="做多交易所/做空交易所" align="center" prop="longEx" width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              <ExchangeLogo :exchange="scope.row.longEx" :key="new Date().getMilliseconds()"></ExchangeLogo><el-divider direction="vertical" />
              <ExchangeLogo :exchange="scope.row.shortEx" :key="new Date().getMilliseconds()"></ExchangeLogo>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实时资金费率" align="center" prop="longEx" width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              <FundingRate
                :exchange="scope.row.longEx"
                :symbol="scope.row.symbol"
                :key="new Date()"
                :show-refresh="false"
                show-count-down
              ></FundingRate>
              <el-divider direction="vertical" />
              <FundingRate
                :exchange="scope.row.shortEx"
                :symbol="scope.row.symbol"
                :key="new Date()"
                :show-refresh="false"
                show-count-down
              ></FundingRate>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="计划做多/计划做空" align="center" prop="longSize" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="flex justify-center items-start">
              <span class="flex-1 whitespace-normal break-words text-right">
                {{ trimTrailingZeros(scope.row.longSize) ?? '-' }}
              </span>
              <el-divider direction="vertical" />
              <span class="flex-1 whitespace-normal break-words text-left">
                {{ trimTrailingZeros(scope.row.shortSize) ?? '-' }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="做多持仓/做空持仓" align="center" prop="longSymbolSize" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ trimTrailingZeros(scope.row.longSymbolSize) ?? '-' }}<el-divider direction="vertical" />
              {{ trimTrailingZeros(scope.row.shortSymbolSize) ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="做多成本价/做空成本价" align="center" prop="longAvgPrice" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ roundTo(scope.row.longAvgPrice, 4) ?? '-' }}<el-divider direction="vertical" /> {{ roundTo(scope.row.shortAvgPrice, 4) ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <!--        <el-table-column label="做多出场价/做空出场价" align="center" prop="longOutPrice" :formatter="defaultFormatter" min-width="200">-->
        <!--          <template #default="scope">-->
        <!--            <div class="w-full mx-auto flex justify-center items-center">-->
        <!--              {{ scope.row.longOutPrice ?? '-' }}<el-divider direction="vertical" /> {{ scope.row.shortOutPrice ?? '-' }}-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="做多盈亏/做空盈亏" align="center" prop="longProfit" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center w-100px">
              {{ roundTo(scope.row.longProfit, 4) ?? '-' }}<el-divider direction="vertical" /> {{ roundTo(scope.row.shortProfit, 4) ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="做多资金费/做空资金费" align="center" prop="longProfit" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center w-100px">
              <FundingFeeDisplay :value="scope.row.longFundingFee" :exchange-name="scope.row.longEx" :precision="4"> </FundingFeeDisplay
              ><el-divider direction="vertical" />
              <FundingFeeDisplay :value="scope.row.shortFundingFee" :exchange-name="scope.row.shortEx" :precision="4"></FundingFeeDisplay>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="做多杠杆/做空杠杆" align="center" prop="longLeverage" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.longLeverage ?? '-' }}倍<el-divider direction="vertical" /> {{ scope.row.shortLeverage ?? '-' }}倍
            </div>
          </template>
        </el-table-column>
        <el-table-column label="多仓手续费/空仓手续费" align="center" prop="longInFee" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.longInFee ?? '-' }}<el-divider direction="vertical" /> {{ scope.row.shortInFee ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="做多强平/做空强平" align="center" prop="longInFee" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.longLiqPx ?? '-' }}<el-divider direction="vertical" /> {{ scope.row.shortLiqPx ?? '-' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="总盈亏/年化收益" align="center" prop="totalProfit" :formatter="defaultFormatter" min-width="200">
          <template #default="scope">
            <!--            {{ roundTo(scope.row.totalProfit, 6) ?? '-' }}-->
            <div class="w-full mx-auto flex justify-center items-center">
              {{ roundTo(scope.row.totalProfit, 6) ?? '-' }}<el-divider direction="vertical" /> {{ (roundTo(scope.row.apy, 2) ?? '-') + '%' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="status" min-width="100">
          <template #default="scope">
            <dict-tag :options="cross_exchange_task_status" :value="scope.row.status" :i18n-profilx="'bybit.task.status'" />
          </template>
        </el-table-column>
        <el-table-column label="仓位管理" align="center" prop="status" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              <el-button round type="success" @click="handleCreateOrder(scope.row)" v-hasPermi="['system:crossExchangeArbitrageTask:edit']"
                >加仓</el-button
              >
              <el-button round type="danger" @click="handleClosePosition(scope.row)" v-hasPermi="['system:crossExchangeArbitrageTask:edit']"
                >平仓</el-button
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="300">
          <template #default="scope">
            <!--            <el-button round type="info" @click="handleUpdate(scope.row)" v-hasPermi="['system:crossExchangeArbitrageTask:edit']">修改</el-button>-->
            <el-button round type="warning" @click="handleMonitor(scope.row)" v-hasPermi="['system:crossExchangeArbitrageTask:edit']">监控</el-button>
            <el-button
              round
              type="success"
              @click="handleSyncTask(scope.row)"
              v-if="scope.row.status != 30"
              v-hasPermi="['system:crossExchangeArbitrageTask:edit']"
              >刷新</el-button
            >

            <el-button round type="danger" @click="handleDelete(scope.row)" v-hasPermi="['system:crossExchangeArbitrageTask:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改跨交易所套利任务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="crossExchangeArbitrageTaskFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="id" prop="id">
          <el-input v-model="form.id" placeholder="请输入id" />
        </el-form-item>
        <el-form-item label="做多交易所" prop="longEx">
          <el-input v-model="form.longEx" placeholder="请输入做多交易所" />
        </el-form-item>
        <el-form-item label="做多币对" prop="longSymbol">
          <el-input v-model="form.longSymbol" placeholder="请输入做多币对" />
        </el-form-item>
        <el-form-item label="做多金额 USDT" prop="longSize">
          <el-input v-model="form.longSize" placeholder="请输入做多金额 USDT" />
        </el-form-item>
        <el-form-item label="做多持仓数量" prop="longSymbolSize">
          <el-input v-model="form.longSymbolSize" placeholder="请输入做多持仓数量" />
        </el-form-item>
        <el-form-item label="做多入场价" prop="longAvgPrice">
          <el-input v-model="form.longAvgPrice" placeholder="请输入做多入场价" />
        </el-form-item>
        <el-form-item label="做多出场价" prop="longOutPrice">
          <el-input v-model="form.longOutPrice" placeholder="请输入做多出场价" />
        </el-form-item>
        <el-form-item label="做多盈亏 USDT" prop="longProfit">
          <el-input v-model="form.longProfit" placeholder="请输入做多盈亏 USDT" />
        </el-form-item>
        <el-form-item label="做多入场时间" prop="longInTime">
          <el-date-picker clearable v-model="form.longInTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择做多入场时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="做多杠杆倍数" prop="longLeverage">
          <el-input v-model="form.longLeverage" placeholder="请输入做多杠杆倍数" />
        </el-form-item>
        <el-form-item label="做多开仓手续费" prop="longInFee">
          <el-input v-model="form.longInFee" placeholder="请输入做多开仓手续费" />
        </el-form-item>
        <el-form-item label="做多平仓手续费" prop="longOutFee">
          <el-input v-model="form.longOutFee" placeholder="请输入做多平仓手续费" />
        </el-form-item>
        <el-form-item label="做空交易所" prop="shortEx">
          <el-input v-model="form.shortEx" placeholder="请输入做空交易所" />
        </el-form-item>
        <el-form-item label="做空币对" prop="shortSymbol">
          <el-input v-model="form.shortSymbol" placeholder="请输入做空币对" />
        </el-form-item>
        <el-form-item label="做空金额 USDT" prop="shortSize">
          <el-input v-model="form.shortSize" placeholder="请输入做空金额 USDT" />
        </el-form-item>
        <el-form-item label="做空持仓数量" prop="shortSymbolSize">
          <el-input v-model="form.shortSymbolSize" placeholder="请输入做空持仓数量" />
        </el-form-item>
        <el-form-item label="做空入场价" prop="shortAvgPrice">
          <el-input v-model="form.shortAvgPrice" placeholder="请输入做空入场价" />
        </el-form-item>
        <el-form-item label="做空出场价" prop="shortOutPrice">
          <el-input v-model="form.shortOutPrice" placeholder="请输入做空出场价" />
        </el-form-item>
        <el-form-item label="做空盈亏 USDT" prop="shortProfit">
          <el-input v-model="form.shortProfit" placeholder="请输入做空盈亏 USDT" />
        </el-form-item>
        <el-form-item label="做空入场时间" prop="shortInTime">
          <el-date-picker clearable v-model="form.shortInTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择做空入场时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="做空杠杆倍数" prop="shortLeverage">
          <el-input v-model="form.shortLeverage" placeholder="请输入做空杠杆倍数" />
        </el-form-item>
        <el-form-item label="做空开仓手续费" prop="shortInFee">
          <el-input v-model="form.shortInFee" placeholder="请输入做空开仓手续费" />
        </el-form-item>
        <el-form-item label="做空平仓手续费" prop="shortOutFee">
          <el-input v-model="form.shortOutFee" placeholder="请输入做空平仓手续费" />
        </el-form-item>
        <el-form-item label="执行节点clientId" prop="excuteNodeId">
          <el-input v-model="form.excuteNodeId" placeholder="请输入执行节点clientId" />
        </el-form-item>
        <el-form-item label="总盈亏 USDT" prop="totalProfit">
          <el-input v-model="form.totalProfit" placeholder="请输入总盈亏 USDT" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="任务开始时间戳" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入任务开始时间戳" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <CrossExchangeOrder
      :data="taskRole?.argitrageData"
      :task="cdata"
      :task-id="cdata?.id"
      :title="'创建订单'"
      v-model:visible="showOrder"
    ></CrossExchangeOrder>
    <CrossExchangeSell
      :data="taskRole?.argitrageData"
      :curr-data="cdata"
      :task-id="cdata?.id"
      :title="'平仓下单'"
      v-model:visible="showSell"
    ></CrossExchangeSell>
    <ArbitrageWarningDialog
      ref="arbitrageWarningDialogRef"
      v-model:visible="showMonitor"
      :task-id="cdata?.id"
      :arbitrage-type="0"
    ></ArbitrageWarningDialog>
    <!--    <ArbitrageWarningDialog v-model:visible="showMonitor" @submit="handleSubmitWarning" />-->
  </div>
</template>

<script setup lang="ts">
import {
  listCrossExchangeArbitrageTask,
  getCrossExchangeArbitrageTask,
  delCrossExchangeArbitrageTask,
  addCrossExchangeArbitrageTask,
  updateCrossExchangeArbitrageTask,
  syncTask
} from '@/api/system/crossExchangeArbitrageTask';
import {
  CrossExchangeArbitrageTaskVO,
  CrossExchangeArbitrageTaskQuery,
  CrossExchangeArbitrageTaskForm
} from '@/api/system/crossExchangeArbitrageTask/types';
import StrategyCard from '@/views/system/crossExchangeArbitrageTask/components/StrategyCard.vue';
import { parseTime } from '../../../utils/ruoyi';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { defaultFormatter, roundTo, trimTrailingZeros } from '@/api/tool/utils';
import FundingRate from '@/views/system/analysis/components/FundingRate.vue';
import { CreateArbitrageTaskVo } from '@/views/system/crossExchangeArbitrageTask/components/type';
import CrossExchangeOrder from '@/views/system/crossExchangeArbitrageTask/components/CrossExchangeOrder.vue';
import CrossExchangeSell from '@/views/system/crossExchangeArbitrageTask/components/CrossExchangeSell.vue';
import { crossTaskOptions } from '@/constants/CrossTask-options';
import FundingFeeDisplay from '@/views/system/crossExchangeArbitrageTask/components/FundingFeeDisplay.vue';
import ArbitrageWarningDialog from '@/views/system/arbitrageWarningConfig/components/ArbitrageWarningDialog.vue';

const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const crossExchangeArbitrageTaskList = ref<CrossExchangeArbitrageTaskVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const showOrder = ref(false);
const showSell = ref(false);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const { cross_exchange_task_status } = toRefs<any>(proxy?.useDict('cross_exchange_task_status'));
const cdata = ref<CrossExchangeArbitrageTaskVO>();
const taskRole = ref<CreateArbitrageTaskVo>();
const crossExchangeArbitrageTaskFormRef = ref<ElFormInstance>();
const showMonitor = ref(false);
const arbitrageWarningDialogRef = ref();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CrossExchangeArbitrageTaskForm = {
  id: undefined,
  longEx: undefined,
  longSymbol: undefined,
  longSize: undefined,
  longSymbolSize: undefined,
  longAvgPrice: undefined,
  longOutPrice: undefined,
  longProfit: undefined,
  longInTime: undefined,
  longLeverage: undefined,
  longInFee: undefined,
  longOutFee: undefined,
  shortEx: undefined,
  shortSymbol: undefined,
  shortSize: undefined,
  shortSymbolSize: undefined,
  shortAvgPrice: undefined,
  shortOutPrice: undefined,
  shortProfit: undefined,
  shortInTime: undefined,
  shortLeverage: undefined,
  shortInFee: undefined,
  shortOutFee: undefined,
  excuteNodeId: undefined,
  totalProfit: undefined,
  status: undefined,
  userId: undefined,
  startTime: undefined
};
const data = reactive<PageData<CrossExchangeArbitrageTaskForm, CrossExchangeArbitrageTaskQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: undefined,
    params: {}
  },
  rules: {}
});

const { queryParams, form, rules } = toRefs(data);

/** 查询跨交易所套利任务列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.orderByColumn = 'create_time';
  queryParams.value.isAsc = 'desc';
  const res = await listCrossExchangeArbitrageTask(queryParams.value);
  crossExchangeArbitrageTaskList.value = res.rows;
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
  crossExchangeArbitrageTaskFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CrossExchangeArbitrageTaskVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加跨交易所套利任务';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: CrossExchangeArbitrageTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCrossExchangeArbitrageTask(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改跨交易所套利任务';
};
/** 加仓操作 */
const handleCreateOrder = async (row?: CrossExchangeArbitrageTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCrossExchangeArbitrageTask(_id);
  cdata.value = res.data;
  // const taskRole = JSON.parse(cdata.value.role);
  taskRole.value = JSON.parse(cdata.value.role);
  showOrder.value = true;
};
/**
 * 平仓
 * @param row
 */
const handleClosePosition = async (row?: CrossExchangeArbitrageTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCrossExchangeArbitrageTask(_id);
  cdata.value = res.data;
  // const taskRole = JSON.parse(cdata.value.role);
  taskRole.value = JSON.parse(cdata.value.role);
  showSell.value = true;
};

/** 提交按钮 */
const submitForm = () => {
  crossExchangeArbitrageTaskFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCrossExchangeArbitrageTask(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addCrossExchangeArbitrageTask(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 监控按钮操作 */
const handleMonitor = async (row?: CrossExchangeArbitrageTaskVO) => {
  showMonitor.value = true; // 打开窗口
  arbitrageWarningDialogRef.value.fetchWarningConfig(1, row.id); // 调用 fetchWarningConfig 方法
};

const handleSyncTask = async (row?: CrossExchangeArbitrageTaskVO) => {
  // ElMessage.info('正在开发中，敬请期待...');
  loading.value = true;
  const response = await syncTask(row.id);
  ElMessage.success('同步成功');
  loading.value = false;
  await getList();
};
const handleDelete = async (row?: CrossExchangeArbitrageTaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除跨交易所套利任务"' + row.symbol + '"？').finally(() => (loading.value = false));
  await delCrossExchangeArbitrageTask(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/crossExchangeArbitrageTask/export',
    {
      ...queryParams.value
    },
    `crossExchangeArbitrageTask_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
watch(
  () => route.query.refersh,
  (newVal, oldVal) => {
    // if (newVal === 'true') {
    getList();
    // }
  }
);
onActivated(() => {
  console.log('页面重新激活了（从缓存中恢复）');
  getList();
  // 可以在这里重新请求数据或处理其他逻辑
});

const handleSubmitWarning = (form) => {
  // 处理提交逻辑
  console.log('Submitted form:', form);
};
</script>
<style scoped>
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
