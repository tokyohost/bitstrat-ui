<template>
  <div class="app-container home" :key="refershKey">
    <div class="flex h-screen gap-4">
      <div class="flex-1">
        <div class="grid grid-cols-auto-fit gap-4">
          <ExchangeBalanceChart class="w-50 h-25 m-1" />
          <!-- 新增：每日涨幅百分比柱状图 -->
          <DailyGrowthChart class="w-50 h-25 m-1" />
        </div>
      </div>
      <div class="flex-1">
        <PredictedRateOfReturn></PredictedRateOfReturn>
      </div>
    </div>
  </div>
</template>

<script setup name="Index" lang="ts">
import ExchangeBalanceChart from '@/components/ExchangeBalanceChart/index.vue';
import DailyGrowthChart from '@/components/DailyGrowthChart/index.vue';
const { locale } = useI18n();
import { ref, onMounted } from 'vue';
import { queryAnnualizedReturn } from '@/api/system/accountBalanceRecord';
import { useI18n } from 'vue-i18n';
import PredictedRateOfReturn from '@/components/PredictedRateOfReturn/PredictedRateOfReturn.vue';

const refershKey = ref(0);

// 监听语言变化
watch(locale, (newLang, oldLang) => {
  console.log(`语言已切换，从 ${oldLang} 到 ${newLang}`);
  // 在此执行其他相关操作，如保存语言设置、更新界面等
  refershKey.value += 1;
});

onMounted(() => {});

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
    color: #409eff;
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

  .label,
  .value {
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
