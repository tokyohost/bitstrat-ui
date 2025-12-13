<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { queryHistoryPositionByPage } from '@/views/system/historyPosition/index';
import { HistoryPosition, HistoryPositionQuery } from '@/views/system/historyPosition/type';
import { AiTaskVO } from '@/api/system/aiTask/types';
import { ElMessage } from 'element-plus';

const { t } = useI18n();

const props = defineProps<{
  task: AiTaskVO;
}>();

// --- 状态定义 ---
const data = ref<HistoryPosition[]>([]);
const loading = ref<boolean>(false);
const moreLoading = ref<boolean>(false); // 加载更多按钮的 loading 状态
const idLessThan = ref<string | null>(null); // 修复类型: string | null
const hasMore = ref<boolean>(false); // 是否还有更多数据

const queryData = ref<HistoryPositionQuery>({
  exchange: props.task?.exchange,
  apiId: props.task?.apiId
});

// --- 工具函数 ---

// 格式化数字 (保留小数位 + 千分位)
const formatNumber = (num: string | number | undefined, decimals = 2) => {
  if (num === undefined || num === null) return '-';
  const n = Number(num);
  if (isNaN(n)) return '-';
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// 格式化时间
const formatTimestamp = (timestamp: string | number, includeTime = false) => {
  if (!timestamp) return '-';
  const date = new Date(Number(timestamp));
  const baseDate = date.toLocaleDateString();
  const time = date.toLocaleTimeString([], { hour12: false });
  return includeTime ? `${baseDate} ${time}` : `${baseDate} ${time}`;
};

// --- 核心逻辑 ---

/**
 * 获取数据
 * @param isAppend 是否为追加模式（加载更多）
 */
const fetchData = async (isAppend: boolean = false) => {
  // 设置查询参数
  queryData.value.exchange = props.task?.exchange;
  queryData.value.apiId = props.task?.apiId;
  queryData.value.idLessThan = idLessThan.value;

  try {
    if (isAppend) {
      moreLoading.value = true;
    } else {
      loading.value = true;
    }

    const page = await queryHistoryPositionByPage(queryData.value);
    const list = page.data || [];

    if (list.length === 0) {
      hasMore.value = false;
      if (isAppend) ElMessage.warning(t('historyPosition.noData'));
    } else {
      // 更新分页游标
      const last = list[list.length - 1];
      idLessThan.value = last.idLessThan || null;
      // 如果是追加模式，合并数组；否则直接赋值
      if (isAppend) {
        data.value = [...data.value, ...list];
      } else {
        data.value = list;
      }

      // --- 根据 positionId 去重 ---
      const seen = new Set();
      data.value = data.value.filter((item) => {
        if (seen.has(String(item.utime))) return false;
        seen.add(String(item.utime));
        return true;
      });

      hasMore.value = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    moreLoading.value = false;
  }
};

// 初始查询 / 刷新
const handleQuery = () => {
  idLessThan.value = null; // 重置游标
  fetchData(false);
};

// 加载更多
const handleLoadMore = () => {
  if (!idLessThan.value) return;
  fetchData(true);
};

const viewDetails = (id: string) => {
  // TODO: 实现查看详情逻辑，或者使用 emit 通知父组件
  console.log('View details', id);
};
defineExpose({
  fetchData
});

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="p-0">
    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch="false" :search="false" @queryTable="handleQuery"></right-toolbar>
        </el-row>
      </template>

      <el-table
        v-loading="loading"
        :data="data"
        style="width: 100%"
        :header-cell-style="{ background: 'var(--el-fill-color-light)' }"
        :show-header="false"
        class="mobile-list-view"
      >
        <el-table-column :label="t('historyPosition.tradeDetails')" min-width="100%" :show-overflow-tooltip="false">
          <template #default="{ row }">
            <div class="flex flex-col gap-2 p-3 border rounded-lg md:hidden shadow-sm" style="background: var(--el-bg-color)">
              <div class="flex justify-between items-center pb-2 border-b">
                <div class="flex items-center space-x-2">
                  <span class="symbol font-bold text-base">{{ row.symbol }}</span>
                  <el-tag size="default" :type="row.holdSide === 'long' ? 'success' : 'danger'" effect="dark" class="side-tag">
                    {{ row.holdSide === 'long' ? t('historyPosition.long') : t('historyPosition.short') }}
                  </el-tag>
                </div>
                <div class="margin-info text-xs text-gray-500">
                  {{ row.marginCoin }} ·
                  {{
                    row.marginMode === 'crossed' || row.marginMode === 'cross' ? t('historyPosition.fullMargin') : t('historyPosition.isolatedMargin')
                  }}
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500">{{ t('historyPosition.realizedPnl') }}</span>
                  <div :class="['pnl-value', Number(row.netProfit) > 0 ? 'text-green-600' : 'text-red-600', 'font-bold', 'text-lg']">
                    {{ Number(row.netProfit) > 0 ? '+' : '' }}{{ formatNumber(row.netProfit, 4) }}
                  </div>
                  <el-tooltip effect="dark" placement="bottom">
                    <template #content>
                      <div class="tooltip-content text-xs">
                        <div>{{ t('historyPosition.pnl') }}: {{ formatNumber(row.pnl, 4) }}</div>
                        <div>{{ t('historyPosition.openFee') }}: {{ formatNumber(row.openFee, 4) }}</div>
                        <div>{{ t('historyPosition.closeFee') }}: {{ formatNumber(row.closeFee, 4) }}</div>
                        <div>{{ t('historyPosition.fundingFee') }}: {{ formatNumber(row.totalFunding, 4) }}</div>
                      </div>
                    </template>
                    <span class="detail-link text-blue-500 text-xs mt-1 cursor-pointer">{{ t('historyPosition.feeDetails') }}</span>
                  </el-tooltip>
                </div>

                <div class="flex flex-col items-end">
                  <span class="text-xs text-gray-500">{{ t('historyPosition.closingQuantity') }}</span>
                  <span class="text-base font-medium">{{ row.closeTotalPos }}</span>
                </div>
              </div>

              <div class="flex justify-between text-sm pt-2 border-t mt-1">
                <div class="flex flex-col">
                  <span class="label text-gray-500">{{ t('historyPosition.openingPrice') }}:</span>
                  <span class="value font-mono">{{ formatNumber(row.openAvgPrice) }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="label text-gray-500">{{ t('historyPosition.closingPrice') }}:</span>
                  <span class="value font-mono">{{ formatNumber(row.closeAvgPrice) }}</span>
                </div>
              </div>

              <div class="flex justify-between text-xs text-gray-500 pt-2 border-t">
                <div class="flex flex-col">
                  <span class="text-gray-400">{{ t('historyPosition.closingTime') }}: {{ formatTimestamp(row.utime) }}</span>
                  <span class="text-gray-400">{{ t('historyPosition.openingTime') }}: {{ formatTimestamp(row.ctime) }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-gray-500">{{ t('historyPosition.totalFee') }}:</span>
                  <span class="text-gray-600 font-medium">{{
                    formatNumber(Number(row.openFee) + Number(row.closeFee) + Number(row.totalFunding), 4)
                  }}</span>
                </div>
              </div>
            </div>

            <div class="hidden md:flex justify-between items-center w-full">
              <div class="flex-1 min-w-[160px]">
                <div class="symbol-col">
                  <div class="symbol-row">
                    <span class="symbol font-bold">{{ row.symbol }}</span>
                    <el-tag size="small" :type="row.holdSide === 'long' ? 'success' : 'danger'" effect="dark" class="side-tag ml-1">
                      {{ row.holdSide === 'long' ? t('historyPosition.long') : t('historyPosition.short') }}
                    </el-tag>
                  </div>
                  <div class="margin-info text-xs text-gray-500">
                    {{ row.marginCoin }} ·
                    {{
                      row.marginMode === 'crossed' || row.marginMode === 'cross'
                        ? t('historyPosition.fullMargin')
                        : t('historyPosition.isolatedMargin')
                    }}
                  </div>
                </div>
              </div>

              <div class="flex-1 text-right min-w-[120px]">{{ row.closeTotalPos }}</div>

              <div class="flex-1 text-right min-w-[180px]">
                <div class="price-row">
                  <span class="label text-gray-500">{{ t('historyPosition.openPriceLabel') }}</span>
                  <span class="value font-mono ml-1">{{ formatNumber(row.openAvgPrice) }}</span>
                </div>
                <div class="price-row">
                  <span class="label text-gray-500">{{ t('historyPosition.closePriceLabel') }}</span>
                  <span class="value font-mono ml-1">{{ formatNumber(row.closeAvgPrice) }}</span>
                </div>
              </div>

              <div class="flex-1 text-right min-w-[160px]">
                <div :class="['pnl-value', Number(row.netProfit) > 0 ? 'text-green-600' : 'text-red-600', 'font-bold']">
                  {{ Number(row.netProfit) > 0 ? '+' : '' }}{{ formatNumber(row.netProfit, 4) }}
                </div>
                <el-tooltip effect="dark" placement="top">
                  <template #content>
                    <div class="tooltip-content text-xs">
                      <div>{{ t('historyPosition.pnlAfterFee') }}: {{ formatNumber(row.pnl, 4) }}</div>
                      <div>{{ t('historyPosition.openFee') }}: {{ formatNumber(row.openFee, 4) }}</div>
                      <div>{{ t('historyPosition.closeFee') }}: {{ formatNumber(row.closeFee, 4) }}</div>
                      <div>{{ t('historyPosition.fundingFee') }}: {{ formatNumber(row.totalFunding, 4) }}</div>
                    </div>
                  </template>
                  <span class="detail-link text-blue-500 text-xs cursor-pointer">{{ t('historyPosition.feeDetails') }}</span>
                </el-tooltip>
              </div>

              <div class="flex-1 text-right min-w-[120px]">
                {{ formatNumber(Number(row.openFee) + Number(row.closeFee) + Number(row.totalFunding), 4) }}
              </div>

              <div class="flex-1 text-right min-w-[180px]">
                <div class="main-time">{{ formatTimestamp(row.utime) }} ({{ t('historyPosition.closingTime') }})</div>
                <div class="sub-time text-gray-500 text-xs">{{ formatTimestamp(row.ctime) }} ({{ t('historyPosition.openingTime') }})</div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="load-more-container" v-if="data.length > 0">
        <el-button v-if="hasMore" text bg type="primary" :loading="moreLoading" @click="handleLoadMore" class="load-more-btn">
          {{ moreLoading ? t('historyPosition.loadingMore') : t('historyPosition.loadMoreHistory') }}
        </el-button>
        <span v-else class="no-more-text">{{ t('historyPosition.noMore') }}</span>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
// 使用 CSS 变量代替硬编码颜色
.historical-positions-card {
  border: none;
  // 核心：使用 el-bg-color 使其在亮色模式为白，暗色模式为深灰
  background-color: var(--el-bg-color);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-weight: bold;
    font-size: 16px;
    color: var(--el-text-color-primary);
  }
}

.symbol-col {
  .symbol-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;

    .symbol {
      font-weight: bold;
      color: var(--el-text-color-primary);
    }

    .side-tag {
      font-weight: bold;
    }
  }

  .margin-info {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.price-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  font-size: 13px;

  .label {
    color: var(--el-text-color-secondary);
  }

  .value {
    color: var(--el-text-color-regular);
    font-family: var(--el-font-family-monospace); // 数字使用等宽字体更好看
  }
}

.pnl-value {
  font-weight: bold;
  font-family: var(--el-font-family-monospace);
  font-size: 14px;
}

// 利用 Element Plus 内置的颜色变量
.text-success {
  color: var(--el-color-success);
}
.text-danger {
  color: var(--el-color-danger);
}

.detail-link {
  font-size: 12px;
  color: var(--el-color-primary);
  cursor: pointer;
  margin-top: 2px;
  display: inline-block;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.time-col {
  text-align: right;
  line-height: 1.4;

  .main-time {
    color: var(--el-text-color-regular);
  }

  .sub-time {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  border-top: 1px solid var(--el-border-color-lighter);

  .load-more-btn {
    width: 200px;
  }

  .no-more-text {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}
</style>
