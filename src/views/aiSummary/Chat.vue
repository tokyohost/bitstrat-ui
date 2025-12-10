<template>
  <div class="relative">
    <div
      class="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors"
      v-if="checkPermi(['system:home:aiSummary'])"
    >
      <main class="flex-1 overflow-hidden">
        <div ref="scrollWrap" class="h-full overflow-auto p-4 md:p-6 custom-scrollbar">
          <div class="max-w-3xl mx-auto flex flex-col gap-5">
            <div v-for="(m, idx) in messages" :key="m.id" class="w-full">
              <MessageItem :text="m.text" :isUser="m.role === 'user'" :rawHtml="m.text || null" />
            </div>

            <div v-if="isStreaming" class="flex items-center gap-3 text-sm text-blue-500 dark:text-blue-400 self-start">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke-width="3" class="opacity-20"></circle>
                <path d="M22 12a10 10 0 00-10-10" stroke-width="3" stroke-linecap="round"></path>
              </svg>
              <div class="font-medium">AI 思考中...</div>
            </div>
          </div>
        </div>
      </main>

      <footer class="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
        <div class="max-w-3xl mx-auto">
          <div class="preset-list-container">
            <div class="preset-list">
              <span v-for="item in presetPrompts" :key="item.id" class="preset-item" @click="selectPreset(item.value)">
                {{ item.text }}
              </span>
            </div>
          </div>
          <div class="flex gap-3 mt-3">
            <el-input
              type="textarea"
              v-model="form.content"
              @keydown.enter.prevent="onEnter"
              @keydown.shift.enter.stop
              :disabled="isStreaming"
              placeholder="输入您想要的要求"
              class="flex-1 resize-none p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-base transition-shadow duration-200"
              @input="autoResize"
              ref="textarea"
            ></el-input>
            <button
              @click="send"
              :disabled="isStreaming || !form.content.trim()"
              :class="[
                'px-4 py-2 rounded-xl text-white font-medium transition-colors duration-200',
                isStreaming || !form.content.trim() ? 'bg-gray-400 disabled:opacity-70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              ]"
            >
              {{ isStreaming ? '生成中...' : '发送' }}
            </button>
          </div>
        </div>
      </footer>
    </div>
    <div v-else>
      <el-empty :description="'Not Allow Page'"></el-empty>
    </div>

    <button
      ref="floatButtonRef"
      @click="showConfigDialog = true"
      @mousedown.prevent="startDrag"
      @touchstart.prevent="startDrag"
      class="float-config-button fixed w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors duration-200 z-50 flex items-center justify-center p-2 cursor-pointer"
      title="配置 AI 参数"
      v-if="checkPermi(['system:home:aiSummary'])"
      :style="{ left: `${buttonPosition.x}px`, top: `${buttonPosition.y}px` }"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.568.344 1.34.254 1.84.073z"
        ></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    </button>

    <el-dialog v-model="showConfigDialog" title="参数配置">
      <div class="p-4 pt-0">
        <el-form ref="aiTaskFormRef" :model="form" :rules="rules" label-width="auto" label-position="top">
          <el-row :gutter="16">
            <el-col :span="24" :md="12">
              <el-form-item label="交易所" prop="exchange">
                <el-select v-model="form.exchange" placeholder="请选择交易所" @change="onExchange($event)" prop="exchangeA">
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
            </el-col>

            <el-col :span="24" :md="12">
              <el-form-item label="币种" prop="symbol" class="mb-3 md:mb-4">
                <template #label>
                  <el-popover placement="top-start" :width="150" trigger="hover" content="允许AI分析的币种">
                    <template #reference>
                      <span class="cursor-pointer">币种</span>
                    </template>
                  </el-popover>
                </template>
                <el-select v-model="form.symbol" clearable placeholder="请选择币种" style="width: 100%" filterable @focus="onExchange(form.exchange)">
                  <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.coin" :value="symbol.coin" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24" :md="12">
              <el-form-item label="AI智能体" prop="apiId" class="mb-3 md:mb-4">
                <AiConfigSelect v-model="form.apiId" :type="2"></AiConfigSelect>
              </el-form-item>
            </el-col>

            <el-col :span="24" :md="12">
              <el-form-item label="账户" label-width="0" prop="apiId">
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
            </el-col>
          </el-row>

          <el-row :gutter="16" class="mt-4">
            <el-col :span="24">
              <el-form-item label="短期指标" prop="shortTermInterval">
                <template #label>
                  <el-popover title="短期指标" content="每次调用AI时获取多长时间的K线数据作为短期指标EMA/MACD/RSI 等的数据源" placement="top-start">
                    <template #reference>
                      <span>短期指标</span>
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
            </el-col>
            <el-col :span="24">
              <el-form-item label="长期指标" prop="longTermInterval">
                <template #label>
                  <el-popover
                    title="长期指标"
                    content="每次调用AI时获取多长时间的K线数据作为长期指标EMA/MACD/RSI 等的数据源,注意!!长期指标必须比短期指标更长时!!"
                    placement="top-start"
                  >
                    <template #reference>
                      <span>长期指标</span>
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
            </el-col>
          </el-row>
        </el-form>
      </div>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showConfigDialog = false">关闭</el-button>
          <el-button type="primary" @click="checkConfig">确认配置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, getCurrentInstance, toRefs, onUnmounted } from 'vue';
