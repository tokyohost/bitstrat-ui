<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="订单id" prop="orderId">
              <el-input v-model="queryParams.orderId" placeholder="请输入订单id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="交易所" prop="ex">
              <el-input v-model="queryParams.ex" placeholder="请输入交易所名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
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
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:order:add']">新增</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:order:edit']">修改</el-button>-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:order:remove']"-->
          <!--              >删除</el-button-->
          <!--            >-->
          <!--          </el-col>-->
          <!--          <el-col :span="1.5">-->
          <!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:order:export']">导出</el-button>-->
          <!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!--        <el-table-column label="任务id" align="center" prop="taskId" />-->
        <el-table-column label="订单id" align="center" prop="orderId" />
        <el-table-column label="方向/开平仓" align="center" prop="side">
          <template #default="scope">
            <div class="flex justify-center">
              <dict-tag :options="order_side" :value="scope.row.side" :i18n-profilx="'bybit.task.status'" />
              <el-divider direction="vertical" />
              <dict-tag :options="order_close_position_status" :value="scope.row.closePositionOrder" :i18n-profilx="'bybit.task.status'" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="挂单类型" align="center" prop="orderType">
          <template #default="scope">
            <div class="flex justify-center">
              <dict-tag :options="order_type" :value="scope.row.orderType" :i18n-profilx="'bybit.task.status'" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交易所" align="center" prop="ex">
          <template #default="scope">
            <div class="flex justify-center">
              <ExchangeLogo :exchange="scope.row.ex"></ExchangeLogo>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="币对" align="center" prop="symbol" />
        <el-table-column label="下单价格" align="center" prop="price">
          <template #default="scope">
            {{ trimTrailingZeros(scope.row.price) ?? '-' }}
          </template>
        </el-table-column>
        <el-table-column label="市价" align="center" prop="marketPrice" />
        <el-table-column label="已成交/总数量" align="center" prop="size">
          <template #default="scope">
            <div class="flex justify-center items-start">
              <span class="flex-1 whitespace-normal break-words text-right">
                {{ trimTrailingZeros(scope.row.cumExecQty) ?? '-' }}
              </span>
              <el-divider direction="vertical" />
              <span class="flex-1 whitespace-normal break-words text-left">
                {{ trimTrailingZeros(scope.row.size) ?? '-' }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平均成交价" align="center" prop="avgPrice" />
        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="contract_order_status" :value="scope.row.status" :i18n-profilx="'bybit.task.status'" />
          </template>
        </el-table-column>

        <el-table-column label="手续费" align="center" prop="fee" min-width="120" />
        <el-table-column label="批次" align="center" prop="batchCount">
          <template #default="scope"> {{ scope.row.batchCount ?? '-' }}/{{ scope.row.batchTotal ?? '-' }} </template>
        </el-table-column>
        <el-table-column label="下单时间" align="center" prop="createTime" min-width="220" />

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" min-width="200">
          <template #default="scope">
            <div class="">
              <el-button
                round
                type="info"
                @click="handleAmendOrder(scope.row)"
                v-hasPermi="['system:order:edit']"
                v-if="!checkCanCancelOrder(scope.row)"
                >改价</el-button
              >
              <el-button
                round
                type="warning"
                @click="handleCancel(scope.row)"
                v-hasPermi="['system:order:edit']"
                v-if="!checkCanCancelOrder(scope.row)"
                >撤单</el-button
              >
              <el-button
                round
                type="warning"
                @click="handleSwitchMarket(scope.row)"
                v-hasPermi="['system:order:edit']"
                v-if="!checkCanCancelOrder(scope.row)"
                >转市价</el-button
              >

              <el-button round type="danger" @click="handleDelete(scope.row)" v-hasPermi="['system:order:remove']">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改订单列表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="orderFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="任务id" prop="taskId">
          <el-input v-model="form.taskId" placeholder="请输入任务id" />
        </el-form-item>
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="交易所名称" prop="ex">
          <el-input v-model="form.ex" placeholder="请输入交易所名称" />
        </el-form-item>
        <el-form-item label="币对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币对" />
        </el-form-item>
        <el-form-item label="数量" prop="size">
          <el-input v-model="form.size" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="平均价格" prop="avgPrice">
          <el-input v-model="form.avgPrice" placeholder="请输入平均价格" />
        </el-form-item>
        <el-form-item label="下单价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入下单价格" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <PriceSelectorDialog v-model.sync="showamendOrder" title="改价" :order-id="optItem?.id" @confirm="doAmendOrder"></PriceSelectorDialog>
  </div>
</template>

<script setup name="Order" lang="ts">
import { listOrder, getOrder, delOrder, addOrder, updateOrder, updatePrice } from '@/api/system/order';
import { OrderVO, OrderQuery, OrderForm } from '@/api/system/order/types';
import { checkCanCancelOrder, trimTrailingZeros } from '@/api/tool/utils';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import PriceSelectorDialog from '@/views/system/order/components/PriceSelectorDialog.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { contract_order_status } = toRefs<any>(proxy?.useDict('contract_order_status'));
const { order_side } = toRefs<any>(proxy?.useDict('order_side'));
const { order_close_position_status } = toRefs<any>(proxy?.useDict('order_close_position_status'));
const { order_type } = toRefs<any>(proxy?.useDict('order_type'));

const orderList = ref<OrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const showamendOrder = ref(false);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const orderFormRef = ref<ElFormInstance>();
const optItem = ref<OrderVO>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: OrderForm = {
  id: undefined,
  taskId: undefined,
  orderId: undefined,
  ex: undefined,
  symbol: undefined,
  size: undefined,
  status: undefined,
  fee: undefined,
  avgPrice: undefined,
  price: undefined
};
const data = reactive<PageData<OrderForm, OrderQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskId: undefined,
    orderId: undefined,
    ex: undefined,
    symbol: undefined,
    size: undefined,
    status: undefined,
    fee: undefined,
    avgPrice: undefined,
    price: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询订单列表列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.orderByColumn = 'create_time';
  queryParams.value.isAsc = 'desc';

  const res = await listOrder(queryParams.value);
  orderList.value = res.rows;
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
  orderFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: OrderVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加订单列表';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: OrderVO) => {
  reset();
  ElMessage.info('正在适配中，敬请期待');
};

