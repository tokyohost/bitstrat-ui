<template>
  <div>
    <el-table :data="devices" style="width: 100%; height: 100%; font-size: 14px">
      <el-table-column :label="t('onlineDevice.deviceType')" align="center">
        <template #default="scope">
          <dict-tag :options="sys_device_type" :value="scope.row.deviceType" />
        </template>
      </el-table-column>
      <el-table-column :label="t('onlineDevice.host')" align="center" prop="ipaddr" :show-overflow-tooltip="true" />
      <el-table-column :label="t('onlineDevice.loginLocation')" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
      <el-table-column :label="t('onlineDevice.os')" align="center" prop="os" :show-overflow-tooltip="true" />
      <el-table-column :label="t('onlineDevice.browser')" align="center" prop="browser" :show-overflow-tooltip="true" />
      <el-table-column :label="t('onlineDevice.loginTime')" align="center" prop="loginTime" width="180">
        <template #default="scope">
          <span>{{ proxy.parseTime(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('onlineDevice.action')" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip :content="t('onlineDevice.delete')" placement="top">
            <el-button link type="primary" icon="Delete" @click="handldDelOnline(scope.row)"> </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="Online" lang="ts">
import { useI18n } from 'vue-i18n';
import { delOnline } from '@/api/monitor/online';
import { propTypes } from '@/utils/propTypes';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_device_type } = toRefs<any>(proxy?.useDict('sys_device_type'));

const props = defineProps({
  devices: propTypes.any.isRequired
});
const devices = computed(() => props.devices);

/** 删除按钮操作 */
const handldDelOnline = (row: any) => {
  ElMessageBox.confirm(t('onlineDevice.deleteConfirm'))
    .then(() => {
      return delOnline(row.tokenId);
    })
    .then((res: any) => {
      if (res.code === 200) {
        proxy?.$modal.msgSuccess(t('onlineDevice.deleteSuccess'));
        proxy?.$tab.refreshPage();
      } else {
        proxy?.$modal.msgError(res.msg);
      }
    })
    .catch(() => {});
};
</script>
