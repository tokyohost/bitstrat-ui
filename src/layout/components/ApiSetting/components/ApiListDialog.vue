<script setup lang="ts">
import DialogApiList from '@/views/system/api/pupUpIndex.vue';

const props = defineProps<{
  visible: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();
const close = () => {
  emit('update:visible', false);
};
</script>

<template>
  <div>
    <el-dialog v-model="props.visible" title="config api" width="1200px">
      <DialogApiList></DialogApiList>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss"></style>
