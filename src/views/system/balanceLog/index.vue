<template>
  <div class="p-4 min-h-screen bg-gray-50/50">
    <div class="mb-6">
      <el-card shadow="hover" class="border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl overflow-hidden relative">
        <div class="relative z-10 flex justify-between items-center p-2">
          <div>
            <div class="text-blue-100 text-sm font-medium mb-1 flex items-center gap-1">
              <el-icon><Wallet /></el-icon> 当前可用余额
            </div>
            <div class="flex flex-row justify-between items-center gap-4">
              <div class="text-4xl font-bold font-mono tracking-wide color[white]">
                ¥ <count-to :startVal="0" :endVal="Number(balance)" :duration="1000" :decimals="6"></count-to>
              </div>
              <el-icon class="cursor-pointer hover:text-blue-500 transition-all" @click="loadBalance">
                <Refresh />
              </el-icon>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <el-button
              color="#fff"
              class="!text-blue-600 !font-bold !border-none hover:!bg-blue-50 transition-transform hover:scale-105 shadow-lg"
              size="large"
              icon="Lightning"
              @click="handleRecharge"
            >
              立即充值
            </el-button>
          </div>
        </div>

        <div class="absolute right-[-20px] top-[-40px] opacity-10 text-white transform rotate-12">
          <el-icon :size="200"><Money /></el-icon>
        </div>
      </el-card>
    </div>

    <el-card shadow="never" class="rounded-xl border-gray-100">
      <template #header>
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex items-center gap-2 text-lg font-bold text-gray-800">
            <el-icon class="text-blue-500"><List /></el-icon> 账单明细
          </div>

          <div class="flex items-center gap-3">
            <el-radio-group v-model="queryParams.type" size="small" @change="handleQuery">
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="1">充值</el-radio-button>
              <el-radio-button label="2">消费</el-radio-button>
              <el-radio-button label="4">赠送</el-radio-button>
            </el-radio-group>
            <el-button circle icon="Refresh" @click="resetQuery" title="刷新列表"></el-button>
          </div>
        </div>
      </template>

      <el-table v-loading="loading" :data="balanceLogList" :header-cell-style="{ background: '#f8fafc', color: '#64748b' }" style="width: 100%">
        <el-table-column label="交易时间" align="left" prop="createTime" min-width="160">
          <template #default="scope">
            <div class="flex flex-col">
              <span class="text-gray-700 font-medium">{{ scope.row.createTime }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="类型" align="center" prop="type" width="120">
          <template #default="scope">
            <dict-tag :options="balance_log_type" :value="scope.row.type" />
          </template>
        </el-table-column>

        <el-table-column label="金额" align="right" prop="changeAmount" min-width="140">
          <template #default="{ row }">
            <span class="font-bold text-lg font-mono" :class="Number(row.changeAmount) > 0 ? 'text-green-500' : 'text-red-500'">
              {{ Number(row.changeAmount) > 0 ? '+' : '' }}{{ row.changeAmount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="type" width="120">
          <template #default="scope">
            <div v-if="scope.row.status">
              <dict-tag :options="balance_status" :value="scope.row.status" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column label="余额" align="right" prop="afterBalance" min-width="140">
          <template #default="{ row }">
            <span class="text-gray-500 font-mono" v-if="row.type != 1">¥ {{ row.afterBalance }}</span>
            <span class="text-gray-500 font-mono" v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column label="备注" align="left" prop="remark" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="text-gray-500 text-sm">{{ row.remark || '-' }}</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-6 flex justify-end">
        <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
      </div>
    </el-card>

    <RechargeDialog :show-button="false" v-model:visible="rechargeDialog" @recharge-success="handleRechargeSuccess" />
  </div>
</template>

<script setup name="BalanceLog" lang="ts">
import { Wallet, Money, List, Lightning, Refresh } from '@element-plus/icons-vue';
import RechargeDialog from '@/layout/components/Recharge/RechargeDialog.vue';
import { listBalanceLog } from '@/api/system/balanceLog';
import { BalanceLogVO, BalanceLogQuery } from '@/api/system/balanceLog/types';
import { getUserProfile } from '@/api/system/user';
// 如果您项目中安装了 vue-count-to，可以使用它来实现数字滚动效果，如果没有，请移除 <count-to> 组件改为直接显示
import { CountTo } from 'vue3-count-to';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { balance_log_type } = toRefs<any>(proxy?.useDict('balance_log_type'));
const { balance_status } = toRefs<any>(proxy?.useDict('balance_status'));

const balanceLogList = ref<BalanceLogVO[]>([]);
const loading = ref(true);
const total = ref(0);
const rechargeDialog = ref(false);
const balance = ref(0);

// 查询参数
const queryParams = ref<BalanceLogQuery>({
  pageNum: 1,
  pageSize: 10,
  type: '', // 默认查全部
  userId: undefined,
  params: {}
});

/** 加载余额 */
const loadBalance = async () => {
  try {
    balance.value = 0;
    const res = await getUserProfile();
    // 确保取到正确的数据结构
    balance.value = res?.data?.user?.balance || 0;
  } catch (e) {
    console.error('获取余额失败', e);
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
  // 刷新列表和余额
  getList();
  loadBalance();
};

/** 搜索操作 (切换Tab时触发) */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置操作 */
const resetQuery = () => {
  queryParams.value.type = ''; // 重置为全部
  handleQuery();
};

onMounted(() => {
  getList();
  loadBalance();
});
</script>

<style scoped>
/* * 这里的样式主要依赖 Unocss/Tailwind。
 * 如果没有安装 vue3-count-to，请手动删除模板中的 <count-to> 标签
 */
:deep(.el-table__inner-wrapper::before) {
  background-color: transparent; /* 去掉表格底部的默认灰线 */
}
</style>
