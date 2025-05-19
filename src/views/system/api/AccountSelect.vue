<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="100">
            <el-form-item label="api key" prop="apiKey">
              <el-input v-model="queryParams.apiKey" placeholder="请输入api key" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入API名称" clearable @keyup.enter="handleQuery" />
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
      <el-table v-loading="loading" :data="apiList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="交易所" align="center" prop="exchangeName" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="api key" align="center" prop="apiKey" />
        <!--        <el-table-column label="api secret" align="center" prop="apiSecurity" />-->
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <!--            <el-tooltip content="选择" placement="top">-->
            <el-button link type="primary" @click="handleSelect(scope.row)" v-hasPermi="['system:api:edit']">选择</el-button>
            <!--            </el-tooltip>-->
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改交易所API对话框 -->
    <!--    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>-->
    <!--      <el-form ref="apiFormRef" :model="form" :rules="rules" label-width="80px" :label-position="'top'">-->
    <!--        <el-form-item :label="'交易所'" prop="exchangeName">-->
    <!--          &lt;!&ndash;              <el-input v-model="form.symbol" placeholder="请输入币种" />&ndash;&gt;-->
    <!--          <el-select v-model="form.exchangeName" :placeholder="'请选择交易所'" :filterable="true">-->
    <!--            <el-option :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item :label="'Api名称'" prop="exchangeName">-->
    <!--          &lt;!&ndash;              <el-input v-model="form.symbol" placeholder="请输入币种" />&ndash;&gt;-->
    <!--          <el-select v-model="form.exchangeName" :placeholder="'请选择交易所'" :filterable="true">-->
    <!--            <el-option :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>-->
    <!--          </el-select>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="api key" prop="apiKey">-->
    <!--          <el-input v-model="form.apiKey" placeholder="请输入api key" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="api security" prop="apiSecurity">-->
    <!--          <el-input v-model="form.apiSecurity" placeholder="请输入api security" />-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <div class="dialog-footer">-->
    <!--          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>-->
    <!--          <el-button @click="cancel">取 消</el-button>-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
    <!-- 配置弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="(configForm.exchangeName ? configForm.exchangeName : '') + proxy.$t('setting.apiSettingForm.title')"
      width="500px"
      @click.stop
    >
      <!--        <el-form-item label="API Key">-->
      <!--          <el-input v-model="configForm.apiKey" />-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="Secret">-->
      <!--          <el-input v-model="configForm.secret" />-->
      <!--        </el-form-item>-->
      <el-form label-position="top" label-width="100px" ref="apiConfigRef" :model="configForm" :rules="rules">
        <el-form-item :label="'交易所'" prop="exchangeName">
          <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
          <el-select v-model="configForm.exchangeName" :placeholder="'请选择交易所'" :filterable="true">
            <el-option :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="configForm.name" placeholder="请输入名称" />
        </el-form-item>
        <ApiConfigForm :fields="currentFields" :model-value="configForm" i18n-prefix="setting.apiSettingForm"></ApiConfigForm>
      </el-form>

      <!--        <el-form-item label="Passphrase" v-if="currentExchange?.needPassphrase">-->
      <!--          <el-input v-model="configForm.passphrase" />-->
      <!--        </el-form-item>-->
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AccountSelect" lang="ts">
import { useApiConfig } from '@/constants/useApiConfig';
import { listApi, getApi, delApi, addApi, updateApi } from '@/api/system/api';
import { ApiVO, ApiQuery, ApiForm } from '@/api/system/api/types';
import { ExchangeVo } from '@/api/system/common/types';
import { getSupportExchange } from '@/api/system/common/common';
import { checkApi, getApiSettingStatus } from '@/layout/components/ApiSetting/apiSetting';
import ApiConfigForm from '@/layout/components/ApiSetting/components/ApiConfigForm.vue';
import { ref } from 'vue';
import { ApiSettingVo } from '@/layout/components/ApiSetting/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const apiList = ref<ApiVO[]>([]);
const supportExchangeList = ref<ExchangeVo[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const apiConfigRef = useTemplateRef('apiConfigRef');

const queryFormRef = ref<ElFormInstance>();
const apiFormRef = ref<ElFormInstance>();
const configDialogVisible = ref(false);
const props = defineProps<{
  exchangeName: string;
}>();

const emit = defineEmits<{
  (e: 'select', value: ApiVO): void;
}>();
// 交易所列表
const exchangeList = ref<ApiSettingVo[]>([
  {
    exchangeName: undefined,
    status: undefined
  }
]);
// 当前选中的交易所
const currentExchange = ref<ApiSettingVo | (typeof exchangeList)[0]>(null);
const { configForm, fieldConfigs } = useApiConfig();

// 计算当前配置的字段
const currentFields = computed(() => {
  if (configForm.value.exchangeName) {
    return fieldConfigs[configForm.value?.exchangeName.toLowerCase() as keyof typeof fieldConfigs] || [];
  } else {
    return [];
  }
});
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ApiForm = {
  id: undefined,
  apiKey: undefined,
  apiSecurity: undefined,
  exchangeName: undefined,
  userId: undefined
};
const data = reactive<PageData<ApiForm, ApiQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    apiKey: undefined,
    apiSecurity: undefined,
    exchangeName: undefined,
    userId: undefined,
    params: {}
  },
  rules: {
    apiKey: [{ required: true, message: 'api key不能为空', trigger: 'blur' }],
    exchangeName: [{ required: true, message: '交易所不能为空', trigger: 'blur' }],
    apiSecurity: [{ required: true, message: 'apiSecurity不能为空', trigger: 'blur' }],
    secret: [{ required: true, message: 'apiSecurity不能为空', trigger: 'blur' }],
    name: [{ required: true, message: 'api名称不能为空', trigger: 'blur' }]
  }
});
const loadApiSetting = async () => {
  const axiosResponse = await getApiSettingStatus();
  // console.log(axiosResponse);
  if (axiosResponse.code == 200) {
    exchangeList.value = axiosResponse.data;
  }
};
const { queryParams, form, rules } = toRefs(data);

/** 查询交易所API列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.exchangeName = props.exchangeName;
  const res = await listApi(queryParams.value);
  apiList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
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
/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  apiFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: ApiVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加交易所API';
};
/** 选中操作 */
const handleSelect = (item: ApiVO) => {
  emit('select', item);
};

/** 修改按钮操作 */
const handleUpdate = async (row?: ApiVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getApi(_id);
  Object.assign(form.value, res.data);
  Object.assign(configForm.value, res.data);
  configForm.value.apiKey = res.data.apiKey;
  configForm.value.secret = res.data.apiSecurity;
  currentExchange.value = { exchangeName: form.value.exchangeName, status: null };
  dialog.visible = true;
  dialog.title = '修改交易所API';
};

/** 提交按钮 */
const submitForm = () => {
  apiConfigRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const data = {
        exchange: configForm.value?.exchangeName,
        apiKey: configForm.value.apiKey,
        apiSecurity: configForm.value.secret,
        passphrase: configForm.value.passphrase
      };
      const checkResult = await checkApi(data);
      // if (checkResult.code == 200) {
      if (checkResult.data?.checkStatus == 'false') {
        ElMessage.error(proxy.$t('setting.apiSettingForm.checkFail'));
        return;
      }

      buttonLoading.value = true;
      if (configForm.value.id) {
        await updateApi(configForm.value).finally(() => (buttonLoading.value = false));
      } else {
        await addApi(configForm.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ApiVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除交易所API编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delApi(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/api/export',
    {
      ...queryParams.value
    },
    `api_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  loadExchange();
  loadApiSetting();
});
</script>
