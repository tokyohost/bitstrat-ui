<template>
  <div style="margin:0px 10px 0px 10px">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="滑点触发" name="first"><div class="p-2">
        <transition :enter-active-class="proxy?.animate.searchAnimate.enter"
                    :leave-active-class="proxy?.animate.searchAnimate.leave">
          <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="交易所名称" prop="exchangeName">
                  <el-input v-model="queryParams.exchangeName" placeholder="请输入交易所名称" clearable
                            @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="币种" prop="symbol">
                  <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="价格" prop="price">
                  <el-input v-model="queryParams.price" placeholder="请输入价格" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="回撤率" prop="retread">
                  <el-input v-model="queryParams.retread" placeholder="请输入回撤率" clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="下单数量" prop="quantity">
                  <el-input v-model="queryParams.quantity" placeholder="请输入下单数量" clearable
                            @keyup.enter="handleQuery" />
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
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:lossPoint:add']">新增
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()"
                           v-hasPermi="['system:lossPoint:edit']"
                >修改
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()"
                           v-hasPermi="['system:lossPoint:remove']"
                >删除
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Edit" @click="handleSetLeverageBody()"
                           v-hasPermi="['system:lossPoint:edit']"
                >设置杠杆倍数
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="RefreshLeft" @click="syncAll()" v-hasPermi="['system:lossPoint:edit']"
                >全量同步
                </el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" @click="syncDeleteAll()" v-hasPermi="['system:lossPoint:edit']"
                >全部移除
                </el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
          </template>

          <el-table v-loading="loading" :data="lossPointList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="交易所名称" align="center" prop="exchangeName" />
            <el-table-column label="币种" align="center" prop="symbol" />
            <el-table-column label="价格" align="center" prop="price" />
            <el-table-column label="下单±" align="center" prop="triggerPrice1" />
            <!--        <el-table-column label="触发价2" align="center" prop="triggerPrice2" />-->
            <el-table-column label="回撤率" align="center" prop="retread" />
            <el-table-column label="下单数量" align="center" prop="quantity" />
            <el-table-column label="启用" align="center" prop="enable">
              <template #default="scope">
                <el-switch v-model="scope.row.enable" :active-value="2" :inactive-value="1"
                           @change="changeEnable(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="loss_point_status" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="节点名称" align="center" prop="nodeName">
              <template #default="scope">
                {{ scope.row.nodeName ? scope.row.nodeName : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                             v-hasPermi="['system:lossPoint:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                             v-hasPermi="['system:lossPoint:remove']"></el-button>
                </el-tooltip>
                <el-tooltip content="同步" placement="top">
                  <el-button link type="primary" icon="RefreshLeft" @click="handleSync(scope.row)"
                             v-hasPermi="['system:lossPoint:edit']"></el-button>
                </el-tooltip>
                <el-tooltip content="从节点移除" placement="top">
                  <el-button link type="primary" icon="RemoveFilled" @click="handleStop(scope.row)"
                             v-hasPermi="['system:lossPoint:edit']"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                      v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
        <!-- 添加或修改滑点管理对话框 -->
        <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
          <el-form ref="lossPointFormRef" :model="form" :rules="rules" label-width="80px" :label-position="'top'">
            <el-form-item :label="'交易所'" prop="exchangeName">
              <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
              <el-select v-model="form.exchangeName" :placeholder="'请选择交易所'" :filterable="true">
                <el-option :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="proxy.$t('bybit.task.form.symbol')" prop="symbol">
              <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
              <el-select v-model="form.symbol" :placeholder="proxy.$t('bybit.task.placeholder.symbol')" :filterable="true">
                <el-option :label="item.symbol" :value="item.symbol" v-for="item in symbolList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="'任务节点'" prop="nodeClientId">
              <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
              <el-select v-model="form.nodeClientId" :placeholder="'请选择执行的节点'" :filterable="true">
                <!--            <el-option :label="item.clientId" :value="item.clientId" v-for="item in nodeList"></el-option>-->
                <el-option v-for="item in nodeList" :key="item.clientId" :label="`${item.clientId}`" :value="item.clientId">
              <span style="display: flex; justify-content: space-between">
                <span>{{ item.exchangeName }}</span>
                <span style="color: #999"
                >{{ item.clientId }} <span style="color: green">({{ item.delay }}ms)</span></span
                >
              </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input v-model="form.price" placeholder="请输入价格" />
            </el-form-item>
            <el-form-item label="下单+-(触发下单价格正负多少)" prop="triggerPrice1">
              <el-input v-model="form.triggerPrice1" placeholder="请输入下单+-" />
            </el-form-item>

            <el-form-item label="回撤率(持仓价 + (当前价格 - 持仓价) * (1-回撤率))" prop="retread">
              <el-input v-model="form.retread" placeholder="请输入回撤率" />
            </el-form-item>
            <el-form-item label="开仓止损比例(持仓价 - 持仓价 * 开仓止损比例 )" prop="triggerPrice2">
              <el-input v-model="form.triggerPrice2" placeholder="请输入开仓止损比例" />
            </el-form-item>
            <el-form-item label="下单数量" prop="quantity">
              <el-input v-model="form.quantity" placeholder="请输入下单数量" />
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>

        <el-dialog :title="setLeverageDialog.title" v-model="setLeverageDialog.visible" width="500px" append-to-body>
          <el-form ref="leverageFormRef" :model="leverageForm" :rules="leverageRole" label-width="80px"
                   :label-position="'top'">
            <el-form-item :label="proxy.$t('bybit.task.form.symbol')" prop="symbol">
              <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
              <el-select v-model="leverageForm.symbol" :placeholder="proxy.$t('bybit.task.placeholder.symbol')"
                         :filterable="true">
                <el-option :label="item.symbol" :value="item.symbol" v-for="item in symbolList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="做多倍数" prop="buyLeverage">
              <el-input v-model="leverageForm.buyLeverage" placeholder="请输入做多倍数" :min="1" :max="500" :step="1" />
            </el-form-item>
            <el-form-item label="做空倍数" prop="sellLeverage">
              <el-input v-model="leverageForm.sellLeverage" placeholder="请输入做空倍数" :min="1" :max="500" :step="1" />
            </el-form-item>
          </el-form>


          <template #footer>
            <div class="dialog-footer">
              <el-button :loading="buttonLoading" type="primary" @click="submitSetLeverage">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>
      </div></el-tab-pane>
      <el-tab-pane label="节点管理" name="second"><servicePanel></servicePanel></el-tab-pane>
    </el-tabs>
  </div>

</template>

<script setup name="LossPoint" lang="ts">
import {
  listLossPoint,
  getLossPoint,
  delLossPoint,
  addLossPoint,
  updateLossPoint,
  syncLossPoint,
  stopLossPoint,
  enableLossPoint, syncAllLossPoint, syncDeleteAllLossPoint
} from '@/api/system/lossPoint';
import { LossPointVO, LossPointQuery, LossPointForm } from '@/api/system/lossPoint/types';
import { DeviceInfo, ExchangeData, ExchangeVo, SetLeverageBody, SyncLossPoint } from '@/api/system/common/types';
import {
  getSupportExchange,
  listBybitSupportSymbols,
  queryExchangeStatus,
  queryNodeStatus,
  setLeverageBody
} from '@/api/system/common/common';
import { SymbolVO } from '@/api/system/task/types';
import servicePanel  from '@/views/system/lossPoint/servicePanel.vue';
import { TabsPaneContext } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { loss_point_status } = toRefs<any>(proxy?.useDict('loss_point_status'));

const lossPointList = ref<LossPointVO[]>([]);
const supportExchangeList = ref<ExchangeVo[]>([]);
const nodeList = ref<ExchangeData[]>([]);
const symbolList = ref<SymbolVO[]>([]);
const buttonLoading = ref(false);
const enableLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const lossPointFormRef = ref<ElFormInstance>();
const leverageFormRef = ref<ElFormInstance>();


const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const setLeverageDialog = reactive<DialogOption>({
  visible: false,
  title: '设置杠杆倍率'
});
const leverageForm = reactive<SetLeverageBody>({});
const leverageRole = {
  id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
  symbol: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
  buyLeverage: [{ required: true, message: '做多倍数不能为空', trigger: 'blur' }],
  sellLeverage: [{ required: true, message: '做空倍数不能为空', trigger: 'blur' }]
};


const initFormData: LossPointForm = {
  id: undefined,
  exchangeName: undefined,
  symbol: undefined,
  triggerPrice2: undefined,
  triggerPrice1: undefined,
  price: undefined,
  retread: undefined,
  nodeClientId: undefined,
  quantity: undefined
};
const data = reactive<PageData<LossPointForm, LossPointQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    exchangeName: undefined,
    symbol: undefined,
    price: undefined,
    retread: undefined,
    quantity: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    exchangeName: [{ required: true, message: '交易所不能为空', trigger: 'blur' }],
    symbol: [{ required: true, message: '币种不能为空', trigger: 'blur' }],
    price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
    retread: [{ required: true, message: '回撤率不能为空', trigger: 'blur' }],
    quantity: [{ required: true, message: '下单数量不能为空', trigger: 'blur' }],
    triggerPrice1: [{ required: true, message: '下单±区间不能为空', trigger: 'blur' }],
    triggerPrice2: [{ required: true, message: '开仓止损比例不能为空', trigger: 'blur' }],
    nodeClientId: [{ required: true, message: '执行节点不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const loadSymbol = async () => {
  loading.value = true;
  const res = await listBybitSupportSymbols({});
  console.log(res);
  if (res.code == 200) {
    symbolList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
  loading.value = false;
};

/** 查询滑点管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listLossPoint(queryParams.value);
  lossPointList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  setLeverageDialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  lossPointFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

const loadExchange = async () => {
  loading.value = true;
  const res = await getSupportExchange();
  console.log(res);
  if (res.code == 200) {
    supportExchangeList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
  loading.value = false;
};
const loadNode = async () => {
  loading.value = true;
  const res = await queryExchangeStatus();
  console.log(res);
  if (res.code == 0) {
    nodeList.value = res.data;
  } else {
    const msg = res.msg;
    ElMessage.error(msg);
  }
  loading.value = false;
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: LossPointVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};


const changeEnable = async (row: LossPointVO) => {
  const oldStatus = row.enable;
  console.log('oldStatus ' + oldStatus);
  loading.value = true;
  await enableLossPoint({ lossPointId: row.id, enable: oldStatus });
  loading.value = false;
  await getList();


};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加滑点管理';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: LossPointVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getLossPoint(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改滑点管理';
};

/** 提交按钮 */
const submitForm = () => {
  lossPointFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateLossPoint(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addLossPoint(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};
const submitSetLeverage = () => {
  leverageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;

      await setLeverageBody(leverageForm);

      proxy?.$modal.msgSuccess('操作成功');
      setLeverageDialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: LossPointVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除滑点管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delLossPoint(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};
const handleSync = async (row?: LossPointVO) => {
  const data: SyncLossPoint = {
    lossPointId: row.id,
    clientId: row.nodeClientId
  };
  await syncLossPoint(data);
  proxy?.$modal.msgSuccess('同步成功');
  await getList();
};
const syncAll = async (row?: LossPointVO) => {
  const data: SyncLossPoint = {};
  await syncAllLossPoint(data);
  proxy?.$modal.msgSuccess('同步成功');
  await getList();
};
const syncDeleteAll = async (row?: LossPointVO) => {
  const data: SyncLossPoint = {};
  await syncDeleteAllLossPoint(data);
  proxy?.$modal.msgSuccess('清除成功');
  await getList();
};
const handleSetLeverageBody = () => {
  setLeverageDialog.visible = true;
};
const handleStop = async (row?: LossPointVO) => {
  const data: SyncLossPoint = {
    lossPointId: row.id,
    clientId: row.nodeClientId
  };
  await stopLossPoint(data);
  proxy?.$modal.msgSuccess('移除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/lossPoint/export',
    {
      ...queryParams.value
    },
    `lossPoint_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  loadExchange();
  loadSymbol();
  loadNode();
});
</script>
