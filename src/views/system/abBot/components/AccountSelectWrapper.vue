<template>
  <div>
    <!-- 显示已选账户 -->
    <div v-if="modelValue.length">
      <el-tag
        v-for="item in modelValue"
        :key="item.id"
        class="mr-2 mb-2"
        closable
        @close="remove(item)"
      >
        {{ item.name || item.apiKey }}
      </el-tag>
      <el-button type="primary" text @click="dialogVisible = true">修改账户</el-button>
    </div>

    <!-- 无已选账户时显示选择按钮 -->
    <div v-else>
      <el-button type="primary" @click="dialogVisible = true">选择账户</el-button>
    </div>

    <!-- 弹窗选择组件 -->
    <AccountMutiSelect
      v-model="tempValue"
      :exchange-name="exchangeName"
    />

    <!-- 控制弹窗显示 -->
    <el-dialog v-model="dialogVisible" title="选择账户" width="900px" @close="reset">
      <AccountMutiSelect
        v-model="tempValue"
        :exchange-name="exchangeName"
      />

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AccountMutiSelect from '@/views/system/abBot/components/AccountMutiSelect.vue';
import type { ApiVO } from '@/api/system/api/types';

const props = defineProps<{
  exchangeName?: string;
  modelValue: ApiVO[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ApiVO[]): void;
}>();

const dialogVisible = ref(false);
const tempValue = ref<ApiVO[]>([]);

watch(
  () => props.modelValue,
  (val) => {
    tempValue.value = [...val];
  },
  { immediate: true }
);

const confirm = () => {
  emit('update:modelValue', tempValue.value);
  dialogVisible.value = false;
};

const reset = () => {
  tempValue.value = [...props.modelValue];
};

const remove = (item: ApiVO) => {
  const list = props.modelValue.filter(i => i.id !== item.id);
  emit('update:modelValue', list);
};
</script>
