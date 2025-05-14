<template>
  <div>
    <!-- 图标按钮 -->
    <el-popover placement="bottom-end" trigger="click" width="300">
      <template #reference>
        <el-icon :size="22" class="api-setting ml-1 mr-1" style="cursor: pointer">
          <Connection />
        </el-icon>
      </template>

      <!-- API 设置项列表 -->
      <div class="exchange-list" v-loading="loading">
        <div class="flex justify-between">
          <p style="margin-top: 0">{{ proxy.$t('navbar.socketStatus') }}</p>
          <el-icon class="hover:cursor-pointer" @click="refresh"><RefreshLeft /></el-icon>
        </div>

        <div class="exchange-item" v-for="item in exchangeList" :key="item.exchange">
          <div class="api-seting-item" @click="exchangeConnect(item)">
            <ExchangeLogo :exchange="item.exchange"></ExchangeLogo>
            <div class="flex justify-center">
              <dict-tag :options="socket_status" :value="item.status" :i18n-profilx="'setting.api'" />
              <el-tag type="success" class="ml-1" v-if="item.status == 'active'">{{ item.dely ?? '0' }}ms</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Setting } from '@element-plus/icons-vue';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { checkApi, getApiSettingDetail, getApiSettingStatus, setApi } from '@/layout/components/ApiSetting/apiSetting';
import { ApiSettingVo } from '@/layout/components/ApiSetting/types';
import ApiConfigForm from '@/layout/components/ApiSetting/components/ApiConfigForm.vue';
import { WebsocketStatus } from '@/layout/components/NotifySetting/types';
import { getWebsocketStatus } from '@/layout/components/NotifySetting/notifySetting';
import { checkWebsocketStatus } from '@/views/system/crossExchangeArbitrageTask/components';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { socket_status } = toRefs<any>(proxy?.useDict('socket_status'));

// 交易所列表
const exchangeList = ref<WebsocketStatus[]>([
  {
    exchange: undefined,
    status: undefined
  }
]);
const loading = ref(false);

const configDialogVisible = ref(false);

const loadApiSetting = async () => {
  loading.value = true;
  try {
    const axiosResponse = await getWebsocketStatus();
    // console.log(axiosResponse);
    if (axiosResponse.code == 200) {
      exchangeList.value = axiosResponse.data;
    }
  } finally {
    loading.value = false;
  }
};
const refresh = () => {
  loadApiSetting();
};
// 表单数据
const configForm = ref({
  apiKey: '',
  secret: '',
  passphrase: ''
});
const exchangeConnect = async (item: WebsocketStatus) => {
  ElMessageBox.confirm(proxy.$t('setting.socketStatus.reconnectConfirm'), proxy.$t('setting.socketStatus.title'), {
    confirmButtonText: proxy.$t('setting.socketStatus.ok'),
    cancelButtonText: proxy.$t('setting.socketStatus.cancel'),
    type: 'warning'
  })
    .then(async () => {
      const exchanges = [item.exchange];
      await checkWebsocketStatus(exchanges);
      ElMessage({
        type: 'info',
        message: proxy.$t('setting.socketStatus.done')
      });
    })
    .catch(() => {});
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
