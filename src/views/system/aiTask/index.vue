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

    <!-- 添加或修改AI任务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" append-to-body custom-class="mobile-dialog">
      <el-form ref="aiTaskFormRef" :model="form" :rules="rules" label-width="80px" label-position="top">
        <el-tabs v-model="activeTab" :tab-position="tabPosition" style="width: 100%" class="demo-tabs">
          <el-tab-pane name="basic" :label="t('aiTask.basicConfig')">
            <el-form-item :label="t('aiTask.taskName')" prop="name">
              <el-input v-model="form.name" :placeholder="t('aiTask.taskNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('aiTask.exchange')" prop="exchange">
              <el-select v-model="form.exchange" :placeholder="t('aiTask.selectExchange')" @change="onExchange($event)" prop="exchangeA">
                <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name">
                  <div class="flex justify-between flex-row">
                    <ExchangeLogo :exchange="exchange.name" />
                  </div>
                </el-option>
                <template #label="{ value }">
                  <ExchangeLogo :exchange="value" />
                </template>
              </el-select>
            </el-form-item>
            <el-form-item :label="t('aiTask.coins')" prop="symbols">
              <template #label>
                <el-popover :title="t('aiTask.coinsPopoverTitle')" :content="t('aiTask.coinsPopoverContent')" placement="top-start">
                  <template #reference>
                    <span>{{ t('aiTask.coins') }}</span>
                  </template>
                </el-popover>
              </template>
              <el-select
                v-model="symbolsArr"
                multiple
                clearable
                :placeholder="t('aiTask.selectCoins')"
                style="width: 100%"
                filterable
                @focus="onExchange(form.exchange)"
              >
                <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.coin" :value="symbol.coin" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('aiTask.initialBalance')" prop="startBalance">
              <template #label>
                <el-popover :title="t('aiTask.initialBalancePopoverTitle')" :content="t('aiTask.initialBalancePopoverContent')" placement="top-start">
                  <template #reference>
                    <span>{{ t('aiTask.initialBalance') }}</span>
                  </template>
                </el-popover>
              </template>
              <el-input v-model="form.startBalance" type="number" :step="0.01" :min="10" :placeholder="t('aiTask.initialBalance')">
                <template #append>{{ t('aiTask.usdt') }}</template>
              </el-input>
            </el-form-item>
            <el-form-item :label="t('aiTask.aiAgent')" prop="aiWorkflowId">
              <AiConfigSelector v-model="form.aiWorkflowId" :type="1"></AiConfigSelector>
            </el-form-item>
            <el-form-item :label="t('aiTask.timeGranularity')" prop="interval">
              <template #label>
                <el-popover
                  :title="t('aiTask.timeGranularityPopoverTitle')"
                  :content="t('aiTask.timeGranularityPopoverContent')"
                  placement="top-start"
                >
                  <template #reference>
                    <span>{{ t('aiTask.timeGranularity') }}</span>
                  </template>
                </el-popover>
              </template>
              <div class="interval-scroll flex items-center gap-1">
                <el-radio-group v-model="form.interval" size="small">
                  <div class="inline-flex gap-0">
                    <el-radio border label="5m" value="5m" />
                    <el-radio border label="8m" value="8m" />
                    <el-radio border label="10m" value="10m" />
                    <el-radio border label="12m" value="12m" />
                    <el-radio border label="14m" value="14m" />
                    <el-radio border label="15m" value="15m" />
                    <el-radio border label="20m" value="20m" />
                    <el-radio border label="30m" value="30m" />
                    <el-radio border label="40m" value="40m" />
                    <el-radio border label="50m" value="50m" />
                    <el-radio border label="60m" value="60m" />
                  </div>
                </el-radio-group>
              </div>
            </el-form-item>
            <el-form-item :label="t('aiTask.leverage')" prop="leverage">
              <div style="width: 50%">
                <el-slider v-model="leverageValue" range :marks="marks" :min="1" :max="20" />
              </div>
            </el-form-item>

            <div class="mt-5 pt-5">
              <el-form-item :label="t('aiTask.shortTermIndicator')" prop="shortTermInterval">
                <template #label>
                  <el-popover
                    :title="t('aiTask.shortTermIndicatorPopoverTitle')"
                    :content="t('aiTask.shortTermIndicatorPopoverContent')"
                    placement="top-start"
                  >
                    <template #reference>
                      <span>{{ t('aiTask.shortTermIndicator') }}</span>
                    </template>
                  </el-popover>
                </template>
                <div class="interval-scroll flex items-center gap-1">
                  <el-radio-group v-model="form.shortTermInterval" size="small">
                    <div class="inline-flex gap-0">
                      <el-radio border :value="item.value" v-for="(item, index) in termIntervalList()" :key="index">
                        {{ item.name }}
                      </el-radio>
                    </div>
                  </el-radio-group>
                </div>
              </el-form-item>
              <el-form-item :label="t('aiTask.longTermIndicator')" prop="longTermInterval">
                <template #label>
                  <el-popover
                    :title="t('aiTask.longTermIndicatorPopoverTitle')"
                    :content="t('aiTask.longTermIndicatorPopoverContent')"
                    placement="top-start"
                  >
                    <template #reference>
                      <span>{{ t('aiTask.longTermIndicator') }}</span>
                    </template>
                  </el-popover>
                </template>
                <div class="interval-scroll flex items-center gap-1">
                  <el-radio-group v-model="form.longTermInterval" size="small">
                    <div class="inline-flex gap-0">
                      <el-radio border :value="item.value" v-for="(item, index) in termIntervalList()" :key="index">
                        {{ item.name }}
                      </el-radio>
                    </div>
                  </el-radio-group>
                </div>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane name="account" :label="t('aiTask.accountSelect')">
            <el-form-item label="" label-width="0" prop="apiId">
              <el-card title="A" class="w-full" shadow="hover">
                <div class="flex justify-between w-full">
                  <div class="flex gap-x-2 flex-col">
                    <ExchangeLogo :exchange="form.exchange" :key="form.exchange"> </ExchangeLogo>
                    <div><dict-tag :value="form.account?.type" :options="exchange_api_type" /></div>
                  </div>
                  <div class="flex justify-end hover:cursor-pointer text-xs" @click="openAccountSelect">
                    <div>{{ form.account?.name || '-' }}</div>

                    <img src="@/assets/icons/png/switch.png" height="18" width="18" v-if="form.account" />
                    <div class="color-#409EFF" v-else>{{ t('aiTask.selectAccount') }}</div>
                    <AccountSelectDialog
                      v-model:visible="showAccountSelect"
                      :exchange-name="form.exchange"
                      @select="selectAccount($event)"
                    ></AccountSelectDialog>
                  </div>
                </div>
              </el-card>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="system" :label="t('aiTask.systemPrompt')">
            <el-form-item label-width="0" prop="systemPrompt">
              <el-input
                v-model="form.systemPrompt"
                type="textarea"
                :placeholder="t('aiTask.systemPromptPlaceholder')"
                :autosize="{ minRows: 24 }"
                :maxlength="20000"
                show-word-limit
              />
              <div>
                <el-button @click="replaceSystemPrompt('system1')">{{ t('aiTask.preset1') }}</el-button>
                <el-button @click="replaceSystemPrompt('system2')">{{ t('aiTask.preset2') }}</el-button>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="user" :label="t('aiTask.userPrompt')">
            <el-form-item prop="userPrompt" label-width="0">
              <el-input
                v-model="form.userPrompt"
                type="textarea"
                :placeholder="t('aiTask.userPromptPlaceholder')"
                :autosize="{ minRows: 24 }"
                :maxlength="5000"
                show-word-limit
              />
              <div>
                <div>{{ t('aiTask.exampleContent') }}</div>
                <div><UserPromptDefault></UserPromptDefault></div>
              </div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="nextForm" v-if="activeTab != 'user'">{{ t('aiTask.nextStep') }}</el-button>
          <el-button :loading="buttonLoading" type="primary" v-else @click="submitForm">{{ t('aiTask.confirm') }}</el-button>
          <el-button @click="cancel">{{ t('aiTask.cancel') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AiTask" lang="ts">
import { useI18n } from 'vue-i18n';
import { listAiTask, getAiTask, delAiTask, addAiTask, updateAiTask, stopTask, startTask } from '@/api/system/aiTask';
import { AiTaskVO, AiTaskQuery, AiTaskForm } from '@/api/system/aiTask/types';
import AiConfigSelector from '@/views/system/aiTask/AiConfigSelector.vue';
import { ElOption, ElSelect, TabsInstance } from 'element-plus';
import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { getSupportExchange } from '@/api/system/common/common';
import { ExchangeVo } from '@/api/system/common/types';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { isLongTermGreater, isShortTermSmaller, termIntervalList } from '@/views/system/aiTask/default';
import { loadDefaultTemplate } from '@/views/system/aiTask/default';
import UserPromptDefault from '@/views/system/aiTask/UserPromptDefault.vue';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ai_task_status } = toRefs<any>(proxy?.useDict('ai_task_status'));

const aiTaskList = ref<AiTaskVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const { exchange_api_type } = toRefs<any>(proxy?.useDict('exchange_api_type'));
const queryFormRef = ref<ElFormInstance>();
const aiTaskFormRef = ref<ElFormInstance>();
const activeTab = ref('basic');
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

import { CSSProperties } from 'vue';
import TaskItem from '@/views/system/aiTask/TaskItem.vue';
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

const fieldTabMap: Record<string, string> = {
  name: 'basic',
  exchange: 'basic',
  symbols: 'basic',
  startBalance: 'basic',
  aiWorkflowId: 'basic',
  interval: 'basic',

  apiId: 'account',

  systemPrompt: 'system',

  userPrompt: 'user'
};
const steps = ['basic', 'account', 'system', 'user'];
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
  longTermInterval: '4H'
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
    ]
  }
});

