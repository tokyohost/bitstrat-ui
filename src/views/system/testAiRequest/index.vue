<template>
  <div class="p-0">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar v-model:showSearch="showSearch" :search="false" @queryTable="userRefush">
            <template #btn>
              <el-tooltip
                class="item"
                effect="dark"
                :content="t('testAiRequest.invokeRequest')"
                placement="top"
                v-hasPermi="['system:aiTask:invoke']"
              >
                <el-button circle icon="CaretRight" @click="invokeRequest()" />
              </el-tooltip>
            </template>
          </right-toolbar>
        </el-row>
      </template>
      <div v-loading="loading">
        <AiRequestCardList :list="testAiRequestList" @view="handleView" v-if="testAiRequestList.length > 0"></AiRequestCardList>
        <el-empty v-else :description="t('testAiRequest.noData')"></el-empty>
      </div>

      <pagination
        :auto-scroll="false"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="loadList"
      />
    </el-card>

    <!-- 查看AI请求详情对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="80%" append-to-body>
      <el-form ref="testAiRequestFormRef" :model="form" :rules="rules" label-width="80px" label-position="top">
        <el-form-item :label="t('testAiRequest.requestKey')" prop="requestKey">
          <el-input v-model="form.requestKey" :placeholder="t('testAiRequest.requestKey')" disabled />
        </el-form-item>
        <el-form-item :label="t('testAiRequest.systemPrompt')">
          <ShowPrompt :raw-text="form.sysContent" :previewLines="4"></ShowPrompt>
        </el-form-item>
        <el-form-item :label="t('testAiRequest.userPrompt')">
          <ShowPrompt :raw-text="form.content"></ShowPrompt>
        </el-form-item>
        <el-form-item :label="t('testAiRequest.response')">
          <ShowPrompt :raw-text="form.result"></ShowPrompt>
        </el-form-item>
        <el-form-item :label="t('testAiRequest.error')" v-if="form.errorMsg">
          <ShowPrompt :raw-text="form.errorMsg"></ShowPrompt>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">{{ t('testAiRequest.confirm') }}</el-button>
          <el-button @click="cancel">{{ t('testAiRequest.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="TestAiRequest" lang="ts">
import { useI18n } from 'vue-i18n';
import { listTestAiRequest, getTestAiRequest, delTestAiRequest, addTestAiRequest, updateTestAiRequest } from '@/api/system/testAiRequest';
import { TestAiRequestVO, TestAiRequestQuery, TestAiRequestForm } from '@/api/system/testAiRequest/types';
import ShowPrompt from '@/views/system/aiTask/ShowPrompt.vue';
import AiRequestCardList from '@/views/system/testAiRequest/AiRequestCardList.vue';
import { invokeAiTask } from '@/api/system/aiTask';
import { AiTaskForm } from '@/api/system/aiTask/types';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const testAiRequestList = ref<TestAiRequestVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const total = ref(0);
import { useChartAutoRegister } from '@/hooks/useChart';

const testAiRequestFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TestAiRequestForm = {
  id: undefined,
  requestKey: undefined,
  content: undefined
};

const data = reactive<PageData<TestAiRequestForm, TestAiRequestQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    requestKey: undefined,
    content: undefined,
    taskId: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: t('testAiRequest.rule.id'), trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const props = defineProps({
  taskId: {
    type: String,
    required: false
  }
});

/** 查询AI测试请求列表 */
const getList = async (taskId?: string) => {
  if (taskId) {
    queryParams.value.taskId = taskId;
  } else if (props.taskId) {
    queryParams.value.taskId = props.taskId;
  }
  const res = await listTestAiRequest(queryParams.value);
  testAiRequestList.value = res.rows;
  total.value = res.total;
};
const loadList = async () => {
  try {
    const res = await listTestAiRequest(queryParams.value);
    testAiRequestList.value = res.rows;
    total.value = res.total;
  } catch (error) {
    console.error('Error loading test AI request list:', error);
  } finally {
  }
};
useChartAutoRegister(getList);

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  testAiRequestFormRef.value?.resetFields();
};

/** 查看详情 */
const handleView = async (row?: TestAiRequestVO) => {
  reset();
  console.log(row);
  const _id = row?.id || ids.value[0];
  try {
    const res = await getTestAiRequest(_id);
    Object.assign(form.value, res.data);
    dialog.visible = true;
    dialog.disabled = true;
    dialog.title = t('testAiRequest.viewDetails');
  } catch (error) {
    console.error('Error loading request details:', error);
  }
};
const userRefush = async () => {
  loading.value = true;
  try {
    await getList();
  } finally {
    loading.value = false;
  }
};

/** 发起请求 */
const invokeRequest = async () => {
  if (!props.taskId) {
    ElMessage.error(t('testAiRequest.message.parameterMissing'));
    return;
  }
  buttonLoading.value = true;
  try {
    const data = {
      id: props.taskId
    } as AiTaskForm;
    const res = await invokeAiTask(data);
    if (res.code === 200) {
      ElMessage.success(t('testAiRequest.message.requestInitiated'));
    } else {
      ElMessage.error(res.msg);
    }
    await getList(props.taskId);
  } catch (error) {
    console.error('请求失败:', error);
    ElMessage.error(t('testAiRequest.message.parameterMissing'));
  } finally {
    buttonLoading.value = false;
  }
};

/** 提交按钮 */
const submitForm = () => {
  testAiRequestFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      try {
        if (form.value.id) {
          await updateTestAiRequest(form.value);
        } else {
          await addTestAiRequest(form.value);
        }
        proxy?.$modal.msgSuccess(t('testAiRequest.message.success'));
        dialog.visible = false;
        await getList(props.taskId);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        buttonLoading.value = false;
      }
    }
  });
};

onMounted(() => {
  if (props.taskId) {
    getList(props.taskId);
  }
});

defineExpose({
  getList
});
</script>