import { marked } from 'marked';
import { streamAIPost } from '@/views/aiSummary/index';
import { AiStreamQuery } from '@/views/aiSummary/type';
import MessageItem from '@/views/aiSummary/components/MessageItem.vue';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { ElMessage, ElOption, ElSelect } from 'element-plus';
import { ExchangeVo } from '@/api/system/common/types';
import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { getSupportExchange } from '@/api/system/common/common';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';
import AiConfigSelect from '@/views/system/aiTask/AiConfigSelect.vue';
import { ComponentInternalInstance } from 'vue';
import { checkPermi } from '@/utils/permission';
import { isLongTermGreater, isShortTermSmaller, termIntervalList } from '@/views/system/aiTask/default';

type Msg = { id: string; role: 'user' | 'assistant'; text: string; html?: string | null };
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { exchange_api_type } = toRefs<any>(proxy?.useDict('exchange_api_type') || {});

const messages = reactive<Msg[]>([]);
const isStreaming = ref(false);
const textarea = ref<HTMLTextAreaElement | null>(null);
const scrollWrap = ref<HTMLElement | null>(null);
const aiTaskFormRef = ref();

// ------------------------------------------------------------------
// ⭐ 新增：Dialog 和 浮动按钮拖拽逻辑
// ------------------------------------------------------------------
const showConfigDialog = ref(false);
const floatButtonRef = ref<HTMLButtonElement | null>(null);
const checkConfig = () => {
  aiTaskFormRef.value.validate((valid) => {
    if (valid) {
      showConfigDialog.value = false;
    } else {
      ElMessage.error('请完善参数配置');
    }
  });
};
// 按钮初始位置 (使用 CSS top/left 定位)
const PADDING = 16; // 边缘吸附的留白
const buttonPosition = reactive({
  // 默认位置：右下角 (需要 onMounted 后才能计算，这里先给默认值)
  x: window.innerWidth - 48 - PADDING, // 48px 是按钮宽度/高度
  y: window.innerHeight - 48 - 60 // 60 是底部 footer 的大致高度
});

let isDragging = false;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;

/**
 * 拖拽开始
 */
const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!floatButtonRef.value) return;

  // 如果是点击 (没有移动)，则不执行拖拽逻辑，直接打开 Dialog
  if (e instanceof MouseEvent && e.button !== 0) return; // 只响应左键

  // 避免点击事件和拖拽事件冲突，点击打开 Dialog
  // 在拖拽结束时判断是否移动过，如果移动过则阻止点击事件的默认行为

  isDragging = true;
  floatButtonRef.value.style.transition = 'none'; // 拖拽时禁用过渡效果

  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  // 计算鼠标在按钮内部的偏移量
  const rect = floatButtonRef.value.getBoundingClientRect();
  offsetX = clientX - rect.left;
  offsetY = clientY - rect.top;

  startX = clientX;
  startY = clientY;

  // 监听全局事件，避免拖出按钮范围
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', endDrag);
};

/**
 * 拖拽进行中 (修正版)
 */
