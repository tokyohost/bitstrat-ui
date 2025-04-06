<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="币种id" prop="rankId">
              <el-input v-model="queryParams.rankId" placeholder="请输入币种id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="得分" prop="score">
              <el-input v-model="queryParams.score" placeholder="请输入得分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="当前市价" prop="marketPrice">
              <el-input v-model="queryParams.marketPrice" placeholder="请输入当前市价" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="涨跌百分比" prop="percentage">
              <el-input v-model="queryParams.percentage" placeholder="请输入涨跌百分比" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:rankLog:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:rankLog:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:rankLog:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:rankLog:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="rankLogList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="币种id" align="center" prop="rankId" />
        <el-table-column label="得分" align="center" prop="score" />
        <el-table-column label="当前市价" align="center" prop="marketPrice" />
        <el-table-column label="涨跌百分比" align="center" prop="percentage" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:rankLog:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:rankLog:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改山寨币排行日志对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="rankLogFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="币种id" prop="rankId">
          <el-input v-model="form.rankId" placeholder="请输入币种id" />
        </el-form-item>
        <el-form-item label="得分" prop="score">
          <el-input v-model="form.score" placeholder="请输入得分" />
        </el-form-item>
        <el-form-item label="当前市价" prop="marketPrice">
          <el-input v-model="form.marketPrice" placeholder="请输入当前市价" />
        </el-form-item>
        <el-form-item label="涨跌百分比" prop="percentage">
          <el-input v-model="form.percentage" placeholder="请输入涨跌百分比" />
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

<script setup name="RankLog" lang="ts">
import { listRankLog, getRankLog, delRankLog, addRankLog, updateRankLog } from '@/api/system/rankLog';
import { RankLogVO, RankLogQuery, RankLogForm } from '@/api/system/rankLog/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const rankLogList = ref<RankLogVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const rankLogFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RankLogForm = {
  id: undefined,
  rankId: undefined,
  score: undefined,
  marketPrice: undefined,
  percentage: undefined,
}
const data = reactive<PageData<RankLogForm, RankLogQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    rankId: undefined,
    score: undefined,
    marketPrice: undefined,
    percentage: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询山寨币排行日志列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRankLog(queryParams.value);
  rankLogList.value = res.rows;
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
  rankLogFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: RankLogVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加山寨币排行日志";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RankLogVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRankLog(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改山寨币排行日志";
}

/** 提交按钮 */
const submitForm = () => {
  rankLogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRankLog(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRankLog(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RankLogVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除山寨币排行日志编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRankLog(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/rankLog/export', {
    ...queryParams.value
  }, `rankLog_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
