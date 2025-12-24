<template>
  <el-dialog v-model="visible" :title="title" append-to-body destroy-on-close custom-class="mobile-dialog">
    <el-form ref="aiTaskFormRef" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-tabs v-model="activeTab">
        <!-- ========== 基础配置 ========== -->
        <el-tab-pane name="basic" :label="t('aiTask.basicConfig')">
          <!-- 你原来的 basic tab 内容 -->
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
              <el-popover :title="t('aiTask.timeGranularityPopoverTitle')" :content="t('aiTask.timeGranularityPopoverContent')" placement="top-start">
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

        <!-- ========== 账户 ========== -->
        <el-tab-pane name="account" :label="t('aiTask.accountSelect')">
          <el-form-item label="" label-width="0" prop="apiId">
            <el-card title="A" class="w-full" shadow="hover">
              <div class="flex justify-between w-full">
                <div class="flex gap-x-2 flex-col">
                  <ExchangeLogo :exchange="form.exchange" :key="form.exchange"> </ExchangeLogo>
                  <div>
                    <dict-tag
                      v-if="form.account?.type"
                      :value="form.account?.type"
                      :options="exchange_api_type"
                      i18n-profilx="accountSelect.apiStatus"
                    />
                  </div>
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

        <!-- ========== 系统提示词 ========== -->
        <el-tab-pane name="system" :label="t('aiTask.systemPrompt')">
          <!-- system -->
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
              <el-button @click="replaceSystemPrompt('system3')">{{ t('aiTask.preset3') }}</el-button>
            </div>
            <div>
              <p>
                {{ t('aiTask.presetWarning') }}
              </p>
            </div>
          </el-form-item>
        </el-tab-pane>

        <!-- ========== 用户提示词 ========== -->
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

        <!-- ========== 自定义指标 ========== -->
        <el-tab-pane name="detailSetting" :label="t('aiTask.diy.metrics')">
          <!-- SmartSelectSchema + DynamicIndicatorConfig -->
          <el-form-item
            prop="extConfigValidate"
            label-position="top"
            :label="t('aiTask.diy.defaultOptions')"
            :key="form.id ? form.id : new Date().getTime()"
            :rules="[{ validator: validateExtConfig, trigger: 'change' }]"
            ><div>
              <SmartSelectSchema
                v-model="form.extConfig.defaultOptions"
                :options="options"
                label-key="name"
                value-key="type"
                multiple
                :form-schema="schema"
                :dialog-title="t('aiTask.diy.metricsItem')"
                class="w-full"
                @create="handleCreate"
                @update:modelValue="aiTaskFormRef?.validateField('extConfigValidate')"
              />
              <DynamicIndicatorConfig
                v-model="form.extConfig.modify"
                :schema="schema"
                class="mt5"
                @update:modelValue="aiTaskFormRef?.validateField('extConfigValidate')"
              />
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <slot name="footer" :form="form" :activeTab="activeTab" :nextForm="nextForm"></slot>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="nextForm" v-if="activeTab != 'detailSetting'">{{
          t('aiTask.nextStep')
        }}</el-button>
        <el-button :loading="buttonLoading" type="primary" v-else @click="submitForm">{{ t('aiTask.confirm') }}</el-button>
        <el-button @click="cancel">{{ t('aiTask.cancel') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { listAiTask, getAiTask, delAiTask, addAiTask, updateAiTask, stopTask, startTask, getModifyConfig } from '@/api/system/aiTask';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
import { loadDefaultTemplate } from '@/views/system/aiTask/default';
import { isLongTermGreater, isShortTermSmaller, termIntervalList } from '@/views/system/aiTask/default';
import { ref, watch } from 'vue';
import { ElForm, ElOption, ElSelect } from 'element-plus';
import { useI18n } from 'vue-i18n';
import AiConfigSelector from '@/views/system/aiTask/AiConfigSelector.vue';

import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { getSupportExchange } from '@/api/system/common/common';
import { ExchangeVo } from '@/api/system/common/types';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';

import { AiTaskForm, AiTaskVO } from '@/api/system/aiTask/types';
import UserPromptDefault from '@/views/system/aiTask/UserPromptDefault.vue';

const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  title: string;
  formData: AiTaskForm;
  rules: any;
  type: 'add' | 'edit';
}>();
const aiTaskFormRef = ref<ElFormInstance>();
const emit = defineEmits(['update:modelValue', 'reload']);
const { exchange_api_type } = toRefs<any>(proxy?.useDict('exchange_api_type'));
const visible = ref(false);
const activeTab = ref('basic');
const loading = ref(false);
const validateExtConfig = (_: any, _value: any, callback: any) => {
  const defaults = form.value.extConfig.defaultOptions;
  const modifies = form.value.extConfig.modify;
  console.log('validateExtConfig=', defaults, modifies);

  if (!Array.isArray(defaults) || defaults.length === 0) {
    return callback(new Error('请至少选择一个预设行情指标'));
  }

  // if (!Array.isArray(modifies) || modifies.length === 0) {
  //   return callback(new Error('请至少新增一个指标配置'));
  // }

  if ((!defaults || defaults.length == 0) && (!modifies || modifies.length == 0)) {
    return callback(new Error('自定义指标与预设指标不能同时为空'));
  }
  const limitConfigCount = 3;
  const total = (defaults?.length || 0) + (modifies?.length || 0);
  if (total < limitConfigCount) {
    return callback(new Error(`指标数量不能低于${limitConfigCount}个`));
  }
  callback();
};

const options = ref<SelectItem[]>([
  // { type: 'EMA20', name: 'EMA indicators (20‑period)' },
  // { type: 'MACD', name: 'MACD' },
  // { type: 'RSI7', name: 'RSI indicators (7‑Period)' },
  // { type: 'RSI14', name: 'RSI indicators (14‑Period)' }
] as SelectItem[]);

const schema = ref({} as FormSchemaItem);
console.log('schema', JSON.stringify(schema));
const handleCreate = (item: SelectItem) => {
  options.value.push(item);
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

  userPrompt: 'user',
  'extConfig.default': 'detailSetting'
};
const steps = ['basic', 'account', 'system', 'user', 'detailSetting'];

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
// 本地表单副本（避免直接改父组件）
const form = ref<AiTaskForm>(initFormData);

watch(
  () => props.modelValue,
  (val) => {
    console.log('aitask dialog props.modelValue =', val, props.type);
    visible.value = val;
    if (val) {
      activeTab.value = 'basic';
      if (props.type === 'edit') {
        form.value = JSON.parse(JSON.stringify(props.formData));
      } else {
        form.value = initFormData;
      }
    } else {
      form.value = initFormData;
    }
  },
  { immediate: true, deep: true }
);

watch(visible, (val) => {
  emit('update:modelValue', val);
});

const nextForm = () => {
  const currentStep = steps.indexOf(activeTab.value);
  if (currentStep < steps.length - 1) {
    activeTab.value = steps[currentStep + 1];
  }
};

const close = () => {
  visible.value = false;
};

const onErrorField = (firstField: string) => {
  // 判断该字段位于哪个 tab 中
  const tabName = fieldTabMap[firstField];

  if (tabName) {
    activeTab.value = tabName; // 自动切换 tab
  }

  console.warn('校验失败字段:', firstField, '所属Tab:', tabName);
};

const resetFields = () => {
  aiTaskFormRef.value?.resetFields();
};
const buttonLoading = ref(false);

/** 提交按钮 */
const submitForm = async () => {
  console.log(form.value);
  const b = await aiTaskFormRef.value?.validateField('extConfigValidate');
  if (!b) {
    return;
  }
  aiTaskFormRef.value?.validate(async (valid: boolean, fields) => {
    if (valid) {
      buttonLoading.value = true;
      const data = { ...form.value };
      data.extConfig = JSON.stringify(data.extConfig);
      if (form.value.id) {
        await updateAiTask(data).finally(() => (buttonLoading.value = false));
      } else {
        await addAiTask(data).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess(t('aiTask.message.success'));
      visible.value = false;
      emit('reload');
    } else {
      // 获取第一个报错的字段名
      const firstField = Object.keys(fields)[0];
      onErrorField(firstField);
    }
  });
};

/** 取消按钮 */
const cancel = () => {
  emit('update:modelValue', false);
};

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

const loadTaskModify = async () => {
  const modifyConfig = await getModifyConfig();
  console.log(modifyConfig.data);
  const parse = JSON.parse(modifyConfig.data);

  options.value = parse['defualtUserPrompt'];
  schema.value = parse['modifyPrompt'];
  if (!form.value.extConfig) {
    form.value.extConfig = {
      defaultOptions: [],
      modify: []
    };
  }
  form.value.extConfig.defaultOptions = options.value;
  console.log(modifyConfig);
};

const setDefaultConfig = async () => {
  if (!form.value.extConfig) {
    form.value.extConfig = {
      defaultOptions: [],
      modify: []
    };
  }
  form.value.extConfig.defaultOptions = options.value;
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
interface Mark {
  style: CSSProperties;
  label: string;
}

const fetchExchangeData = async (exchangeName) => {
  loading.value = true;
  const response = await queryLinerSymbolsByEx(exchangeName);
  console.log(response);
  loading.value = false;
  return response.data;
};

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

onMounted(async () => {
  console.log('aiTaskDialog onMounted');
  await loadTaskModify();

  await loadExchange();
});
defineExpose({ onErrorField, resetFields, setDefaultConfig });
</script>
<style lang="scss" scoped>
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