const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging) return;

  // 阻止默认行为，防止移动端滚动页面
  e.preventDefault();

  // 获取当前的 X 和 Y 坐标
  const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
  // 修正了之前的错误，直接访问第一个触摸点的 clientY
  const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

  // 计算新的按钮位置 (减去鼠标在按钮上的偏移量)
  const newX = clientX - offsetX;
  const newY = clientY - offsetY;

  // 更新位置 (CSS 样式由 :style 绑定)
  buttonPosition.x = newX;
  buttonPosition.y = newY;
};

/**
 * 拖拽结束：实现边缘吸附
 */
const endDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging || !floatButtonRef.value) return;

  isDragging = false;

  const btnWidth = floatButtonRef.value.offsetWidth;
  const btnHeight = floatButtonRef.value.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 当前按钮的中心点位置
  const currentCenterX = buttonPosition.x + btnWidth / 2;
  const currentCenterY = buttonPosition.y + btnHeight / 2;

  // 自动吸附到最近的垂直边缘 (左或右)
  if (currentCenterX < viewportWidth / 2) {
    // 靠近左边
    buttonPosition.x = PADDING;
  } else {
    // 靠近右边
    buttonPosition.x = viewportWidth - btnWidth - PADDING;
  }

  // 约束 Y 轴位置，防止超出上下边界
  buttonPosition.y = Math.max(PADDING, Math.min(buttonPosition.y, viewportHeight - btnHeight - PADDING));

  floatButtonRef.value.style.transition = 'all 0.3s ease-out'; // 恢复过渡效果，让吸附过程更平滑

  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);

  // 检查是否为纯粹的点击（没有移动）
  const finalClientX = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).changedTouches[0].clientX;
  const finalClientY = e instanceof MouseEvent ? e.clientY : (e as TouchEvent).changedTouches[0].clientY;

  const movedDistance = Math.sqrt(Math.pow(finalClientX - startX, 2) + Math.pow(finalClientY - startY, 2));

  // 如果移动距离小于一个阈值（例如 5px），则认为它是点击事件
  if (movedDistance < 5) {
    // 允许默认的点击事件继续执行 (即打开 Dialog)
  } else {
    // 阻止点击事件（因为它是一个拖拽操作）
    e.preventDefault();
    e.stopPropagation();
    // 由于我们已经在 @click 上绑定了打开 Dialog 的逻辑，
    // 如果是拖拽，则应该避免在这里重复打开 Dialog。
    // 注意：由于我们在 template 中使用了 @click，纯粹的拖拽操作（移动距离大于5）
    // 会触发 endDrag 但不应该触发 @click。
    // 如果 endDrag 阻止了事件，@click 通常不会被触发。
    // 如果您发现拖拽后 Dialog 依然打开，可能需要在 click 事件中使用一个 isDragging 标志来判断。
    // 为了安全，如果拖拽发生，手动关闭 Dialog 以防误触
    showConfigDialog.value = false;
  }
};

/**
 * 初始化按钮位置，确保在 DOM 渲染后计算正确位置
 */
const initButtonPosition = () => {
  const btnWidth = 48; // 按钮的 Tailwind w-12/h-12 对应 48px
  const footerHeight = 60; // 假设 footer 大致高度为 60px

  // 初始设置到右下角，避开 footer
  buttonPosition.x = window.innerWidth - btnWidth - PADDING;
  buttonPosition.y = window.innerHeight - btnWidth - PADDING - footerHeight;
};

// ------------------------------------------------------------------
// ⭐ 结束：Dialog 和 浮动按钮拖拽逻辑
// ------------------------------------------------------------------

// --- 新增：预设提示词逻辑 (保持不变) ---
const presetPrompts = ref([
  { id: 1, text: '分析当前币种实时 K 线', value: '分析当前选定币种实时 K 线数据，给出交易建议。' },
  { id: 2, text: '分析我现在的持仓以及行情数据', value: '分析我现在的持仓以及行情数据，给出你的建议。' },
  { id: 3, text: '总结账户持仓盈亏', value: '总结我当前选定账户最近的所有持仓和浮动盈亏情况。' },
  { id: 4, text: '市场情绪分析', value: '分析当前选定币种的整体情绪和波动性。' }
]);

