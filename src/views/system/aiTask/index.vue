<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入任务名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:aiTask:add']">新增</el-button>
          </el-col>

          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <!-- 卡片列表 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <el-card
          v-for="item in aiTaskList"
          :key="item.id"
          class="relative p-4 rounded-xl bg-white/70 backdrop-blur shadow-sm hover:shadow-lg border border-gray-200/50 hover:(border-primary shadow-primary/30) transition-all duration-300"
        >
          <!-- 顶部：标题 + 状态 -->
          <div class="flex justify-between items-center mb-3">
            <div class="flex justify-start gap-2">
              <div class="text-lg font-bold text-gray-900">{{ item.name }}</div>
              <ExchangeLogo :exchange="item.exchange"></ExchangeLogo>
            </div>

            <dict-tag :options="ai_task_status" :value="item.status" />
          </div>

          <!-- 分隔线 -->
          <div class="h-0.5 bg-gradient-to-r from-gray-200 to-transparent mb-3"></div>

          <!-- 内容区 -->
          <div class="space-y-2 text-sm text-gray-600 leading-normal">
            <div class="flex justify-between">
              <span class="font-600">币种：</span>
              <span class="text-gray-800">{{ item.symbols }}</span>
            </div>

            <div class="flex justify-between">
              <span class="font-600">开始资金：</span>
              <span class="text-emerald-600 font-600">{{ item.startBalance }}</span>
            </div>

            <div class="flex justify-between">
              <span class="font-600">当前余额：</span>
              <span :class="item.totalBalance >= item.startBalance ? 'text-green-600 font-600' : 'text-red-500 font-600'">
                {{ item.totalBalance }}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="font-600">时间粒度：</span>
              <span>{{ item.interval }}</span>
            </div>

            <div class="flex justify-between">
              <span class="font-600">创建时间：</span>
              <span>{{ item.createTime }}</span>
            </div>
          </div>

          <!-- 底部分隔线 -->
          <div class="h-0.5 bg-gradient-to-r from-transparent to-gray-200 mt-3 mb-2"></div>

          <!-- 操作按钮 -->
          <div class="flex justify-end gap-3 mt-2">
            <el-button link @click="goAiTaskLog(item)" class="opacity-70 hover:opacity-100">查看</el-button>
            <el-button link icon="Edit" @click="handleUpdate(item)" class="opacity-70 hover:opacity-100">修改</el-button>

            <el-button v-if="item.status == 2" link icon="VideoPause" class="opacity-70 hover:opacity-100" @click="handleStop(item)">终止</el-button>

            <el-button v-if="item.status != 2" link icon="VideoPlay" class="opacity-70 hover:opacity-100" @click="handleStart(item)">启动</el-button>

            <el-button link type="danger" icon="Delete" class="opacity-70 hover:opacity-100" @click="handleDelete(item)">删除</el-button>
          </div>

          <!-- 右上角徽章（可选） -->
          <!--          <div v-if="item.status == 2" class="absolute top-3 right-3 text-xs bg-yellow-300/80 text-yellow-900 px-2 py-0.5 rounded-full">运行中</div>-->

          <!--          <div v-else class="absolute top-3 right-3 text-xs bg-gray-300/70 text-gray-700 px-2 py-0.5 rounded-full">暂停</div>-->
        </el-card>
      </div>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改AI任务对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="50%" append-to-body>
      <el-form ref="aiTaskFormRef" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeTab" :tab-position="tabPosition" style="width: 100%" class="demo-tabs">
          <el-tab-pane name="basic" label="基本配置">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入任务名称" />
            </el-form-item>
            <el-form-item label="交易所" prop="exchange">
              <el-select v-model="form.exchange" placeholder="请选择交易所" @change="onExchange($event)" prop="exchangeA">
                <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name" >
                  <div class="flex justify-between flex-row">
                    <ExchangeLogo :exchange="exchange.name" />
