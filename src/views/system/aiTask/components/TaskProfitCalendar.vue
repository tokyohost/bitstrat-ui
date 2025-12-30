<template>
  <div class="crypto-profit-calendar" v-bind="attrs" v-loading="loading">
    <el-card shadow="never">
      <div class="calendar-wrapper">
        <el-calendar v-model="currentDate">
          <template #header="{ date }">
            <div class="w-full">
              <div class="custom-header">
                <span class="month-title">{{ date }}</span>
                <el-button-group>
                  <el-button size="small" @click="selectDate('prev-month')">{{ t('taskProfitCalendar.lastMonth') }}</el-button>
                  <el-button size="small" @click="selectDate('next-month')">{{ t('taskProfitCalendar.nextMonth') }}</el-button>
                </el-button-group>
              </div>
            </div>
          </template>

          <template #date-cell="{ data }">
            <div
              class="profit-cell"
              :class="{ 'is-today': data.isSelected, 'not-current': !data.isSelected && data.type !== 'current-month' }"
              @click="clickDate(data.day, profitAnalysisMap[data.day])"
            >
              <span class="day-num">{{ data.day.split('-').pop() }}</span>
              <div class="profit-content">
                <div v-if="profitMap[data.day] > 0" class="status-badge up">
                  <span class="arrow">▲</span>
                  <span class="val">{{ profitMap[data.day] }}</span>
                </div>
                <div v-else-if="profitMap[data.day] < 0" class="status-badge down">
                  <span class="arrow">▼</span>
                  <span class="val">{{ Math.abs(profitMap[data.day]) }}</span>
                </div>
                <div v-else class="status-badge none">—</div>
              </div>
            </div>
          </template>
        </el-calendar>
      </div>
    </el-card>
    <!-- ================= 弹窗 ================= -->
    <el-dialog v-model="showProfit" :title="`${t('taskProfitCalendar.profit')} · ${currentDay}`">
      <!-- 盈亏 -->
      <div class="dialog-profit">
        <span :class="currentDetail?.profit > 0 ? 'up' : 'down'"> {{ currentDetail?.profit > 0 ? '+' : '' }}{{ currentDetail?.profit }} </span>
      </div>

      <!-- 统计信息 -->
      <el-descriptions border :column="2" size="small">
        <el-descriptions-item :label="t('taskProfitCalendar.plRatio')">
          {{ formatPlRatio(currentDetail?.plRatio, currentDetail?.winCount, currentDetail?.loseCount) }}
        </el-descriptions-item>

        <el-descriptions-item :label="t('taskProfitCalendar.lsRatio')">
          {{ formatRatio(currentDetail?.lsRatio) }}
        </el-descriptions-item>

        <el-descriptions-item :label="t('taskProfitCalendar.winLose')">
          {{ currentDetail?.winCount }} / {{ currentDetail?.loseCount }}
        </el-descriptions-item>

        <el-descriptions-item :label="t('taskProfitCalendar.longShort')">
          {{ currentDetail?.longCount }} / {{ currentDetail?.shortCount }}
        </el-descriptions-item>

        <el-descriptions-item :label="t('taskProfitCalendar.totalFee')">
          {{ currentDetail?.totalFee }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('taskProfitCalendar.fundingFee')">
          {{ currentDetail?.fundingFee }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 胜率 -->
      <div class="section">
        <div class="section-title">{{ t('taskProfitCalendar.winRate') }}</div>
        <el-progress :percentage="winRatePercent" :color="winRatePercent >= 50 ? '#02ad8f' : '#ec5151'" />
      </div>

      <!-- 多空柱状图 -->
      <div class="section">
        <div class="section-title">{{ t('taskProfitCalendar.lsDistribution') }}</div>
        <div ref="lsChartRef" class="ls-chart"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import * as echarts from 'echarts';
import { ref, watch, useAttrs, computed, nextTick } from 'vue';
import dayjs from 'dayjs';
import { getAiTaskDayProfit, getAiTaskProfit } from '@/api/system/aiTask';
import { TaskAnalysisByDay, TaskProfitByDay } from '@/api/system/aiTask/types';
import { useChartAutoRegister } from '@/hooks/useChart';

const { t } = useI18n();
const attrs = useAttrs();
const props = defineProps<{ taskId: string }>();
const currentDate = ref<Date>(new Date());
const profitList = ref<TaskProfitByDay[]>([]);
const profitDetailList = ref<TaskAnalysisByDay[]>([]);
const loading = ref(false);
const showProfit = ref(false);
const currentDay = ref('');
const currentDetail = ref<TaskAnalysisByDay | null>(null);

/* ===== 胜率 ===== */
const winRatePercent = computed(() => (currentDetail.value ? +(currentDetail.value.winRatio * 100).toFixed(2) : 0));
const formatRatio = (value?: number) => {
  const valueNumber = Number(value);
  if (!valueNumber || valueNumber <= 0) return '--';
  return `1 : ${valueNumber.toFixed(2)}`;
};
const formatPlRatio = (plRatio?: number, winCount?: number, loseCount?: number) => {
  if (!winCount && !loseCount) return '--';
  if (winCount === 0 && loseCount > 0) return '0 : 1';
  if (winCount > 0 && loseCount === 0) return '1 : 0';
  const valueNumber = Number(plRatio);
  if (!valueNumber || valueNumber <= 0) return '--';
  return `1 : ${valueNumber.toFixed(2)}`;
};

/* ===== 多空图 ===== */
const lsChartRef = ref<HTMLDivElement>();
let lsChart: echarts.ECharts | null = null;
const renderLsChart = () => {
  if (!currentDetail.value || !lsChartRef.value) return;
  lsChart?.dispose();
  lsChart = echarts.init(lsChartRef.value);

  lsChart.setOption({
    grid: { top: 20, bottom: 20, left: 30, right: 10 },
    xAxis: { type: 'category', data: [t('taskProfitCalendar.longShort').split(' / ')[0], t('taskProfitCalendar.longShort').split(' / ')[1]] },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: [currentDetail.value.longCount, currentDetail.value.shortCount],
        itemStyle: {
          color: (params: any) => (params.dataIndex === 0 ? '#02ad8f' : '#ec5151')
        }
      }
    ]
  });
};