/**
 * 选择预设提示词，并填充到输入框
 * @param value 预设词的内容
 */
const selectPreset = (value: string) => {
  form.value.content = value;
  autoResize();

  nextTick(() => {
    textarea.value?.focus();
  });
};
// -----------------------

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
const showAccountSelect = ref<boolean>(false);
const openAccountSelect = () => {
  if (form.value.exchange) {
    showAccountSelect.value = true;
  } else {
    ElMessage.error('请先选择交易所');
  }
};

const selectAccount = (account: ApiVO) => {
  const deSecAccount = {
    id: account.id,
    name: account.name,
    type: account.type
  } as ApiVO;
  form.value.accountId = account.id;
  form.value.account = deSecAccount;
};
function autoResize() {
  nextTick(() => {
    if (!textarea.value) return;
    textarea.value.style.height = 'auto';
    textarea.value.style.height = Math.min(300, textarea.value.scrollHeight) + 'px';
  });
}

function scrollToBottom() {
  nextTick(() => {
    if (!scrollWrap.value) return;
    scrollWrap.value.scrollTop = scrollWrap.value.scrollHeight;
  });
}
const form = ref<AiStreamQuery>({
  exchange: '',
  symbol: '',
  accountId: undefined,
  apiId: undefined,
  content: '',
  positionFlag: '1',
  shortTermInterval: '3m',
  longTermInterval: '4H'
});
const checkLongInterval = (rule, value, callback) => {
  if (!isLongTermGreater(form.value.shortTermInterval, form.value.longTermInterval)) {
    callback(new Error('长期周期必须大于短周期'));
  } else {
    callback();
  }
};
const checkShortInterval = (rule, value, callback) => {
  if (!isShortTermSmaller(form.value.shortTermInterval, form.value.longTermInterval)) {
    callback(new Error('短周期必须小于长期周期'));
  } else {
    callback();
  }
};
const rules = {
  exchange: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  symbol: [{ required: true, message: '请选择币对', trigger: 'blur' }],
  apiId: [{ required: true, message: '请选择智能体', trigger: 'blur' }],
  accountId: [{ required: true, message: '请选择交易账户', trigger: 'blur' }],
  longTermInterval: [{ required: true, validator: checkLongInterval, trigger: 'change' }],
  shortTermInterval: [{ required: true, validator: checkShortInterval, trigger: 'change' }]
};

async function send() {
  const valid = await aiTaskFormRef.value.validate().catch(() => false);
  if (!form.value.accountId || !form.value.apiId) {
    ElMessage.error('请确保已选择 AI 智能体和交易账户！');
    return;
  }
  if (!valid) return;

  const userMessage = form.value.content.trim();
  messages.push({ id: uid(), role: 'user', text: userMessage });

  const assistantId = uid();
  messages.push({ id: assistantId, role: 'assistant', text: '' });
  scrollToBottom();

  isStreaming.value = true;

  await streamAIPost(
    form.value,
    (chunk) => {
      if (chunk.trim().startsWith('data:')) {
        chunk = chunk.replace('data:', '').trim();
      }

      if (chunk === '[DONE]') {
        isStreaming.value = false;
        return;
      }
      const strings = chunk.split('data:');
      for (const chunkitem of strings) {
        let text = chunkitem;
        if (chunkitem.trim().startsWith('{')) {
          try {
            const obj = JSON.parse(chunkitem);
            if (obj) {
              if (obj.type === 'error' || obj.code === 500) {
                isStreaming.value = false;
                text = obj.msg || 'AI 发生错误。';
                ElMessage.error(text);
                return;
              } else if (obj.type === 'text_chunk') {
                const data = obj.data;
                if (data && data.text) {
                  text = data.text;
                } else {
                  continue;
                }
              } else if (obj.type === 'done') {
                isStreaming.value = false;
                return;
              } else {
                continue;
              }
            } else {
              continue;
            }
          } catch {
            continue;
          }
        } else {
          continue;
        }

        const msg = messages.find((m) => m.id === assistantId);
        if (msg) msg.text += text;

        scrollToBottom();
      }
    },
    (err) => {
      console.error('流错误:', err);
      messages.push({
        id: uid(),
        role: 'assistant',
        text: '⚠️ 连接出错，请稍后重试。'
      });
      isStreaming.value = false;
    }
  ).catch((e) => {
    isStreaming.value = false;
  });
}
const filteredSymbols = ref<LinerSymbol[]>();

