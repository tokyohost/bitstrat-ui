<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import { AiTaskVO } from '@/api/system/aiTask/types';
import { loadChartDataSimple } from '@/views/system/aiTask/index';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { ai_task_status } = toRefs<any>(proxy?.useDict('ai_task_status'));

const props = defineProps<{
  item: AiTaskVO;
}>();

const emits = defineEmits(['update', 'delete', 'start', 'stop', 'shared']);

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
import SharePanel from '@/views/system/aiTask/share-panel.vue';
import { getFeed } from '@/api/system/feed';

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

const sharePanel = useTemplateRef('sharePanel');

const shareStrategy = (item: AiTaskVO) => {
  sharePanel.value.open();
};

const showSharegy = async (item: AiTaskVO) => {
  const feedVO = await getFeed(item.shareId);
  sharePanel.value.open(feedVO.data);
};

const shared = () => {
  emits('shared');
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
          <el-tooltip effect="dark" :content="item.name" placement="top">
            <div class="text-lg font-bold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap" :style="{ color: 'var(--el-text-color)' }">
              {{ item.name }}
            </div>
          </el-tooltip>
          <ExchangeLogo :exchange="item.exchange"></ExchangeLogo>
        </div>
        <div class="flex justify-end">
          <dict-tag :options="ai_task_status" :value="item.status" :i18n-profilx="'taskItem.status'" />
          <div v-if="item.shareStatus == 1" class="ml-2 hover:cursor-pointer" @click="shareStrategy(item)">
            <img src="../../../assets/icons/png/share.png" height="20" width="20" />
          </div>
          <el-tag :type="'primary'" size="default" v-if="item.shareStatus == 2" class="ml-2 hover:cursor-pointer" @click="showSharegy(item)">{{
            t('taskItem.shared')
          }}</el-tag>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="h-0.5 bg-gradient-to-r from-gray-200 to-transparent mb-3"></div>

      <!-- 内容区 -->
      <div class="space-y-2 text-sm text-gray-600 leading-normal">
        <div class="flex justify-between">
          <span class="font-600">{{ t('taskItem.coins') }}：</span>
          <span class="text-gray-800" :style="{ color: 'var(--el-text-color)' }">{{ item.symbols }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-600">{{ t('taskItem.startBalance') }}：</span>
          <span class="text-emerald-600 font-600">{{ item.startBalance }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-600">{{ t('taskItem.timeGranularity') }}：</span>
          <span>{{ item.interval }}</span>
        </div>

        <div class="flex justify-between">
          <span class="font-600">{{ t('taskItem.createTime') }}：</span>
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
      <div class="flex justify-end gap-1 mt-2">
        <el-button link @click="goAiTaskLog(item)" class="opacity-70 hover:opacity-100">{{ t('taskItem.view') }}</el-button>
        <el-button link icon="Edit" @click="handleUpdate(item)" class="opacity-70 hover:opacity-100">{{ t('taskItem.edit') }}</el-button>

        <el-button v-if="item.status == 2" link icon="VideoPause" class="opacity-70 hover:opacity-100" @click="handleStop(item)">{{
          t('taskItem.stop')
        }}</el-button>

        <el-button v-if="item.status != 2" link icon="VideoPlay" class="opacity-70 hover:opacity-100" @click="handleStart(item)">{{
          t('taskItem.start')
        }}</el-button>

        <el-button link type="danger" icon="Delete" class="opacity-70 hover:opacity-100" @click="handleDelete(item)">{{
          t('taskItem.delete')
        }}</el-button>
      </div>
    </el-card>
    <SharePanel ref="sharePanel" :strategy-id="item.id" @shared="shared"></SharePanel>
  </div>
</template>

<style scoped lang="scss"></style>
