<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="币种" prop="symbol">
              <el-input v-model="queryParams.symbol" placeholder="请输入币种" clearable @keyup.enter="handleQuery" />
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
            <!--            <el-button type="warning" plain icon="Refresh" @click="handleSync" v-hasPermi="['system:rank:edit']">手动同步</el-button>-->
          </el-col>
          <el-col :span="1.5">
            <el-tag type="warning" effect="plain" v-if="syncStatus == 1">正在同步... </el-tag>
            <el-tag v-else type="success" effect="plain">同步完成 {{ lastFinishTime }} </el-tag>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="rankList" @selection-change="handleSelectionChange">
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="" align="center" prop="score">
          <template #header="scope"> 得分 </template>
        </el-table-column>
        <el-table-column label="当前市价" align="center" prop="marketPrice" />

        <el-table-column label="涨跌幅度(24H)" align="center" prop="percentage">
          <template #default="scope">
            <span class="up" v-if="scope.row.percentage > 0">{{ scope.row.percentage ? scope.row.percentage + '%' : '-' }}</span>
            <span class="down" v-else-if="scope.row.percentage < 0">{{ scope.row.percentage ? scope.row.percentage + '%' : '-' }}</span>
            <span v-else-if="scope.row.percentage == 0">{{ scope.row.percentage ? scope.row.percentage + '%' : '-' }}</span>
            <span v-else-if="scope.row.percentage == null">{{ scope.row.percentage ? scope.row.percentage + '%' : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="同步时间" align="center" prop="updateTime" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改山寨币排行对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="rankFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种" />
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
        <el-form-item label="同步时间" prop="updateTime">
          <el-input v-model="form.updateTime" placeholder="请输入涨跌百分比" />
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

<script setup name="Rank" lang="ts">
import { listRank, getRank, delRank, addRank, updateRank, syncRank } from '@/api/system/rank';
import { RankVO, RankQuery, RankForm } from '@/api/system/rank/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const rankList = ref<RankVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const syncStatus = ref(0);
const lastFinishTime = ref('');

const queryFormRef = ref<ElFormInstance>();
const rankFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RankForm = {
  id: undefined,
  symbol: undefined,
  score: undefined,
  marketPrice: undefined,
  percentage: undefined
};
const data = reactive<PageData<RankForm, RankQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    symbol: undefined,
    score: undefined,
    marketPrice: undefined,
    percentage: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询山寨币排行列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.orderByColumn = 'score';
  queryParams.value.isAsc = 'desc';
  const res = await listRank(queryParams.value);
  syncStatus.value = res.extCode;
  lastFinishTime.value = res.extInfo;
  rankList.value = res.rows;
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
  rankFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: RankVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加山寨币排行';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: RankVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getRank(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改山寨币排行';
};
const handleSync = async () => {
  reset();
  // const loadingInstance1 = ElLoading.service({ fullscreen: true })
  const res = await syncRank();
  await getList();
  ElMessage.success('已触发，稍后刷新查看最新数据');
  // loadingInstance1.close()
};

/** 提交按钮 */
const submitForm = () => {
  rankFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRank(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addRank(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: RankVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除山寨币排行编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delRank(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/rank/export',
    {
      ...queryParams.value
    },
    `rank_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
<style scoped>
.up {
  color: green;
}
.down {
  color: red;
}
</style>
