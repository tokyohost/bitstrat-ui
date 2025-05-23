<script setup lang="ts">
import DialogApiList from '@/views/system/api/pupUpIndex.vue';
import CryptoSlogan from '@/layout/components/ApiSetting/components/CryptoSlogan.vue';

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();
const close = () => {
  emit('update:visible', false);
};

const localVisible = ref(props.visible);

// 监听 props.visible，同步到本地
watch(
  () => props.visible,
  (val) => {
    localVisible.value = val;
  }
);

// 监听本地变化，通知父组件更新
watch(localVisible, (val) => {
  emit('update:visible', val);
});
</script>

<template>
  <div>
    <el-dialog v-model="localVisible" title="config api" width="1200px">
      <DialogApiList></DialogApiList>
      <template #footer>
        <div class="dialog-footer">
          <CryptoSlogan></CryptoSlogan>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