<!--                    <span>{{exchange.name}}</span>-->
                  </div>
                </el-option>
                <!-- 正确 label 插槽写法 -->
                <template #label="{ value }">
                  <ExchangeLogo :exchange="value" />
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="币种" prop="symbols">
              <template #label>
                <el-popover
                  title="币种"
                  content="允许AI交易的币种"
                  placement="top-start"
                >
                  <template #reference>
                    <span>币种</span>
                  </template>
                </el-popover>

              </template>
              <el-select v-model="symbolsArr" multiple clearable placeholder="请选择币种" style="width: 100%" filterable @focus="onExchange(form.exchange)">
                <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.coin" :value="symbol.coin" />
              </el-select>
            </el-form-item>
            <el-form-item label="初始资金" prop="startBalance">
              <template #label>
                <el-popover
                  title="初始金额"
                  content="让AI记住他开始交易时的成本线"
                  placement="top-start"
                >
                  <template #reference>
                    <span>初始资金</span>
                  </template>
                </el-popover>

              </template>
              <el-input v-model="form.startBalance" type="number" :step="0.01" :min="10" placeholder="请输入初始资金">
                <template #append> USDT </template>
              </el-input>
            </el-form-item>
            <el-form-item label="AI智能体" prop="aiWorkflowId">
              <!--          <el-input v-model="form.aiWorkflowId" placeholder="请输入ai 流水线id" />-->
              <AiConfigSelector v-model="form.aiWorkflowId"></AiConfigSelector>
            </el-form-item>
            <el-form-item label="时间粒度" prop="interval">
              <div class="interval-scroll flex items-center gap-1">
                <el-radio-group v-model="form.interval" size="small">
                  <div class="inline-flex gap-0">
                    <el-radio border label="5分钟" value="5m" />
                    <el-radio border label="8分钟" value="8m" />
                    <el-radio border label="10分钟" value="10m" />
                    <el-radio border label="12分钟" value="12m" />
                    <el-radio border label="14分钟" value="14m" />
                    <el-radio border label="15分钟" value="15m" />
                    <el-radio border label="20分钟" value="20m" />
                    <el-radio border label="30分钟" value="30m" />
                    <el-radio border label="40分钟" value="40m" />
                    <el-radio border label="50分钟" value="50m" />
                    <el-radio border label="60分钟" value="60m" />
                  </div>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="account" label="账号选择">
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
                    <div class="color-#409EFF" v-else>选择账户</div>
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
          <el-tab-pane name="system" label="系统提示词">
            <el-form-item label-width="0" prop="systemPrompt">
              <el-input v-model="form.systemPrompt" type="textarea" placeholder="请输入系统提示词" :autosize="{ minRows: 24 }" />
              <div>
                <el-button @click="replaceSystemPrompt('system1')">预设提示词1</el-button>
                <el-button @click="replaceSystemPrompt('system2')">预设提示词2</el-button>
              </div>
            </el-form-item>
            <div>
              <div>以下提示词作为系统执行中的数据约束以及正常运转，不支持修改:</div>
              <div><SystemPromptDefault></SystemPromptDefault></div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="user" label="用户提示词">
            <el-form-item prop="userPrompt" label-width="0">
              <el-input
                v-model="form.userPrompt"
                type="textarea"
                placeholder="请输入您的交易想法，将添加到每次调用API时用户提示词最前"
                :autosize="{ minRows: 24 }"
              />
              <div>
                <div>以下示例内容作为提供给AI的行情数据、当前仓位数据、历史成绩等数据，暂不支持修改，您的交易想法将拼接在示例内容之前:</div>
                <div><UserPromptDefault></UserPromptDefault></div>
              </div>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="nextForm" v-if="activeTab != 'user'">下一步</el-button>
          <el-button :loading="buttonLoading" type="primary" v-else @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="AiTask" lang="ts">
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
import SystemPromptDefault from '@/views/system/aiTask/SystemPromptDefault.vue';
import { loadDefaultTemplate } from '@/views/system/aiTask/default';
import UserPromptDefault from '@/views/system/aiTask/UserPromptDefault.vue';

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
import { useRouter } from 'vue-router';

const router = useRouter();
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
  account: undefined
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
    name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
    exchange: [{ required: true, message: '交易所不能为空', trigger: 'blur' }],
    symbols: [{ required: true, message: '操作币种至少选择一个', trigger: 'blur' }],
    aiWorkflowId: [{ required: true, message: '请选择AI 智能体', trigger: 'blur' }],
    interval: [{ required: true, message: '请选择时间粒度', trigger: 'blur' }],
    apiId: [{ required: true, message: '请选择API账号', trigger: 'blur' }],
    systemPrompt: [{ required: true, message: '系统提示词不允许为空', trigger: 'blur' }],
    startBalance: [
      { required: true, message: '初始资金必须填写', trigger: 'blur' },
      {
        validator: (_, value, callback) => {
          if (Number(value) < 10) {
            callback(new Error('初始资金不能小于 10'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ]
  }
});
const tabPosition = ref<TabsInstance['tabPosition']>('left');
const { queryParams, form, rules } = toRefs(data);
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
    ElMessage.error('请先选择交易所');
  }
};
const filteredSymbols = ref<LinerSymbol[]>();

// 处理选择交易所的函数
const onExchange = async (exchangeName) => {
  if(!exchangeName){
    return
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
    console.error(`加载失败: ${error}`);
  }
};

const fetchExchangeData = async (exchangeName) => {
  loading.value = true;
  const response = await queryLinerSymbolsByEx(exchangeName);
  console.log(response);
  loading.value = false;
  return response.data;
};

const symbolChange = (selectedSymbol, symbolType) => {
  const selectedSymbolObj = filteredSymbols.value.find((symbol) => symbol.symbol == selectedSymbol);
  form.value[symbolType] = selectedSymbolObj.coin;
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
  dialog.title = '添加AI任务';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: AiTaskVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getAiTask(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改AI任务';
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
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
    // 获取第一个报错的字段名
    const firstField = Object.keys(fields)[0];

    // 判断该字段位于哪个 tab 中
    const tabName = fieldTabMap[firstField];

    if (tabName) {
      activeTab.value = tabName; // 自动切换 tab
    }

    console.warn('校验失败字段:', firstField, '所属Tab:', tabName);
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: AiTaskVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除AI任务编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delAiTask(_ids);
  proxy?.$modal.msgSuccess('删除成功');
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
const goAiTaskLog = (item?: AiTaskVO) => {
  router.push({ path: '/ai/ai-task-log', query: { id: item.id } });
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
