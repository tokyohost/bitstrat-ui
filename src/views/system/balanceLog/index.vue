<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!--            <el-form-item label="用户ID" prop="userId">-->
            <!--              <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="变动前余额" prop="beforeBalance">-->
            <!--              <el-input v-model="queryParams.beforeBalance" placeholder="请输入变动前余额" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="变动金额" prop="changeAmount">-->
            <!--              <el-input v-model="queryParams.changeAmount" placeholder="请输入变动金额" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="变动后余额" prop="afterBalance">-->
            <!--              <el-input v-model="queryParams.afterBalance" placeholder="请输入变动后余额" clearable @keyup.enter="handleQuery" />-->
            <!--            </el-form-item>-->
            <el-form-item class="gap-5">
              <!--              <el-button type="primary" icon="Plus" @click="handleRecharge">充值</el-button>-->
              <RechargeDialog v-model:visible="rechargeDialog" @recharge-success="getList" class="mr5" />
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
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:balanceLog:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="balanceLogList" @selection-change="handleSelectionChange">
        <!--        <el-table-column type="selection" width="55" align="center" />-->
        <el-table-column label="ID" align="center" prop="id" v-if="true" />
        <el-table-column label="变动前余额" align="center" prop="beforeBalance" />
        <el-table-column label="变动金额" align="center" prop="changeAmount" />
        <el-table-column label="变动后余额" align="center" prop="afterBalance" />
        <el-table-column label="类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="balance_log_type" :value="scope.row.type"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="时间" align="center" prop="createTime" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改账户余额变动日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="balanceLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="变动前余额" prop="beforeBalance">
          <el-input v-model="form.beforeBalance" placeholder="请输入变动前余额" />
        </el-form-item>
        <el-form-item label="变动金额" prop="changeAmount">
          <el-input v-model="form.changeAmount" placeholder="请输入变动金额" />
        </el-form-item>
        <el-form-item label="变动后余额" prop="afterBalance">
          <el-input v-model="form.afterBalance" placeholder="请输入变动后余额" />
        </el-form-item>
        <el-form-item label="备注信息，例如订单号/充值方式" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息，例如订单号/充值方式" />
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

<script setup name="BalanceLog" lang="ts">
import RechargeDialog from '@/layout/components/Recharge/RechargeDialog.vue';
import { listBalanceLog, getBalanceLog, delBalanceLog, addBalanceLog, updateBalanceLog } from '@/api/system/balanceLog';
import { BalanceLogVO, BalanceLogQuery, BalanceLogForm } from '@/api/system/balanceLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { balance_log_type } = toRefs<any>(proxy?.useDict('balance_log_type'));
const balanceLogList = ref<BalanceLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const balanceLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BalanceLogForm = {
  id: undefined,
  userId: undefined,
  beforeBalance: undefined,
  changeAmount: undefined,
  afterBalance: undefined,
  type: undefined,
  remark: undefined
};
const data = reactive<PageData<BalanceLogForm, BalanceLogQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    beforeBalance: undefined,
    changeAmount: undefined,
    afterBalance: undefined,
    type: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '主键ID不能为空', trigger: 'blur' }],
    userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
    beforeBalance: [{ required: true, message: '变动前余额不能为空', trigger: 'blur' }],
    changeAmount: [{ required: true, message: '变动金额不能为空', trigger: 'blur' }],
    afterBalance: [{ required: true, message: '变动后余额不能为空', trigger: 'blur' }],
    type: [{ required: true, message: '变动类型：1=充值，2=消费，3=退款，4=赠送不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询账户余额变动日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBalanceLog(queryParams.value);
  balanceLogList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};
const rechargeDialog = ref(false);

const handleRecharge = () => {
  reset();
  rechargeDialog.value = true;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  balanceLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: BalanceLogVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加账户余额变动日志';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: BalanceLogVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBalanceLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改账户余额变动日志';
};

/** 提交按钮 */
const submitForm = () => {
  balanceLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBalanceLog(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBalanceLog(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: BalanceLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除账户余额变动日志编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delBalanceLog(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/balanceLog/export',
    {
      ...queryParams.value
    },
    `balanceLog_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
