<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <!--            <el-form-item :label="t('aiTask.taskName')" prop="name">-->
            <el-form-item prop="name">
              <el-input v-model="queryParams.name" :placeholder="t('aiTask.taskNamePlaceholder')" clearable @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">{{ t('aiTask.search') }}</el-button>
              <el-button icon="Refresh" @click="resetQuery">{{ t('aiTask.reset') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" v-loading="loading">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:aiTask:add']">{{ t('aiTask.createTask') }}</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 卡片列表 -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5" :style="{ color: 'var(--el-text-color)' }">
        <TaskItem
          v-for="item in aiTaskList"
          :key="item.id"
          :item="item"
          @update="handleUpdate"
          @delete="handleDelete"
          @start="handleStart"
          @stop="handleStop"
          @shared="getList"
        ></TaskItem>
      </div>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <AiTaskDialog ref="taskDialog" :type="optType" @reload="getList" v-model="dialog.visible" :title="dialog.title" :form-data="form" :rules="rules">
    </AiTaskDialog>
  </div>
</template>

<script setup name="AiTask" lang="ts">
import { useI18n } from 'vue-i18n';
import { listAiTask, getAiTask, delAiTask, addAiTask, updateAiTask, stopTask, startTask, getModifyConfig } from '@/api/system/aiTask';
import { AiTaskVO, AiTaskQuery, AiTaskForm } from '@/api/system/aiTask/types';
import { ElOption, ElSelect, TabsInstance } from 'element-plus';
import { isLongTermGreater, isShortTermSmaller, termIntervalList } from '@/views/system/aiTask/default';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ai_task_status } = toRefs<any>(proxy?.useDict('ai_task_status'));

const aiTaskList = ref<AiTaskVO[]>([]);

const optType = ref<'add' | 'edit'>('add');
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

import { CSSProperties } from 'vue';
import TaskItem from '@/views/system/aiTask/TaskItem.vue';
import { FormSchemaItem, SelectItem } from '@/components/SmartSelectSchema/type';
import AiTaskDialog from '@/views/system/aiTask/AiTaskDialog.vue';
const checkLongInterval = (rule, value, callback) => {
  if (!isLongTermGreater(form.value.shortTermInterval, form.value.longTermInterval)) {
    callback(new Error(t('aiTask.rule.longTermInterval')));
  } else {
    callback();
  }
};
const checkShortInterval = (rule, value, callback) => {
  if (!isShortTermSmaller(form.value.shortTermInterval, form.value.longTermInterval)) {
    callback(new Error(t('aiTask.rule.shortTermInterval')));
  } else {
    callback();
  }
};

const taskDialog = useTemplateRef('taskDialog');

const initFormData: AiTaskForm = {
  id: undefined,
  name: undefined,
  symbols: undefined,
  exchange: undefined,
  apiId: undefined,
  startBalance: undefined,
  totalBalance: undefined,
  aiWorkflowId: undefined,
  systemPrompt: undefined,
  userPrompt: undefined,
  createUserId: undefined,
  status: undefined,
  interval: undefined,
  account: undefined,
  leverage: [1, 3],
  leverageMin: undefined,
  leverageMax: undefined,
  shortTermInterval: '1m',
  longTermInterval: '4H',
  extConfig: {
    defaultOptions: [],
    modify: []
  }
};
const data = reactive<PageData<AiTaskForm, AiTaskQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    symbols: undefined,
    startBalance: undefined,
    totalBalance: undefined,
    aiWorkflowId: undefined,
    systemPrompt: undefined,
    userPrompt: undefined,
    createUserId: undefined,
    status: undefined,
    interval: undefined,

    params: {}
  },
  rules: {
    name: [{ required: true, message: t('aiTask.rule.taskName'), trigger: 'blur' }],
    exchange: [{ required: true, message: t('aiTask.rule.exchange'), trigger: 'blur' }],
    symbols: [{ required: true, message: t('aiTask.rule.symbols'), trigger: 'blur' }],
    aiWorkflowId: [{ required: true, message: t('aiTask.rule.aiAgent'), trigger: 'blur' }],
    interval: [{ required: true, message: t('aiTask.rule.timeGranularity'), trigger: 'blur' }],
    apiId: [{ required: true, message: t('aiTask.rule.apiId'), trigger: 'blur' }],
    systemPrompt: [{ required: true, message: t('aiTask.rule.systemPrompt'), trigger: 'blur' }],
    leverage: [{ required: true, message: t('aiTask.rule.leverage'), trigger: 'blur' }],
    longTermInterval: [{ required: true, validator: checkLongInterval, trigger: 'change' }],
    shortTermInterval: [{ required: true, validator: checkShortInterval, trigger: 'change' }],
    startBalance: [
      { required: true, message: t('aiTask.rule.initialBalance'), trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (Number(value) < 10) {
            callback(new Error(t('aiTask.rule.initialBalanceLessThan10')));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    'extConfig.default': [
      {
        validator: (_, value, callback) => {
          if (value.length == 0) {
            callback(new Error(t('aiTask.rule.defaultStrategy')));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ]
  }
});

const tabPosition = ref<TabsInstance['tabPosition']>('top');
const { queryParams, form, rules } = toRefs(data);

/** 查询AI任务列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAiTask(queryParams.value);
  aiTaskList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  taskDialog.value?.setDefaultConfig();
  taskDialog.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: AiTaskVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  optType.value = 'add';
  dialog.visible = true;
  dialog.title = t('aiTask.createTask');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AiTaskVO) => {
  reset();
  optType.value = 'edit';
  const _id = row?.id || ids.value[0];
  const res = await getAiTask(_id);
  Object.assign(form.value, res.data);
  if (!form.value.extConfig) {
    form.value.extConfig = {
      defaultOptions: [],
      modify: []
    };
  } else {
    form.value.extConfig = JSON.parse(form.value.extConfig);
  }

  console.log('form', form.value);
  dialog.visible = true;
  dialog.title = t('aiTask.modifyTask');
};
/** 修改按钮操作 */
const handleStop = async (row?: AiTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await stopTask(_id);
  ElMessage.success(res.msg);
  getList();
};
/** 修改按钮操作 */
const handleStart = async (row?: AiTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await startTask(_id);
  ElMessage.success(res.msg);
  getList();
};

/** 删除按钮操作 */
const handleDelete = async (row?: AiTaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(t('aiTask.message.deleteConfirm', { id: _ids })).finally(() => (loading.value = false));
  await delAiTask(_ids);
  proxy?.$modal.msgSuccess(t('aiTask.message.deleteSuccess'));
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/aiTask/export',
    {
      ...queryParams.value
    },
    `aiTask_${new Date().getTime()}.xlsx`
  );
};
onMounted(async () => {
  await getList();
});
</script>
<style scoped lang="scss">
.interval-scroll {
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 4px; /* 防止滚动条遮挡内容 */

  /* 默认隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
}
.interval-scroll::-webkit-scrollbar {
  height: 6px;
  display: none; /* Chrome 默认隐藏 */
}

/* 鼠标移入时显示滚动条 */
.interval-scroll:hover::-webkit-scrollbar {
  display: block;
}
.interval-scroll:hover {
  scrollbar-width: thin; /* Firefox */
}
</style>
