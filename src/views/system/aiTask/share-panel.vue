<template>
  <el-dialog v-model="visible" :title="t('sharePanel.title')" destroy-on-close append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
      <el-form-item :label="t('sharePanel.strategyTitle')" prop="title">
        <el-input v-model="form.title" :placeholder="t('sharePanel.strategyTitlePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('sharePanel.introduction')" prop="content">
        <el-input type="textarea" v-model="form.content" :placeholder="t('sharePanel.introductionPlaceholder')" />
      </el-form-item>

      <el-form-item :label="t('sharePanel.strategyTags')" prop="tempTags">
        <el-select v-model="form.tempTags" multiple :placeholder="t('sharePanel.selectTags')" :multiple-limit="3">
          <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <p>{{ t('sharePanel.notice') }}</p>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">{{ t('sharePanel.cancel') }}</el-button>
      <el-button @click="handleStop" v-if="form.id" type="danger">{{ t('sharePanel.cancelShare') }}</el-button>
      <el-button @click="handleUpdate" v-if="form.id" type="primary">{{ t('sharePanel.updateShare') }}</el-button>
      <el-button type="primary" v-else @click="handleSubmit">{{ t('sharePanel.share') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { addFeed, stopFeed, updateFeed } from '@/api/system/feed';
import { FeedForm, FeedVO } from '@/api/system/feed/types';

const { t } = useI18n();

// 定义用于 el-select 绑定的临时数组
const tempTags = ref<string[]>([]);
const visible = ref(false);

const formRef = ref<any>(null); // 使用 any 或正确的 ElFormType
let form = reactive<FeedForm>({
  strategyId: null,
  title: '',
  tags: '',
  tempTags: []
});

const props = defineProps({
  strategyId: {
    type: Number,
    required: true
  }
});
const emits = defineEmits(['shared']);

const tagOptions = ['合约', 'AI策略', '热门', '稳健型', '对冲型'];

// 校验规则：tags 字段实际是校验 tempTags 数组
const rules = {
  strategy_id: [{ required: true, message: t('sharePanel.rule.tags'), trigger: 'blur' }],
  title: [
    { required: true, message: t('sharePanel.rule.title'), trigger: 'blur' },
    { min: 4, max: 12, message: t('sharePanel.rule.titleLength'), trigger: 'blur' }
  ],
  content: [
    { required: true, message: t('sharePanel.rule.content'), trigger: 'blur' },
    { min: 4, max: 200, message: t('sharePanel.rule.contentLength'), trigger: 'blur' }
  ],
  // 将 tags 校验配置为数组类型，Element Plus 会自动应用到绑定的值（即 tempTags）
  tempTags: [{ type: 'array', required: true, message: t('sharePanel.rule.tags'), trigger: 'change' }],
  profit_3m: [{ required: true, message: '请填写收益', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

function open(record?: FeedVO) {
  visible.value = true;
  // 重置表单状态，防止残留
  if (formRef.value) {
    formRef.value.resetFields();
  }

  // 清空 tempTags
  form.tempTags = [];

  if (record) {
    // 假设 record 结构与 form 匹配，且 record.tags 是逗号字符串
    Object.assign(form, record);

    // 【数据回显处理】将 tags 字符串转换为数组，赋值给 tempTags
    if (record.tags && typeof record.tags === 'string') {
      form.tempTags = record.tags.split(',').filter((tag: string) => tag.trim().length > 0);
    }
  }
}

async function handleStop() {
  await stopFeed(form.id);
  ElMessage.success(t('common.opt.stop'));
  visible.value = false;
  form = {};
  emits('shared');
}

async function handleUpdate() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    form.tags = form.tempTags.join(',');

    form.strategyId = props.strategyId;

    if (!form.id) {
      ElMessage.error('ID缺失，无法更新');
      return;
    }

    try {
      await updateFeed(form);
      ElMessage.success('更新成功');
      visible.value = false;
      form = {};
      emits('shared');
    } catch (error) {
      ElMessage.error('更新失败');
      console.error(error);
    }
  });
}

async function handleSubmit() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;

    form.tags = form.tempTags.join(',');

    form.strategyId = props.strategyId;

    if (!form.strategyId) {
      ElMessage.error('策略ID缺失，无法分享');
      return;
    }

    try {
      await addFeed(form);
      ElMessage.success('分享成功');
      visible.value = false;
      form = {};
      emits('shared');
    } catch (error) {
      ElMessage.error('分享失败');
      console.error(error);
    }
  });
}

defineExpose({ open });
</script>

<style scoped>
/* 样式保持不变 */
</style>