const tabPosition = ref<TabsInstance['tabPosition']>('top');
const { queryParams, form, rules } = toRefs(data);
interface Mark {
  style: CSSProperties;
  label: string;
}
type Marks = Record<number, Mark | string>;
const marks = reactive<Marks>({
  1: '1x',
  3: '3x',
  5: '5x',
  10: {
    style: {
      color: '#E6A23C'
    },
    label: '10x'
  },
  20: {
    style: {
      color: '#F56C6C'
    },
    label: '20x'
  }
});

const selectAccount = (account: ApiVO) => {
  console.log(account);
  const deSecAccount = {
    id: account.id,
    name: account.name,
    type: account.type
  } as ApiVO;
  form.value.apiId = account.id;
  form.value.account = deSecAccount;
};

const replaceSystemPrompt = (type: string) => {
  form.value.systemPrompt = loadDefaultTemplate(type);
};

/** 查询AI任务列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAiTask(queryParams.value);
  aiTaskList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};
const symbolsArr = computed({
  get() {
    if (!form.value.symbols) return [];
    return form.value.symbols.split(','); // 回显
  },
  set(val) {
    form.value.symbols = val.join(','); // 选中时拼接
  }
});
const leverageValue = computed({
  get() {
    if (!form.value.leverageMin && !form.value.leverageMax) return [3, 20];
    return [form.value.leverageMin, form.value.leverageMax]; // 回显
  },
  set(val) {
    if (val && val.length == 2) {
      form.value.leverageMin = val[0];
      form.value.leverageMax = val[1];
      form.value.leverage = val;
    }
  }
});
// 交易所列表
const supportExchangeList = ref<ExchangeVo[]>([]);
const loadExchange = async () => {
  loading.value = true;
  // loading.value = true;
  try {
    const res = await getSupportExchange();

    // console.log(res);
    if (res.code == 200) {
      supportExchangeList.value = res.data;
    } else {
      const msg = res.msg;
      ElMessage.error(msg);
    }
  } finally {
    loading.value = false;
  }

  // loading.value = false;
};
const showAccountSelect = ref<boolean>(false);

const openAccountSelect = () => {
  if (form.value.exchange) {
    showAccountSelect.value = true;
  } else {
    ElMessage.error(t('aiTask.message.selectExchangeFirst'));
  }
};
const filteredSymbols = ref<LinerSymbol[]>();

// 处理选择交易所的函数
const onExchange = async (exchangeName) => {
  if (!exchangeName) {
    return;
  }
  form.value.exchange = exchangeName;
  // 如果没有加载过，则请求后台加载
  try {
    loading.value = true;
    try {
      const data = await fetchExchangeData(exchangeName);
      filteredSymbols.value = data;
    } finally {
      loading.value = false;
    }

    // 标记该交易所已加载
    // loadedExchanges.value.add(exchangeName);
    // console.success(data); // 显示加载成功的信息
  } catch (error) {
    console.error(`LoadError: ${error}`);
  }
};

const fetchExchangeData = async (exchangeName) => {
  loading.value = true;
  const response = await queryLinerSymbolsByEx(exchangeName);
  console.log(response);
  loading.value = false;
  return response.data;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  aiTaskFormRef.value?.resetFields();
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
  dialog.visible = true;
  dialog.title = t('aiTask.createTask');
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AiTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAiTask(_id);
  Object.assign(form.value, res.data);
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
const nextForm = () => {
  const currentStep = steps.indexOf(activeTab.value);
  if (currentStep < steps.length - 1) {
    activeTab.value = steps[currentStep + 1];
  }
};

/** 提交按钮 */
const submitForm = () => {
  aiTaskFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateAiTask(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addAiTask(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess(t('aiTask.message.success'));
      dialog.visible = false;
      await getList();
    } else {
      // 获取第一个报错的字段名
      const firstField = Object.keys(fields)[0];

      // 判断该字段位于哪个 tab 中
      const tabName = fieldTabMap[firstField];

      if (tabName) {
        activeTab.value = tabName; // 自动切换 tab
      }

      console.warn('校验失败字段:', firstField, '所属Tab:', tabName);
    }
  });
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
onMounted(() => {
  getList();
  loadExchange();
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
