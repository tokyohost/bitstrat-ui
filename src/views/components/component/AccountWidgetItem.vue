<script setup lang="ts">
import { OrderVO } from '@/api/system/order/types';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { WebsocketExStatus, WebsocketStatus } from '@/layout/components/NotifySetting/types';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { websocketExAccount } from '@/views/system/crossExchangeArbitrageTask/components/type';
import { checkWebsocketStatusByAccountId } from '@/views/system/crossExchangeArbitrageTask/components';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { socket_status } = toRefs<any>(proxy?.useDict('socket_status'));
const props = defineProps<{
  account: WebsocketExStatus[]
}>();
const exchangeConnect = async (item: WebsocketStatus) => {
  ElMessageBox.confirm(proxy.$t('setting.socketStatus.reconnectConfirm'), proxy.$t('setting.socketStatus.title'), {
    confirmButtonText: proxy.$t('setting.socketStatus.ok'),
    cancelButtonText: proxy.$t('setting.socketStatus.cancel'),
    type: 'warning'
  })
    .then(async () => {
      const exchanges = [item.exchange];
      const data: websocketExAccount = {
        exchange: item.exchange,
        accountId: item.apiId
      };
      await checkWebsocketStatusByAccountId([data]);
      ElMessage({
        type: 'info',
        message: proxy.$t('setting.socketStatus.done')
      });
    })
    .catch(() => {
    });
};
</script>

<template>
  <div class="flex flex-col gap-y-1">
    <el-card class="w-full" v-for="item in props.account.datas" shadow="hover" :key="new Date().getTime()"  @click="exchangeConnect(item)">
      <div class="flex flex-row ">
        <div class="flex justify-between w-full ">
          <div class="flex justify-start text-center align--center gap-col-1 ml-2">
            <ExchangeLogo :exchange="item.exchange"></ExchangeLogo>
            <dict-tag :options="socket_status" :value="item.status" :size="'small'"  :i18n-profilx="'setting.api'" />
            <div  class="ml-1 text-xs text-align-center color-#67C23A" v-if="item.status == 'active'">{{ item.dely ?? '0'
              }}ms
            </div>
          </div>
          <div class="flex justify-center">
            <div class="text-xs text-align-center">
              {{ item.apiName ?? '-' }}
            </div>

          </div>
        </div>

      </div>
      <div class="api-seting-item">

        <div class="flex flex-row  w-full">
          <div class="flex flex-1 text-xs">
            <div class="font-400">总金额</div>
            <div class="border-b-unset ml-1 color-blue">{{ item.balance ?? '-' }} U</div>
          </div>
          <div class="flex flex-1 text-xs">
            <div class="font-400">可用</div>
            <div class="border-b-unset ml-1 color-#67C23A">{{ item.freeBalance ?? '-' }} U</div>
          </div>
        </div>
        <div class="flex justify-end  w-full text-xs mt-2">
          <div>余额更新时间:{{item.updateTime}}</div>
        </div>
      </div>
    </el-card>
  </div>

</template>

<style scoped lang="scss">
::v-deep .el-card__body {
  //padding:0 !important;
  padding: 5px 5px 5px 5px !important;
}

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
  flex-direction: column;
  align-items: center;
}
</style>