const onExchange = async (exchangeName) => {
  if (!exchangeName) return;
  form.value.exchange = exchangeName;
  try {
    loading.value = true;
    const data = await fetchExchangeData(exchangeName);
    filteredSymbols.value = data;
    form.value.symbol = '';
    form.value.accountId = undefined;
    form.value.account = undefined;
  } catch (error) {
    console.error(`加载失败: ${error}`);
  } finally {
    loading.value = false;
  }
};

const fetchExchangeData = async (exchangeName) => {
  loading.value = true;
  const response = await queryLinerSymbolsByEx(exchangeName);
  loading.value = false;
  return response.data;
};
const loading = ref(false);
const supportExchangeList = ref<ExchangeVo[]>([]);
const loadExchange = async () => {
  loading.value = true;
  try {
    const res = await getSupportExchange();
    if (res.code == 200) {
      supportExchangeList.value = res.data;
      if (supportExchangeList.value.length > 0 && !form.value.exchange) {
        onExchange(supportExchangeList.value[0].name);
      }
    } else {
      ElMessage.error(res.msg);
    }
  } finally {
    loading.value = false;
  }
};
function onEnter(e: KeyboardEvent) {
  if (isStreaming.value) return;
  if (e.shiftKey) {
    return;
  }
  if (form.value.content.trim()) {
    send();
  }
}

function clear() {
  messages.splice(0, messages.length);
  isStreaming.value = false;
}

onMounted(() => {
  autoResize();
  loadExchange();
  initButtonPosition();
});

onUnmounted(() => {
  // 组件销毁时移除全局监听，防止内存泄漏
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
});
</script>

<style scoped lang="scss">
/* 隐藏 Element Plus Form Item 默认的底部 margin，让布局更紧凑 */
:deep(.el-form-item) {
  /* 使用 mb-3/mb-4 控制间距，覆盖默认的 22px */
  margin-bottom: 0 !important;
}

.account-card {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
  box-shadow: none !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.account-card:hover {
  border-color: var(--el-color-primary-light-3);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
}

/* ---------------------------------------------------- */
/* 新增：浮动按钮的样式 */
/* ---------------------------------------------------- */
.float-config-button {
  /* 确保按钮在吸附时有过渡效果 */
  transition: all 0.3s ease-out;
  touch-action: none; /* 禁用移动端默认的触摸行为，防止滚动冲突 */
}

/* ---------------------------------------------------- */
/* 新增：预设列表样式 (实现横向滚动) */
/* ---------------------------------------------------- */
.preset-list-container {
  overflow: hidden;
  padding: 0 4px 5px 4px; /* 顶部/底部留出空间，左右留出空间 */
}

.preset-list {
  display: flex;
  white-space: nowrap; /* 关键：防止元素换行，强制单行 */
  overflow-x: auto; /* 关键：允许水平滚动 */

  /* 隐藏滚动条（使界面更简洁） */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.preset-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.preset-item {
  display: inline-flex;
  align-items: center;

  /* 样式：胶囊标签 */
  padding: 6px 12px;
  margin-right: 8px; /* 项之间的间距 */
  border-radius: 9999px; /* 圆角 */

  /* 颜色和边框：使用 Element Plus 的颜色变量以适配主题 */
  background-color: var(--el-fill-color-light, #f0f0f0);
  border: 1px solid var(--el-border-color-lighter, #e0e0e0);
  color: var(--el-text-color-regular, #606266);
  font-size: 13px;

  flex-shrink: 0; /* 阻止项目被压缩 */
  cursor: pointer;
  transition: all 0.2s;
}

.preset-item:hover {
  background-color: var(--el-fill-color-darker, #e0e0e0);
  border-color: var(--el-color-primary, #409eff);
}

/* 滚动条美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.4);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--el-fill-color-light);
}

/* small tweaks for markdown prose (保持不变) */
.prose pre {
  background: #0b1220;
  color: #e6edf3;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
}

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
