<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="100">
            <el-form-item :label="t('apiSetting.queryForm.apiKey')" prop="apiKey">
              <el-input
                v-model="queryParams.apiKey"
                :placeholder="t('apiSetting.queryForm.apiKeyPlaceholder')"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item :label="t('apiSetting.queryForm.exchangeName')" prop="exchangeName">
              <el-select
                v-model="queryParams.exchangeName"
                :placeholder="t('apiSetting.queryForm.selectExchange')"
                :filterable="true"
                clearable
                @keyup.enter="handleQuery"
              >
                <el-option :key="item.name" :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.opt.search') }}</el-button>
              <el-button icon="Refresh" @click="resetQuery">{{ t('common.opt.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:api:add']">{{ t('common.opt.add') }} </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:api:edit']"
              >{{ t('common.opt.edit') }}
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:api:remove']"
              >{{ t('common.opt.delete') }}
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="apiList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column :label="t('apiSetting.table.exchange')" align="center" prop="exchangeName" />
        <el-table-column :label="t('apiSetting.table.name')" align="center" prop="name" />
        <el-table-column :label="t('apiSetting.table.apiKey')" align="center" prop="apiKey" />
        <el-table-column :label="t('apiSetting.table.type')" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="exchange_api_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <!--        <el-table-column label="api secret" align="center" prop="apiSecurity" />-->
        <el-table-column :label="t('apiSetting.table.createTime')" align="center" prop="createTime" />
        <el-table-column :label="t('common.opt.opt')" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip :content="t('common.opt.edit')" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:api:edit']"></el-button>
            </el-tooltip>
            <el-tooltip :content="t('common.opt.delete')" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:api:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 配置弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="(configForm.exchangeName ? configForm.exchangeName : '') + t('setting.apiSettingForm.title')"
      width="500px"
      @click.stop
    >
      <el-form label-position="top" label-width="100px" ref="apiConfigRef" :model="configForm" :rules="rules">
        <el-form-item :label="t('apiSetting.form.exchange')" prop="exchangeName">
          <!--              <el-input v-model="form.symbol" placeholder="请输入币种" />-->
          <el-select v-model="configForm.exchangeName" :placeholder="t('apiSetting.queryForm.selectExchange')" :filterable="true">
            <el-option :key="item.name" :label="item.desc" :value="item.name" v-for="item in supportExchangeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('apiSetting.form.name')" prop="name">
          <el-input v-model="configForm.name" :placeholder="t('apiSetting.form.namePlaceholder')" />
        </el-form-item>
        <ApiConfigForm :fields="currentFields" :model-value="configForm" i18n-prefix="setting.apiSettingForm"></ApiConfigForm>
        <el-form-item :label="t('apiSetting.form.type')" prop="type">
          <el-select v-model="configForm.type" :placeholder="t('apiSetting.form.selectType')" clearable>
            <el-option v-for="dict in exchange_api_type" :key="dict.value" :label="dict.label" :value="dict.value">
              <dict-tag :options="exchange_api_type" :value="dict.value" />
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <CryptoSlogan></CryptoSlogan>
        <el-button @click="dialog.visible = false">{{ t('common.dialog.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ t('apiSetting.form.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="DialogApiList" lang="ts">
import { useI18n } from 'vue-i18n';
import { useApiConfig } from '@/constants/useApiConfig';
import { listApi, getApi, delApi, addApi, updateApi } from '@/api/system/api';
import { ApiVO, ApiQuery, ApiForm } from '@/api/system/api/types';
import { ExchangeVo } from '@/api/system/common/types';
import { getSupportExchange } from '@/api/system/common/common';
import { checkApi, getApiSettingStatus } from '@/layout/components/ApiSetting/apiSetting';
import ApiConfigForm from '@/layout/components/ApiSetting/components/ApiConfigForm.vue';
import { ref } from 'vue';
import { ApiSettingVo } from '@/layout/components/ApiSetting/types';
import CryptoSlogan from '@/layout/components/ApiSetting/components/CryptoSlogan.vue';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { exchange_api_type } = toRefs<any>(proxy?.useDict('exchange_api_type'));
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

// 交易所列表
const exchangeList = ref<ApiSettingVo[]>([
  {
    exchangeName: undefined,
    status: undefined
  }
]);
// 当前选中的交易所
const currentExchange = ref<ApiSettingVo | (typeof exchangeList)[0]>(null);
const { configForm, fieldConfigs, getExchangeFields } = useApiConfig();

// 计算当前配置的字段 - 方式一（推荐）
const currentFields = computed(() => {
  return getExchangeFields(configForm.value.exchangeName);
});

// 或者直接使用方式二
// const currentFields = computed(() => {
//   if (!configForm.value.exchangeName) return [];
//   const exchange = configForm.value.exchangeName.toLowerCase();
//   return fieldConfigs.value[exchange as keyof typeof fieldConfigs.value] || [];
// });

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
    type: [{ required: true, message: 'type不能为空', trigger: 'blur' }],
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
  dialog.title = t('apiSetting.dialog.addTitle');
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
  dialog.title = t('apiSetting.dialog.editTitle');
};

/** 提交按钮 */
const submitForm = () => {
  apiConfigRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const data = {
        exchange: configForm.value?.exchangeName,
        apiKey: configForm.value.apiKey,
        apiSecurity: configForm.value.secret,
        passphrase: configForm.value.passphrase,
        type: configForm.value.type
      };
      const checkResult = await checkApi(data);
      // if (checkResult.code == 200) {
      if (checkResult.data?.checkStatus == 'false') {
        ElMessage.error(t('setting.apiSettingForm.checkFail'));
        return;
      }
      configForm.value.apiSecurity = configForm.value.secret;
      buttonLoading.value = true;
      if (configForm.value.id) {
        await updateApi(configForm.value).finally(() => (buttonLoading.value = false));
      } else {
        await addApi(configForm.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess(t('apiSetting.submitSuccess'));
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: ApiVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(t('apiSetting.deleteConfirm', { ids: _ids })).finally(() => (loading.value = false));
  await delApi(_ids);
  proxy?.$modal.msgSuccess(t('apiSetting.deleteSuccess'));
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
