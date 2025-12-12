<template>
  <el-dialog v-model="visible" title="分享策略到策略广场" destroy-on-close append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="策略标题" prop="title">
        <el-input v-model="form.title" placeholder="取一个显眼的名字吧" />
      </el-form-item>
      <el-form-item label="简介" prop="content">
        <el-input type="textarea" v-model="form.content" placeholder="介绍一下您的策略内容吧" />
      </el-form-item>

      <el-form-item label="策略标签" prop="tempTags">
        <el-select v-model="form.tempTags" multiple placeholder="请选择标签" :multiple-limit="3">
          <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <p>分享至策略广场不会公开您的提示词或者任何配置,仅仅展示您API 的盈亏曲线</p>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="handleStop" v-if="form.id" type="danger">取消分享</el-button>
      <el-button @click="handleUpdate" v-if="form.id" type="primary">更新分享</el-button>
      <el-button type="primary" v-else @click="handleSubmit">分享</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
import { addFeed, stopFeed, updateFeed } from '@/api/system/feed';
import { FeedForm, FeedVO } from '@/api/system/feed/types';

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
  strategy_id: [{ required: true, message: '请输入策略ID', trigger: 'blur' }],
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 4, max: 12, message: '标题长度 4~12 字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '简介不能为空', trigger: 'blur' },
    { min: 4, max: 200, message: '简介长度 4~200 字符', trigger: 'blur' }
  ],
  // 将 tags 校验配置为数组类型，Element Plus 会自动应用到绑定的值（即 tempTags）
  tempTags: [{ type: 'array', required: true, message: '至少选择一个标签', trigger: 'change' }],
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
  ElMessage.success('取消成功');
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
