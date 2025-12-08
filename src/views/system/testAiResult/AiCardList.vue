<template>
  <div>
    <!-- 卡片列表（每条占整行） -->
    <div class="space-y-4">
      <el-card
        v-for="item in list"
        :shadow="'never'"
        :key="item.id"
        class="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        <!-- 头部：基本信息 -->
        <div class="flex justify-between items-start">
          <div class="flex items-start gap-3">
            <div>
              <div class="font-semibold text-lg text-gray-800" style="color: var(--el-text-color)">
                {{ item.symbol || '-' }}
                <el-tag size="small" :type="getActionType(item.action)" class="ml-2">{{ item.action }}</el-tag>
              </div>
              <div class="text-xs text-gray-500">
                ID: {{ item.id }} · 杠杆: {{ item.leverage }} · 数量: {{ formatNumber(item.size) }} · 时间: {{ item.createTime }}
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <el-button size="small" @click="openDetail(item)">详情</el-button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="mt-3 space-y-2">
          <div>
            <div class="text-xs text-gray-500 mb-1">分析（EN）</div>
            <div class="text-sm text-gray-700 line-clamp-3" style="color: var(--el-text-color)">
              {{ item.reasoningEn || '—' }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-500 mb-1">分析（ZH）</div>
            <div class="text-sm text-gray-700 line-clamp-3" style="color: var(--el-text-color)">
              {{ item.reasoningZh || '—' }}
            </div>
          </div>
        </div>

        <!-- 底部：止盈止损 -->
        <div class="mt-2 md:mt-3 flex items-center justify-between text-xs md:text-sm text-gray-500 border-t pt-2 md:pt-2">
          <div class="flex items-center space-x-2">
            <span class="whitespace-nowrap">
              止盈: <span class="text-green-600 font-medium">{{ item.takeProfit || '-' }}</span>
            </span>

            <span class="text-gray-400">·</span>

            <span class="whitespace-nowrap">
              止损: <span class="text-red-500 font-medium">{{ item.stopLoss || '-' }}</span>
            </span>
          </div>

          <div class="text-gray-400 font-mono flex-shrink-0 ml-4">#{{ item.taskId }}</div>
        </div>
      </el-card>
    </div>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" width="50%" :append-to-body="true">
      <template #title>
        <div class="flex justify-between items-center">
          <div>
            <div class="text-sm text-gray-500">ID: {{ detailItem.id }}</div>
            <div class="text-lg font-semibold">{{ detailItem.symbol }} — {{ detailItem.action }}</div>
          </div>
          <div class="text-sm text-gray-400">杠杆: {{ detailItem.leverage }} · 数量: {{ formatNumber(detailItem.size) }}</div>
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <div class="text-xs text-gray-500 mb-1">执行结果</div>
          <ShowPrompt :raw-text="detailItem.result"></ShowPrompt>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">分析（EN）</div>
          <ShowPrompt :raw-text="detailItem.reasoningEn"></ShowPrompt>
        </div>

        <div>
          <div class="text-xs text-gray-500 mb-1">分析（ZH）</div>
          <ShowPrompt :raw-text="detailItem.reasoningZh"></ShowPrompt>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">Think</div>
          <ShowPrompt :raw-text="detailItem.think"></ShowPrompt>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">User prompt</div>
          <ShowPrompt :raw-text="requestItem.content"></ShowPrompt>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1">System prompt</div>
          <ShowPrompt :raw-text="requestItem.sysContent"></ShowPrompt>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="detailVisible = false">关闭</el-button>
          <!--          <el-button type="primary" @click="confirmFromDialog">确认</el-button>-->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { getTestAiRequestByKey } from '@/api/system/testAiRequest';
import ShowPrompt from '@/views/system/aiTask/ShowPrompt.vue';

const props = defineProps({
  testAiResultList: {
    type: Array,
    default: () => []
  }
});

const list = computed(() => props.testAiResultList || []);
const checkedMap = ref({});

const detailVisible = ref(false);
const detailItem = ref({});
const requestItem = ref({});

function formatNumber(v) {
  if (v == null) return '-';
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n % 1 === 0 ? n.toLocaleString() : n.toFixed(4);
}

const getActionType = (action) => {
  if (action == 'long') {
    return 'success';
  }
  if (action == 'short') {
    return 'danger';
  }
  if (action == 'close') {
    return 'warn';
  }
  if (action == 'reduce') {
    return 'warn';
  }
  return 'info';
};

function onCheckChange(item) {
  if (!(item.id in checkedMap.value)) checkedMap.value[item.id] = true;
}

async function openDetail(item) {
  console.log('!11111');
  detailItem.value = { ...item };

  const res = await getTestAiRequestByKey(item.requestKey);
  requestItem.value = { ...res.data };
  detailVisible.value = true;
  console.log('!2222');
}

function execute(item) {
  ElMessage.success(`执行下单: ${item.symbol}`);
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
