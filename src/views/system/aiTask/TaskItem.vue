<script setup lang="ts">
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { AiTaskVO } from '@/api/system/aiTask/types';
import { loadChartDataSimple } from '@/views/system/aiTask/index';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ai_task_status } = toRefs<any>(proxy?.useDict('ai_task_status'));

const props = defineProps<{
  item: AiTaskVO;
}>();

const emits = defineEmits(['update', 'delete', 'start', 'stop']);
// 是否暗黑模式
const isDark = useDark({
  storageKey: 'useDarkKey',
  valueDark: 'dark',
  valueLight: 'light'
});
// 核心逻辑：计算最终使用的主题
const actualTheme = ref<string>('light');
watch(isDark, () => {
  if (isDark.value) {
    actualTheme.value = 'dark';
  } else {
    actualTheme.value = 'light';
  }
});
import { useRouter } from 'vue-router';
const router = useRouter();
const goAiTaskLog = (item?: AiTaskVO) => {
  router.push({ path: '/ai/ai-task-log', query: { id: item.id } });
};
const handleUpdate = (item: AiTaskVO) => {
  emits('update', item);
};
const handleDelete = (item: AiTaskVO) => {
  emits('delete', item);
};
const handleStart = (item: AiTaskVO) => {
  emits('start', item);
};
const handleStop = (item: AiTaskVO) => {
  emits('stop', item);
};
const chartData = ref<number[]>([]);
const loadChartData = async () => {
  console.log('loadChartData  11');
  // Placeholder for any data loading logic if needed in the future
  const res = await loadChartDataSimple({ taskId: props.item.id });
  chartData.value = res.data.data;
};
onMounted(() => {
  loadChartData();
});
</script>

<template>
  <div>
    <el-card
      class="relative p-4 rounded-xl bg-white/70 backdrop-blur shadow-sm hover:shadow-lg border border-gray-200/50 hover:(border-primary shadow-primary/30) transition-all duration-300"
    >
      <!-- 顶部：标题 + 状态 -->
      <div class="flex justify-between items-center mb-3">
        <div class="flex justify-start gap-2">
          <div class="text-lg font-bold text-gray-900" :style="{ color: 'var(--el-text-color)' }">{{ item.name }}</div>
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
          <span class="text-gray-800" :style="{ color: 'var(--el-text-color)' }">{{ item.symbols }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-600">开始资金：</span>
          <span class="text-emerald-600 font-600">{{ item.startBalance }}</span>
        </div>

        <!--            <div class="flex justify-between">-->
        <!--              <span class="font-600">当前余额：</span>-->
        <!--              <span :class="item.totalBalance >= item.startBalance ? 'text-green-600 font-600' : 'text-red-500 font-600'">-->
        <!--                {{ item.totalBalance }}-->
        <!--              </span>-->
        <!--            </div>-->

        <div class="flex justify-between">
          <span class="font-600">时间粒度：</span>
          <span>{{ item.interval }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-600">创建时间：</span>
          <span>{{ item.createTime }}</span>
        </div>

        <div class="flex justify-between">
          <TrendLineCard
            :data="chartData"
            :line-color="'#10B981'"
            :fill-color="'rgba(16, 185, 129, 0.1)'"
            :is-dark-mode="actualTheme === 'dark'"
            style="height: 50px"
          />
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
</template>

<style scoped lang="scss"></style>
