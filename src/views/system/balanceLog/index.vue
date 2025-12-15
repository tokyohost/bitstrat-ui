<template>
  <div class="p-2 md:p-4 min-h-screen bg-gray-50/50">
    <!-- 余额卡片 - 移动端优化 -->
    <div class="mb-3 md:mb-6">
      <el-card
        shadow="hover"
        class="border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg md:rounded-xl overflow-hidden relative"
      >
        <div class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center p-2 md:p-4 gap-3 md:gap-0">
          <div class="w-full md:w-auto">
            <div class="text-xs md:text-sm font-medium mb-1 md:mb-2 flex items-center gap-1 text-blue-100">
              <el-icon class="text-base md:text-lg"><Wallet /></el-icon> {{ t('balanceLog.availableBalance') }}
            </div>
            <div class="flex flex-row justify-between items-center gap-2 md:gap-4">
              <div class="text-2xl md:text-4xl font-bold font-mono tracking-tight md:tracking-wide">
                $ <count-to :startVal="0" :endVal="Number(balance)" :duration="1000" :decimals="6"></count-to>
              </div>
              <el-icon class="cursor-pointer hover:text-blue-200 transition-all text-lg md:text-2xl flex-shrink-0" @click="loadBalance">
                <Refresh />
              </el-icon>
            </div>
          </div>

          <div class="w-full md:w-auto">
            <el-button
              color="#fff"
              class="!text-blue-600 !font-bold !border-none hover:!bg-blue-50 transition-transform hover:scale-105 shadow-lg w-full md:w-auto"
              size="large"
              icon="Lightning"
              @click="handleRecharge"
            >
              {{ t('balanceLog.recharge') }}
            </el-button>
          </div>
        </div>

        <div class="absolute right-[-20px] top-[-40px] opacity-10 text-white transform rotate-12 hidden md:block">
          <el-icon :size="200"><Money /></el-icon>
        </div>
      </el-card>
    </div>

    <!-- 账单卡片 - 移动端优化 -->
    <el-card shadow="never" class="rounded-lg md:rounded-xl border-gray-100 mobile-card">
      <template #header>
        <div class="flex flex-row md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
          <div class="flex justify-between items-center gap-2 text-base md:text-lg font-bold text-gray-800">
            <el-icon class="text-blue-500"><List /></el-icon> {{ t('balanceLog.billDetails') }}
          </div>
          <el-button circle icon="Refresh" @click="resetQuery" :title="t('balanceLog.refresh')" v-if="isMobile"></el-button>
          <div class="flex flex-row justify-between" v-else>
            <el-radio-group v-model="queryParams.type" size="small" @change="handleQuery" class="mr-2">
              <el-radio-button label="">{{ t('balanceLog.all') }}</el-radio-button>
              <el-radio-button label="1">{{ t('balanceLog.rechargeType') }}</el-radio-button>
              <el-radio-button label="2">{{ t('balanceLog.consumption') }}</el-radio-button>
              <el-radio-button label="4">{{ t('balanceLog.gift') }}</el-radio-button>
            </el-radio-group>
            <el-button circle icon="Refresh" size="small" @click="resetQuery" :title="t('balanceLog.refresh')"></el-button>
          </div>
        </div>
      </template>

      <!-- 移动端表格优化 - 使用卡片式显示 -->
      <div v-if="loading" class="flex justify-center py-6">
        <el-icon class="is-loading text-2xl text-gray-400"><Loading /></el-icon>
      </div>

      <!-- 桌面端表格 -->
      <el-table
        v-show="!loading"
        v-if="!isMobile"
        :data="balanceLogList"
        :header-cell-style="{ background: '#f8fafc', color: '#64748b' }"
        style="width: 100%"
      >
        <el-table-column :label="t('balanceLog.transactionTime')" align="left" prop="createTime" min-width="160">
          <template #default="scope">
            <span class="text-gray-700 font-medium">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('balanceLog.type')" align="center" prop="type" width="120">
          <template #default="scope">
            <dict-tag :options="balance_log_type" :value="scope.row.type" i18n-profilx="balanceLog.logType" />
          </template>
        </el-table-column>

        <el-table-column :label="t('balanceLog.amount')" align="right" prop="changeAmount" min-width="140">
          <template #default="{ row }">
            <span class="font-bold text-lg font-mono" :class="Number(row.changeAmount) > 0 ? 'text-green-500' : 'text-red-500'">
              {{ Number(row.changeAmount) > 0 ? '+' : '' }}${{ row.changeAmount }}
            </span>
          </template>
        </el-table-column>

        <el-table-column :label="t('balanceLog.status')" align="center" prop="type" width="120">
          <template #default="scope">
            <div v-if="scope.row.status">
              <dict-tag :options="balance_status" :value="scope.row.status" i18n-profilx="balanceLog.balanceStatus" />
            </div>
            <div v-else>{{ t('balanceLog.noRemark') }}</div>
          </template>
        </el-table-column>

        <el-table-column :label="t('balanceLog.balance')" align="right" prop="afterBalance" min-width="140">
          <template #default="{ row }">
            <span class="text-gray-500 font-mono" v-if="row.type != 1">¥ {{ row.afterBalance }}</span>
            <span class="text-gray-500 font-mono" v-else>{{ t('balanceLog.noRemark') }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('balanceLog.remark')" align="left" prop="remark" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="text-gray-500 text-sm">{{ row.remark || t('balanceLog.noRemark') }}</div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isMobile" class="flex flex-col gap-4 md:gap-6 p-2 md:p-4">
        <!-- 移动端卡片列表 -->
        <el-card
          v-show="!loading"
          v-for="row in balanceLogList"
          :key="row.id"
          shadow="never"
          class="border border-gray-200 rounded-lg p-3 space-y-2"
          style="background: var(--el-bg-color); color: var(--el-text-color)"
        >
          <div class="flex justify-between items-start">
            <div>
              <p class="text-xs text-gray-500">{{ t('balanceLog.transactionTime') }}</p>
              <p class="text-sm font-medium text-gray-700">{{ row.createTime }}</p>
            </div>
            <dict-tag :options="balance_log_type" :value="row.type" i18n-profilx="balanceLog.logType" />
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div>
              <p class="text-xs text-gray-500">{{ t('balanceLog.amount') }}</p>
              <p class="text-sm font-bold font-mono" :class="Number(row.changeAmount) > 0 ? 'text-green-500' : 'text-red-500'">
                {{ Number(row.changeAmount) > 0 ? '+' : '' }}${{ row.changeAmount }}
              </p>
            </div>
            <div>
              <p class="text-xs text-gray-500">{{ t('balanceLog.balance') }}</p>
              <p class="text-sm text-gray-700 font-mono" v-if="row.type != 1">¥ {{ row.afterBalance }}</p>
              <p class="text-sm text-gray-700 font-mono" v-else>{{ t('balanceLog.noRemark') }}</p>
            </div>
          </div>

          <div v-if="row.remark" class="pt-2 border-t border-gray-100">
            <p class="text-xs text-gray-500">{{ t('balanceLog.remark') }}</p>
            <p class="text-xs text-gray-600">{{ row.remark }}</p>
          </div>

          <div v-if="row.status" class="pt-2 border-t border-gray-100">
            <dict-tag :options="balance_status" :value="row.status" i18n-profilx="balanceLog.balanceStatus" />
          </div>
        </el-card>
      </div>

      <!-- 分页 -->
      <div class="mt-4 md:mt-6 flex justify-end">
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div>

      <!-- 充值弹窗 -->
      <RechargeDialog :show-button="false" v-model:visible="rechargeDialog" @recharge-success="handleRechargeSuccess" />
    </el-card>
  </div>
</template>

<script setup name="BalanceLog" lang="ts">
import { useI18n } from 'vue-i18n';
import { Wallet, Money, List, Lightning, Refresh, Loading } from '@element-plus/icons-vue';
import RechargeDialog from '@/layout/components/Recharge/RechargeDialog.vue';
import { listBalanceLog } from '@/api/system/balanceLog';
import { BalanceLogVO, BalanceLogQuery } from '@/api/system/balanceLog/types';
import { getUserProfile } from '@/api/system/user';
import { CountTo } from 'vue3-count-to';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { balance_log_type } = toRefs<any>(proxy?.useDict('balance_log_type'));
const { balance_status } = toRefs<any>(proxy?.useDict('balance_status'));

const balanceLogList = ref<BalanceLogVO[]>([]);
const loading = ref(true);
const total = ref(0);
const rechargeDialog = ref(false);
const balance = ref(0);

// 检测是否为移动设备
const isMobile = computed(() => {
  return window.innerWidth < 768; // md 断点
});

// 查询参数
const queryParams = ref<BalanceLogQuery>({
  pageNum: 1,
  pageSize: 10,
  type: '',
  userId: undefined,
  params: {}
});

/** 加载余额 */
const loadBalance = async () => {
  try {
    balance.value = 0;
    const res = await getUserProfile();
    balance.value = res?.data?.user?.balance || 0;
  } catch (e) {
    console.error(t('balanceLog.errorLoadBalance'), e);
  }
};

/** 查询日志列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await listBalanceLog(queryParams.value);
    balanceLogList.value = res.rows;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
};

/** 打开充值弹窗 */
const handleRecharge = () => {
  rechargeDialog.value = true;
};

/** 充值成功回调 */
const handleRechargeSuccess = () => {
  getList();
  loadBalance();
};

/** 搜索操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置操作 */
const resetQuery = () => {
  queryParams.value.type = '';
  handleQuery();
};

onMounted(() => {
  getList();
  loadBalance();
});
</script>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  background-color: transparent;
}

/* 移动端优化 */
@media (max-width: 768px) {
  :deep(.el-card) {
    --el-card-padding: 12px;
  }

  :deep(.el-button) {
    height: 32px;
    font-size: 14px;
  }

  :deep(.el-radio-button) {
    font-size: 12px;
    padding: 6px 12px;
  }
  /* 新增的样式 */
  :deep(.mobile-card .el-card__body) {
    padding: 0 !important;
  }
}
</style>