/* ===== 交互 ===== */
const clickDate = async (day: string, item: TaskProfitByDay) => {
  currentDay.value = day;
  if (item && item.dayAnalysis) {
    currentDetail.value = item?.dayAnalysis;
    currentDetail.value.profit = (item && item?.profit) || '-';
    showProfit.value = true;
    await nextTick();
    renderLsChart();
  } else {
    ElMessage.warning(t('taskProfitCalendar.noData'));
  }
};

const profitMap = computed(() => {
  const map: Record<string, number> = {};
  profitList.value.forEach((item) => {
    map[item.day] = item.profit;
  });
  return map;
});
const profitAnalysisMap = computed(() => {
  const map: Record<string, TaskProfitByDay> = {};
  profitList.value.forEach((item) => {
    map[item.day] = item;
  });
  return map;
});

const fetchProfit = async (date: Date, showLoading: boolean = false) => {
  if (!props.taskId) return;
  if (showLoading) loading.value = true;
  const d = dayjs(date);
  const start = d.startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const end = d.endOf('month').format('YYYY-MM-DD HH:mm:ss');

  try {
    const res = await getAiTaskProfit(props.taskId, start, end);
    profitList.value = res.data || [];
  } finally {
    if (showLoading) loading.value = false;
  }
};
const fetchProfitDetail = async (date: Date, showLoading: boolean = false) => {
  if (!props.taskId) return;
  if (showLoading) loading.value = true;
  const d = dayjs(date);
  const start = d.startOf('month').format('YYYY-MM-DD HH:mm:ss');
  const end = d.endOf('month').format('YYYY-MM-DD HH:mm:ss');

  try {
    const res = await getAiTaskDayProfit(props.taskId, start, end);
    profitDetailList.value = res.data || [];
  } finally {
    if (showLoading) loading.value = false;
  }
};

const selectDate = (type: 'prev-month' | 'next-month') => {
  const d = dayjs(currentDate.value);
  currentDate.value = type === 'prev-month' ? d.subtract(1, 'month').toDate() : d.add(1, 'month').toDate();
};

watch(
  () => props.taskId,
  (val) => val && fetchProfit(currentDate.value),
  { immediate: true }
);
watch(currentDate, (val) => fetchProfit(val));

const refresh = async () => {
  await fetchProfit(currentDate.value, false);
};
useChartAutoRegister(refresh);
defineExpose({ refresh });
</script>

<style scoped lang="scss">
/* 仿交易所样式定制 */
.crypto-profit-calendar {
  --up-color: #02ad8f; /* 交易所绿 */
  --up-bg: #e6f6f4;
  --down-color: #ec5151; /* 交易所红 */
  --down-bg: #fdf2f2;
  border-radius: 12px;
}

/* 隐藏周标题 */
:deep(.el-calendar-table thead) {
  display: none;
}

:deep(.el-calendar-table .el-calendar-day) {
  padding: 0;
  height: 70px !important;
  border: 0.5px solid #f0f0f0;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 12px;
}

.month-title {
  font-weight: bold;
  font-size: 16px;
}

.profit-cell {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  position: relative;
  transition: all 0.2s;
}

.not-current {
  opacity: 0.3;
  background-color: #fafafa;
}

.day-num {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.profit-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 交易所风格的 Badge */
.status-badge {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.up {
  background-color: var(--up-bg);
  color: var(--up-color);
}

.status-badge.down {
  background-color: var(--down-bg);
  color: var(--down-color);
}

.status-badge.none {
  color: #eee;
  font-weight: normal;
}

.arrow {
  font-size: 10px;
  transform: scale(0.8);
}

:deep(.is-selected) {
  background-color: #fff !important;
}

:deep(.is-selected .profit-cell) {
  outline: 2px solid #409eff;
  z-index: 1;
  border-radius: 4px;
}

/* ===== Dialog 样式 ===== */
.dialog-profit {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
}

.up {
  color: var(--up-color);
}

.down {
  color: var(--down-color);
}

.section {
  margin-top: 16px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.ls-chart {
  width: 100%;
  height: 180px;
}
</style>
