<script setup lang="ts">
// 新增：存储年化收益数据的响应式变量
import { onMounted } from 'vue';
import { queryAnnualizedReturn } from '@/api/system/accountBalanceRecord';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

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
</script>

<template>
  <div class="grid grid-cols-auto-fit gap-4">
    <!-- 新增：年化收益展示区域 -->
    <div class="w-150 h-35 m-1">
      <el-card class="w-full h-full" :shadow="'never'">
        <template #header
          ><span class="text-4.5 font-bold">{{ proxy.$t('home.predictedRateOfReturn.title') }}</span></template
        >
        <el-row class="w-full h-full">
          <el-col :span="8" v-for="(item, index) in sortedAnnualizedReturn" :key="index" class="flex items-center justify-between">
            <el-statistic
              :precision="4"
              :suffix="'%'"
              :title="(item.key === '3d' ? '3' : item.key === '7d' ? '7' : '30') + proxy.$t('home.predictedRateOfReturn.item')"
              :value="item.value"
              :value-style="{ color: item.value >= 0 ? '#67C23A' : '#F56C6C' }"
            >
              <template #suffix>
                <span class="font-medium" :style="{ color: item.value >= 0 ? '#67C23A' : '#F56C6C' }">%</span>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
