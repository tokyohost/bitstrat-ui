<template>
  <div class="app-container home">
    <!-- 新增：年化收益展示区域 -->
    <div class="annualized-return-container">
      <div class="card">
        <div
          class="annualized-return-item"
          v-for="(item, index) in sortedAnnualizedReturn"
          :key="index"
        >
          <span class="label">{{ item.key === '3d' ? '3天' : item.key === '7d' ? '7天' : '30天' }}年化收益:</span>
          <span class="value">{{ item.value }}%</span>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="w-full">
        <h1 class="text-4xl font-bold text-blue-600 text-center">Welcome 🎉</h1>
        <ExchangeBalanceChart />
        <!-- 新增：每日涨幅百分比柱状图 -->
        <DailyGrowthChart />
      </div>
    </div>
  </div>
</template>

<script setup name="Index" lang="ts">
import ExchangeBalanceChart from '@/components/ExchangeBalanceChart/index.vue';
import DailyGrowthChart from '@/components/DailyGrowthChart/index.vue';
import { ref, onMounted } from 'vue';
import { queryAnnualizedReturn } from '@/api/system/accountBalanceRecord';

// 新增：存储年化收益数据的响应式变量
const annualizedReturn = ref<{ [key: string]: number }>({});

// 新增：获取年化收益数据的方法
const fetchAnnualizedReturn = async () => {
  try {
    const response = await queryAnnualizedReturn({ days: 30 });
    annualizedReturn.value = response.data;
  } catch (error) {
    console.error('获取年化收益数据失败:', error);
  }
};

// 新增：将年化收益数据转换为有序数组
const sortedAnnualizedReturn = ref<{ key: string; value: number }[]>([]);

onMounted(() => {
  fetchAnnualizedReturn().then(() => {
    // 按照 3d、7d、30d 的顺序排序
    sortedAnnualizedReturn.value = Object.entries(annualizedReturn.value)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => {
        const order = { '3d': 1, '7d': 2, '30d': 3 };
        return order[a.key] - order[b.key];
      });
  });
});

const goTarget = (url: string) => {
  window.open(url, '__blank');
};
</script>

<style lang="scss" scoped>
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }

  /* 新增：年化收益样式 */
  .annualized-return-container {
    position: absolute;
    top: 10%;
    right: 100px;
    transform: translateY(-50%); // 垂直居中
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 15px;
    font-size: 18px;
    font-weight: bold;
    color: #409EFF;
  }

  .card {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .annualized-return-item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    white-space: nowrap; // 防止换行
  }

  .label, .value {
    padding: 5px;
    white-space: nowrap;
  }

  .label {
    text-align: right;
    flex: 1;
  }

  .value {
    text-align: left;
    flex: 1;
  }
}
</style>