/** 修改按钮操作 */
const handleCancel = async (row?: OrderVO) => {
  reset();
  ElMessage.info('正在适配中，敬请期待');
};
/** 改价 */
const handleAmendOrder = async (row?: OrderVO) => {
  reset();
  optItem.value = row;
  showamendOrder.value = true;
};
const doAmendOrder = async ({ isMarket, price, orderId }: { isMarket: boolean; price?: string; orderId?: string | number }) => {
  const data = {
    price: price,
    id: orderId,
    marketPriceAmend: isMarket ? 1 : 0
  };
  if (isMarket) {
    console.log('使用市价下单', orderId);
    data.marketPriceAmend = 1;
    await updatePrice(data);
    ElMessage.success('改价成功');
  } else {
    console.log('限价下单，价格为：', price, orderId);
    data.marketPriceAmend = 0;
    data.price = price;
    await updatePrice(data);
    ElMessage.success('改价成功');
  }
  await getList();
  showamendOrder.value = false;
};
/** 切换市价 */
const handleSwitchMarket = async (row?: OrderVO) => {
  reset();

  ElMessage.info('正在适配中，敬请期待');
};

/** 提交按钮 */
const submitForm = () => {
  orderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateOrder(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addOrder(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: OrderVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除订单列表编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delOrder(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/order/export',
    {
      ...queryParams.value
    },
    `order_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
onActivated(() => {
  console.log('页面重新激活了（从缓存中恢复）');
  getList();
  // 可以在这里重新请求数据或处理其他逻辑
});
</script>
