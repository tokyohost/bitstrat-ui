<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <div class="strategy-list">
        <StrategyCard @delete="getList"
          v-for="(item, index) in crossExchangeArbitrageTaskList"
          :key="index"
          :data="item"
        />
        <el-empty description="暂无任务" v-if="crossExchangeArbitrageTaskList.length === 0" />
      </div>

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
          <el-date-picker clearable
            v-model="form.longInTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择做多入场时间">
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
          <el-date-picker clearable
            v-model="form.shortInTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择做空入场时间">
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
  </div>
</template>

<script setup name="CrossExchangeArbitrageTask" lang="ts">
import { listCrossExchangeArbitrageTask, getCrossExchangeArbitrageTask, delCrossExchangeArbitrageTask, addCrossExchangeArbitrageTask, updateCrossExchangeArbitrageTask } from '@/api/system/crossExchangeArbitrageTask';
import { CrossExchangeArbitrageTaskVO, CrossExchangeArbitrageTaskQuery, CrossExchangeArbitrageTaskForm } from '@/api/system/crossExchangeArbitrageTask/types';
import StrategyCard from '@/views/system/crossExchangeArbitrageTask/components/StrategyCard.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const crossExchangeArbitrageTaskList = ref<CrossExchangeArbitrageTaskVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const crossExchangeArbitrageTaskFormRef = ref<ElFormInstance>();

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
  startTime: undefined,
}
const data = reactive<PageData<CrossExchangeArbitrageTaskForm, CrossExchangeArbitrageTaskQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    params: {
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询跨交易所套利任务列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCrossExchangeArbitrageTask(queryParams.value);
  crossExchangeArbitrageTaskList.value = res.rows;
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
  crossExchangeArbitrageTaskFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CrossExchangeArbitrageTaskVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加跨交易所套利任务";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CrossExchangeArbitrageTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCrossExchangeArbitrageTask(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改跨交易所套利任务";
}

/** 提交按钮 */
const submitForm = () => {
  crossExchangeArbitrageTaskFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCrossExchangeArbitrageTask(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCrossExchangeArbitrageTask(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CrossExchangeArbitrageTaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除跨交易所套利任务编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCrossExchangeArbitrageTask(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/crossExchangeArbitrageTask/export', {
    ...queryParams.value
  }, `crossExchangeArbitrageTask_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
<style scoped>
.strategy-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
