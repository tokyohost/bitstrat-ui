<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="币对" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币对" clearable @keyup.enter="handleQuery" />
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
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="batchList" @selection-change="handleSelectionChange">
        <!--        <el-table-column type="selection" width="55" align="center" />-->
        <el-table-column label="币对" align="center" prop="symbol" />
        <el-table-column label="卖出/买入" align="center" prop="buyEx" min-width="200">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.sellEx ?? '-' }}
              <el-divider direction="vertical" />
              {{ scope.row.buyEx ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="挂单类型" align="center" prop="sellOrderType">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.sellOrderType }}
              <el-divider direction="vertical" />
              {{ scope.row.buyOrderType }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="杠杆倍数" align="center" prop="sellOrderType" min-width="130">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ scope.row.sellLeverage }}
              <el-divider direction="vertical" />
              {{ scope.row.buyLeverage }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="side">
          <template #default="scope">
            <dict-tag :options="batch_order_type" :value="scope.row.side" :i18n-profilx="'bybit.task.status'" />
          </template>
        </el-table-column>
        <el-table-column label="买入总数量/已完成" align="center" prop="buyTotal" min-width="180">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ trimTrailingZeros(roundTo(scope.row.buyTotal, 4)) ?? '-' }}
              <el-divider direction="vertical" />
              {{ trimTrailingZeros(roundTo(scope.row.doneBuySize, 4)) ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="卖出总数量/已完成" align="center" prop="buyTotal" min-width="180">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ trimTrailingZeros(roundTo(scope.row.sellTotal, 4)) ?? '-' }}
              <el-divider direction="vertical" />
              {{ trimTrailingZeros(roundTo(scope.row.doneSellSize, 4)) ?? '-' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="分批总数/已完成" align="center" prop="batchTotal" min-width="130">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ trimTrailingZeros(roundTo(scope.row.batchTotal, 4)) ?? '-' }}
              <el-divider direction="vertical" />
              {{ trimTrailingZeros(roundTo(scope.row.doneBatch, 4)) ?? '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="已完成数量" align="center" prop="doneSize">
          <template #default="scope">
            {{ trimTrailingZeros(roundTo(scope.row.doneSize, 4)) ?? '-' }}
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="batch_order_status" :value="scope.row.status" :i18n-profilx="'bybit.task.status'" />
          </template>
        </el-table-column>

        <el-table-column label="异常信息" align="center" prop="msg">
          <template #default="scope">
            <ErrorMsgViewer :msg="scope.row.msg" v-if="scope.row.status == 20" />
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="开始时间/完成时间" align="center" prop="startTime" min-width="180">
          <template #default="scope">
            <div class="w-full mx-auto flex justify-center items-center">
              {{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
              <el-divider direction="vertical" />
              {{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="单笔比例" align="center" prop="batchSize" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
          <template #default="scope">
            <!--            <el-tooltip content="修改" placement="top">-->
            <!--              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:batch:edit']"></el-button>-->
            <!--            </el-tooltip>-->
            <el-tooltip content="停止" placement="top" v-if="scope.row.status == 10">
              <el-button link type="primary" icon="RemoveFilled" @click="handleStop(scope.row)" v-hasPermi="['system:batch:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:batch:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改分批订单任务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="batchFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务id" />
        </el-form-item>
        <el-form-item label="买入交易所" prop="buyEx">
          <el-input v-model="form.buyEx" placeholder="请输入买入交易所" />
        </el-form-item>
        <el-form-item label="买入总数量" prop="buyTotal">
          <el-input v-model="form.buyTotal" placeholder="请输入买入总数量" />
        </el-form-item>
        <el-form-item label="卖出交易所" prop="sellEx">
          <el-input v-model="form.sellEx" placeholder="请输入卖出交易所" />
        </el-form-item>
        <el-form-item label="卖出总数量" prop="sellTotal">
          <el-input v-model="form.sellTotal" placeholder="请输入卖出总数量" />
        </el-form-item>
        <el-form-item label="总批次数量" prop="totalSize">
          <el-input v-model="form.totalSize" placeholder="请输入总批次数量" />
        </el-form-item>
        <el-form-item label="总批次" prop="batchTotal">
          <el-input v-model="form.batchTotal" placeholder="请输入总批次" />
        </el-form-item>
        <el-form-item label="已完成批次" prop="doneBatch">
          <el-input v-model="form.doneBatch" placeholder="请输入已完成批次" />
        </el-form-item>
        <el-form-item label="已完成数量" prop="doneSize">
          <el-input v-model="form.doneSize" placeholder="请输入已完成数量" />
        </el-form-item>
        <el-form-item label="异常信息" prop="msg">
          <el-input v-model="form.msg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="操作类型，1-加仓，2-平仓" prop="side">
          <el-input v-model="form.side" placeholder="请输入操作类型，1-加仓，2-平仓" />
        </el-form-item>
        <el-form-item label="每批次操作比例" prop="batchSize">
          <el-input v-model="form.batchSize" placeholder="请输入每批次操作比例" />
        </el-form-item>
        <el-form-item label="已完成卖单总数" prop="doneSellSize">
          <el-input v-model="form.doneSellSize" placeholder="请输入已完成卖单总数" />
        </el-form-item>
        <el-form-item label="已完成买单总数" prop="doneBuySize">
          <el-input v-model="form.doneBuySize" placeholder="请输入已完成买单总数" />
        </el-form-item>
        <el-form-item label="卖出杠杆倍数" prop="sellLeverage">
          <el-input v-model="form.sellLeverage" placeholder="请输入卖出杠杆倍数" />
        </el-form-item>
        <el-form-item label="买入杠杆倍数" prop="buyLeverage">
          <el-input v-model="form.buyLeverage" placeholder="请输入买入杠杆倍数" />
        </el-form-item>
        <el-form-item label="币对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币对" />
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

<script setup name="Batch" lang="ts">
import { listBatch, getBatch, delBatch, addBatch, updateBatch, stopBatch } from '@/api/system/batch';
import { BatchVO, BatchQuery, BatchForm } from '@/api/system/batch/types';
import { roundTo, trimTrailingZeros } from '@/api/tool/utils';
import ErrorMsgViewer from '@/views/system/batch/components/ErrorMsgViewer.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { batch_order_status } = toRefs<any>(proxy?.useDict('batch_order_status'));
const { batch_order_type } = toRefs<any>(proxy?.useDict('batch_order_type'));
const batchList = ref<BatchVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const batchFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BatchForm = {
  id: undefined,
  taskId: undefined,
  buyEx: undefined,
  buyTotal: undefined,
  sellEx: undefined,
  sellTotal: undefined,
  totalSize: undefined,
  batchTotal: undefined,
  doneBatch: undefined,
  doneSize: undefined,
  status: undefined,
  msg: undefined,
  startTime: undefined,
  endTime: undefined,
  userId: undefined,
  side: undefined,
  batchSize: undefined,
  doneSellSize: undefined,
  doneBuySize: undefined,
  sellOrderType: undefined,
  buyOrderType: undefined,
  sellLeverage: undefined,
  buyLeverage: undefined,
  symbol: undefined
};
const data = reactive<PageData<BatchForm, BatchQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskId: undefined,
    buyEx: undefined,
    buyTotal: undefined,
    sellEx: undefined,
    sellTotal: undefined,
    totalSize: undefined,
    batchTotal: undefined,
    doneBatch: undefined,
    doneSize: undefined,
    status: undefined,
    msg: undefined,
    startTime: undefined,
    endTime: undefined,
    userId: undefined,
    side: undefined,
    batchSize: undefined,
    doneSellSize: undefined,
    doneBuySize: undefined,
    sellOrderType: undefined,
    buyOrderType: undefined,
    sellLeverage: undefined,
    buyLeverage: undefined,
    symbol: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    userId: [{ required: true, message: '用户id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询分批订单任务列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.orderByColumn = 'create_time';
  queryParams.value.isAsc = 'desc';
  const res = await listBatch(queryParams.value);
  batchList.value = res.rows;
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
  batchFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BatchVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加分批订单任务';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: BatchVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBatch(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改分批订单任务';
};

/** 提交按钮 */
const submitForm = () => {
  batchFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBatch(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBatch(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: BatchVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除分批订单任务编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delBatch(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};
/** 删除按钮操作 */
const handleStop = async (row?: BatchVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认停止任务？').finally(() => (loading.value = false));
  await stopBatch(row.id);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/batch/export',
    {
      ...queryParams.value
    },
    `batch_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
