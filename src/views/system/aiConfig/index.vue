<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="流水线名称" prop="flowName">
              <el-input v-model="queryParams.flowName" placeholder="请输入流水线名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="api地址" prop="url">
              <el-input v-model="queryParams.url" placeholder="请输入api地址" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="token" prop="token">
              <el-input v-model="queryParams.token" placeholder="请输入token" clearable @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:aiConfig:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:aiConfig:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:aiConfig:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:aiConfig:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="aiConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="名称" align="center" prop="flowName" />
        <el-table-column label="api地址" align="center" prop="url" />
        <el-table-column label="token" align="center" prop="token" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:aiConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:aiConfig:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改ai 流水线配置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" append-to-body>
      <el-form ref="aiConfigFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="flowName">
          <el-input v-model="form.flowName" placeholder="请输入流水线名称" />
        </el-form-item>
        <el-form-item label="api地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入api地址" />
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="form.token" placeholder="请输入token" />
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

<script setup name="AiConfig" lang="ts">
import { listAiConfig, getAiConfig, delAiConfig, addAiConfig, updateAiConfig } from '@/api/system/aiConfig';
import { AiConfigVO, AiConfigQuery, AiConfigForm } from '@/api/system/aiConfig/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const aiConfigList = ref<AiConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const aiConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AiConfigForm = {
  id: undefined,
  flowName: undefined,
  url: undefined,
  token: undefined
}
const data = reactive<PageData<AiConfigForm, AiConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    flowName: undefined,
    url: undefined,
    token: undefined,
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

/** 查询ai 流水线配置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAiConfig(queryParams.value);
  aiConfigList.value = res.rows;
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
  aiConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: AiConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加ai 流水线配置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AiConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getAiConfig(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改ai 流水线配置";
}

/** 提交按钮 */
const submitForm = () => {
  aiConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAiConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addAiConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AiConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除ai 流水线配置编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delAiConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/aiConfig/export', {
    ...queryParams.value
  }, `aiConfig_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
