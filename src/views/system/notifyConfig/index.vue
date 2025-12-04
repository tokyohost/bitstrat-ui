<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="配置类型" prop="type">
              <el-select v-model="queryParams.type" placeholder="请选择配置类型" clearable>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:notifyConfig:add']">新增</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:notifyConfig:edit']">修改</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:notifyConfig:remove']">删除</el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="1.5">-->
<!--            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:notifyConfig:export']">导出</el-button>-->
<!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="notifyConfigList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="配置类型" align="center" prop="type">
          <template #default="scope">
            {{ Number(scope.row.type) === 1 ? '钉钉机器人通知' : 'TG通知' }}
          </template>
        </el-table-column>
        <el-table-column label="钉钉 token" align="center" prop="dingToken" v-if="queryParams.type === 1" />
        <el-table-column label="钉钉 secret" align="center" prop="dingSecret" v-if="queryParams.type === 1" />
        <el-table-column label="tg chart id" align="center" prop="telegramChatId" v-if="queryParams.type === 2" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:notifyConfig:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:notifyConfig:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户通知设置对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="notifyConfigFormRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="配置类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择配置类型" @change="handleTypeChange">
            <el-option label="钉钉机器人通知" :value="1" />
            <el-option label="TG通知" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="钉钉 token" prop="dingToken">
          <el-input v-model="form.dingToken" placeholder="请输入钉钉 token" />
        </el-form-item>
        <el-form-item v-if="form.type === 1" label="钉钉 secret" prop="dingSecret">
          <el-input v-model="form.dingSecret" placeholder="请输入钉钉 secret" />
        </el-form-item>
        <el-form-item v-if="form.type === 2" label="tg chart id" prop="telegramChatId">
          <el-input v-model="form.telegramChatId" placeholder="请输入tg chart id" />
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

<script setup name="NotifyConfig" lang="ts">
import { listNotifyConfig, getNotifyConfig, delNotifyConfig, addNotifyConfig, updateNotifyConfig } from '@/api/system/notifyConfig';
import { NotifyConfigVO, NotifyConfigQuery, NotifyConfigForm } from '@/api/system/notifyConfig/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const notifyConfigList = ref<NotifyConfigVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const notifyConfigFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: NotifyConfigForm = {
  type: undefined,
  dingToken: undefined,
  dingSecret: undefined,
  telegramChatId: undefined,
}
const data = reactive<PageData<NotifyConfigForm, NotifyConfigQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    type: undefined,
    dingToken: undefined,
    dingSecret: undefined,
    telegramChatId: undefined,
    params: {}
  },
  rules: {
    type: [
      { required: true, message: "配置类型不能为空", trigger: "change" }
    ],
    dingToken: [
      { required: true, message: "钉钉 token不能为空", trigger: "blur" }
    ],
    telegramChatId: [
      { required: true, message: "tg chart id不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户通知设置列表 */
const getList = async () => {
  loading.value = true;
  const res = await listNotifyConfig(queryParams.value);
  notifyConfigList.value = res.rows;
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
  notifyConfigFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: NotifyConfigVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户通知设置";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: NotifyConfigVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getNotifyConfig(_id);
  Object.assign(form.value, res.data);
  // 将 type 转换为数字类型
  form.value.type = Number(res.data.type);
  // 根据配置类型动态设置对应的字段值
  if (form.value.type === 1) {
    form.value.dingToken = res.data.dingToken;
    form.value.dingSecret = res.data.dingSecret;
  } else if (form.value.type === 2) {
    form.value.telegramChatId = res.data.telegramChatId;
  }
  dialog.visible = true;
  dialog.title = "修改用户通知设置";
}

/** 提交按钮 */
const submitForm = () => {
  notifyConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateNotifyConfig(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addNotifyConfig(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: NotifyConfigVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除选中的数据项？').finally(() => loading.value = false);
  await delNotifyConfig(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/notifyConfig/export', {
    ...queryParams.value
  }, `notifyConfig_${new Date().getTime()}.xlsx`)
}

/** 配置类型变化处理 */
const handleTypeChange = (value: number) => {
  form.value.dingToken = undefined;
  form.value.dingSecret = undefined;
  form.value.telegramChatId = undefined;
}

onMounted(() => {
  getList();
});
</script>
