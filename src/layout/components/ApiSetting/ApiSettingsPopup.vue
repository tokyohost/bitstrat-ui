<template>
  <div>
    <div v-if="popover">
      <!-- 图标按钮 -->
      <el-popover placement="bottom-end" trigger="click" width="300">
        <template #reference>
          <el-icon :size="22" class="api-setting" style="cursor: pointer">
            <Setting />
          </el-icon>
        </template>

        <!-- API 设置项列表 -->
        <div class="exchange-list">
          <div class="flex justify-between">
            <p style="margin-top: 0">{{ proxy.$t('navbar.apiSetting') }}</p>
            <el-icon class="hover:cursor-pointer" @click="showConfigList(null)"><Setting /></el-icon>
          </div>
          <div class="exchange-item" v-for="item in exchangeList" :key="item.exchangeName" @click="showConfigList(item)">
            <div class="api-seting-item">
              <ExchangeLogo :exchange="item.exchangeName"></ExchangeLogo>
              <dict-tag :options="api_setting_status" v-if="item.status" :value="item.status" :i18n-profilx="'setting.api'" />
            </div>
          </div>
        </div>
      </el-popover>
    </div>
    <div v-else>
      <div class="exchange-list">
        <div class="flex justify-between">
          <p style="margin-top: 0">{{ proxy.$t('navbar.apiSetting') }}</p>
          <el-icon class="hover:cursor-pointer" @click="showConfigList(null)"><Setting /></el-icon>
        </div>
        <div class="exchange-item" v-for="item in exchangeList" :key="item.exchangeName" @click="showConfigList(item)">
          <div class="api-seting-item">
            <ExchangeLogo :exchange="item.exchangeName"></ExchangeLogo>
            <dict-tag :options="api_setting_status" v-if="item.status" :value="item.status" :i18n-profilx="'setting.api'" />
          </div>
        </div>
      </div>
    </div>
    <ApiListDialog v-model:visible="visible"></ApiListDialog>
    <!-- 配置弹窗 -->
    <el-dialog
      v-model="configDialogVisible"
      :title="currentExchange?.exchangeName + proxy.$t('setting.apiSettingForm.title')"
      width="500px"
      @click.stop
    >
      <!--        <el-form-item label="API Key">-->
      <!--          <el-input v-model="configForm.apiKey" />-->
      <!--        </el-form-item>-->
      <!--        <el-form-item label="Secret">-->
      <!--          <el-input v-model="configForm.secret" />-->
      <!--        </el-form-item>-->
      <ApiConfigForm :fields="currentFields" v-if="configForm" :model-value="configForm"></ApiConfigForm>
      <!--        <el-form-item label="Passphrase" v-if="currentExchange?.needPassphrase">-->
      <!--          <el-input v-model="configForm.passphrase" />-->
      <!--        </el-form-item>-->
      <template #footer>
        <el-button @click="configDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { checkApi, getApiSettingDetail, getApiSettingStatus, setApi } from '@/layout/components/ApiSetting/apiSetting';
import { ApiSettingVo } from '@/layout/components/ApiSetting/types';
import ApiConfigForm from '@/layout/components/ApiSetting/components/ApiConfigForm.vue';
import ApiListDialog from '@/layout/components/ApiSetting/components/ApiListDialog.vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { api_setting_status } = toRefs<any>(proxy?.useDict('api_setting_status'));

const visible = ref(false);
// 交易所列表
const exchangeList = ref<ApiSettingVo[]>([
  {
    exchangeName: undefined,
    status: undefined
  }
]);
const props = defineProps({
  popover: {
    type: Boolean,
    default: true
  }
});

// 当前选中的交易所
const currentExchange = ref<ApiSettingVo>(null);
const configDialogVisible = ref(false);

const loadApiSetting = async () => {
  const axiosResponse = await getApiSettingStatus();
  // console.log(axiosResponse);
  if (axiosResponse.code == 200) {
    exchangeList.value = axiosResponse.data;
  }
};

// 表单数据
const configForm = ref({
  apiKey: '',
  secret: '',
  passphrase: ''
});
// 每个交易所对应的字段配置
const fieldConfigs = {
  binance: [
    { label: 'API Key(HMAC)', prop: 'apiKey' },
    { label: 'Secret(HMAC)', prop: 'secret', type: 'password', showPassword: true }
  ],
  okx: [
    { label: 'API Key', prop: 'apiKey' },
    { label: 'Secret', prop: 'secret', type: 'password', showPassword: true },
    { label: 'Passphrase', prop: 'passphrase', type: 'password', showPassword: true }
  ],
  bitget: [
    { label: 'API Key', prop: 'apiKey' },
    { label: 'Secret', prop: 'secret', type: 'password', showPassword: true },
    { label: 'Passphrase', prop: 'passphrase', type: 'password', showPassword: true }
  ],
  bybit: [
    { label: 'API Key', prop: 'apiKey' },
    { label: 'Secret', prop: 'secret', type: 'password', showPassword: true }
  ]
};

// 计算当前配置的字段
const currentFields = computed(() => {
  return fieldConfigs[currentExchange.value?.exchangeName.toLowerCase() as keyof typeof fieldConfigs] || [];
});
// 打开配置弹窗
const showConfigList = async () => {
  visible.value = true;
};

// 保存配置
const handleSave = async () => {
  const data = {
    exchange: currentExchange.value?.exchangeName,
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

  // }

  const resp = await setApi(data);
  if (resp.code == 200) {
    //update success
    loadApiSetting();
    ElMessage.success(proxy.$t('setting.apiSettingForm.succ'));
    configDialogVisible.value = false;
  } else {
    ElMessage.error(resp.msg);
  }
};

onMounted(() => {
  loadApiSetting();
});
</script>

<style scoped>
.exchange-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px;
}
.exchange-item {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}
.exchange-item:hover {
  background: #f5f7fa;
}
.logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}
.api-setting {
  display: flex;
}
.api-setting:hover {
  cursor: pointer;
  display: flex;
}
.api-seting-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
</style>
