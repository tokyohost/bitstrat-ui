<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="通知类型" prop="notifyType">
              <el-select v-model="queryParams.notifyType" placeholder="请选择通知类型" clearable>
                <el-option label="钉钉机器人通知" :value="1" />
                <el-option label="TG通知" :value="2" />
              </el-select>
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
<!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['monitor:notifyLog:export']">导出</el-button>-->
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="notifyLogList">
        <el-table-column label="通知类型" align="center" prop="notifyType">
          <template #default="scope">
            {{ Number(scope.row.notifyType) === 1 ? '钉钉机器人通知' : 'TG通知' }}
          </template>
        </el-table-column>
        <el-table-column label="通知内容" align="center" prop="notifyContent" width="500" show-overflow-tooltip />
        <el-table-column label="通知状态" align="center" prop="notifyStatus">
          <template #default="scope">
            {{ Number(scope.row.notifyStatus) === 1 ? '成功' : '失败' }}
          </template>
        </el-table-column>
        <el-table-column label="通知时间" align="center" prop="createTime">
          <template #default="scope">
            {{ parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="查看详情" placement="top">
              <el-button link type="primary" icon="View" @click="handleView(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 查看通知日志详情对话框 -->
    <el-dialog title="查看通知日志详情" v-model="dialog.visible" width="600px" append-to-body>
      <el-form ref="notifyLogFormRef" :model="form" label-width="80px">
        <el-form-item label="通知内容">
          <el-input v-model="form.notifyContent" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" resize="none" readonly />
        </el-form-item>
        <el-form-item label="错误信息" prop="errorMessage">
          <el-input v-model="form.errorMessage" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" resize="none" readonly />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="NotifyLog" lang="ts">
import { listNotifyLog, getNotifyLog } from '@/api/monitor/notifyLog';
import { NotifyLogVO, NotifyLogQuery, NotifyLogForm } from '@/api/monitor/notifyLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const notifyLogList = ref<NotifyLogVO[]>([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const notifyLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: NotifyLogForm = {
  id: undefined,
  notifyType: undefined,
  notifyContent: undefined,
  notifyStatus: undefined,
  errorMessage: undefined,
  createTime: undefined,
}
const data = reactive<PageData<NotifyLogForm, NotifyLogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    notifyType: undefined,
    notifyContent: undefined,
    notifyStatus: undefined,
    errorMessage: undefined,
    params: {}
  },
  rules: {
    notifyType: [
      { required: true, message: "通知类型 1-钉钉机器人通知 2-TG通知不能为空", trigger: "change" }
    ],
    notifyContent: [
      { required: true, message: "通知内容不能为空", trigger: "blur" }
    ],
    notifyStatus: [
      { required: true, message: "通知状态 1-成功 2-失败不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通知日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listNotifyLog(queryParams.value);
  notifyLogList.value = res.rows;
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
  notifyLogFormRef.value?.resetFields();
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

/** 查看详情按钮操作 */
const handleView = async (row: NotifyLogVO) => {
  reset();
  const res = await getNotifyLog(row.id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('monitor/notifyLog/export', {
    ...queryParams.value
  }, `notifyLog_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
