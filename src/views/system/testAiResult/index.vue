<template>
  <div class="p-0">
    <el-card shadow="never" v-loading="loading">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" :search="false" @queryTable="handleQuery"></right-toolbar>
        </el-row>
      </template>
      <div v-loading="loading">
        <AiCardList :test-ai-result-list="testAiResultList" v-if="testAiResultList.length > 0"></AiCardList>
        <el-empty v-else></el-empty>
      </div>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
  </div>
</template>

<script setup name="TestAiResult" lang="ts">
import { listTestAiResult, getTestAiResult, delTestAiResult, addTestAiResult, updateTestAiResult } from '@/api/system/testAiResult';
import { TestAiResultVO, TestAiResultQuery, TestAiResultForm } from '@/api/system/testAiResult/types';
import AiCardList from '@/views/system/testAiResult/AiCardList.vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const testAiResultList = ref<TestAiResultVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const testAiResultFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const props = defineProps({
  taskId: {
    type: String,
    default: ''
  }
});
const initFormData: TestAiResultForm = {
  id: undefined,
  action: undefined,
  leverage: undefined,
  size: undefined,
  symbol: undefined,
  takeProfit: undefined,
  stopLoss: undefined,
  reasoningEn: undefined,
  reasoningZh: undefined
};
const data = reactive<PageData<TestAiResultForm, TestAiResultQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    action: undefined,
    leverage: undefined,
    size: undefined,
    symbol: undefined,
    takeProfit: undefined,
    stopLoss: undefined,
    reasoningEn: undefined,
    reasoningZh: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const handleQuery = async () => {
  loading.value = true;
  try {
    queryParams.value.pageNum = 1;
    await getList();
  } finally {
    loading.value = false;
  }
};
/** 查询AI 操作日志列表 */
const getList = async (showLoading = false) => {
  if (showLoading) {
    loading.value = true;
  }

  if (props.taskId) {
    queryParams.value.taskId = props.taskId;
  }
  const res = await listTestAiResult(queryParams.value);
  testAiResultList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  testAiResultFormRef.value?.resetFields();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/testAiResult/export',
    {
      ...queryParams.value
    },
    `testAiResult_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
defineExpose({
  getList
});
</script>
