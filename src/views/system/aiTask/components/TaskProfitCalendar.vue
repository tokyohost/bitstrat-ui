<template>
  <el-card v-bind="attrs" v-loading="loading" class="crypto-profit-calendar" shadow="never">
    <div class="calendar-wrapper">
      <el-calendar v-model="currentDate">
        <template #header="{ date }">
          <div class="w-full">
            <div class="custom-header">
              <span class="month-title">{{ date }}</span>
              <el-button-group>
                <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
                <el-button size="small" @click="selectDate('next-month')">下个月</el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <template #date-cell="{ data }">
          <div class="profit-cell" :class="{ 'is-today': data.isSelected, 'not-current': !data.isSelected && data.type !== 'current-month' }">
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
</template>

<script lang="ts" setup>
import { ref, watch, useAttrs, computed } from 'vue';
import dayjs from 'dayjs';
import { getAiTaskProfit } from '@/api/system/aiTask';
import { TaskProfitByDay } from '@/api/system/aiTask/types';
import { useChartAutoRegister } from '@/hooks/useChart';

const attrs = useAttrs();
const props = defineProps<{ taskId: string }>();

const currentDate = ref<Date>(new Date());
const profitList = ref<TaskProfitByDay[]>([]);
const loading = ref(false);

const profitMap = computed(() => {
  const map: Record<string, number> = {};
  profitList.value.forEach((item) => {
    map[item.day] = item.profit;
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

const refresh = () => fetchProfit(currentDate.value, false);
useChartAutoRegister(refresh);
defineExpose({ refresh });
</script>

<style scoped>
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
</style>
