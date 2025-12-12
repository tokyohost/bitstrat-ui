<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AccountSelect from '@/views/system/api/AccountSelect.vue';
import { ApiVO } from '@/api/system/api/types';

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  exchangeName: string;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'select', value: ApiVO): void;
}>();
const close = () => {
  emit('update:visible', false);
};

const selected = (account: ApiVO) => {
  console.debug('account', toRaw(account));
  emit('select', toRaw(account));
  emit('update:visible', false);
};
</script>

<template>
  <div>
    <el-dialog v-model="props.visible" :title="t('accountSelectDialog.title')" width="1200px" append-to-body>
      <AccountSelect :exchange-name="props.exchangeName" @select="selected"></AccountSelect>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">{{ t('accountSelectDialog.action.close') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
