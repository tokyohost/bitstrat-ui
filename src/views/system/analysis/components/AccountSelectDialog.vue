<script setup lang="ts">
import AccountSelect from '@/views/system/api/AccountSelect.vue';
import { ApiVO } from '@/api/system/api/types';

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
    <el-dialog v-model="props.visible" title="config api" width="1200px" append-to-body>
      <AccountSelect :exchange-name="props.exchangeName" @select="selected"></AccountSelect>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
