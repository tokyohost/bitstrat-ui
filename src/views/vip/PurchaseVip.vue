<template>
  <div class="purchase-vip-container">
    <el-card class="purchase-card">
      <div class="vip-header">
        <h2>升级VIP会员</h2>
        <p>享受更多特权和服务</p>
      </div>
      <el-divider />
      <div class="vip-plans">
        <el-row :gutter="20">
          <el-col :span="8" v-for="plan in vipPlans" :key="plan.id">
            <el-card :class="['vip-plan-card', { 'active': selectedPlan === plan.id }]" @click="selectPlan(plan.id)">
              <div class="plan-header">
                <h3>{{ plan.name }}</h3>
                <p class="price">{{ plan.price }} USDT</p>
              </div>
              <el-divider />
              <div class="plan-features">
                <ul>
                  <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
                </ul>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <el-divider />
      <div class="purchase-actions">
        <el-button type="primary" size="large" :disabled="!selectedPlan" @click="confirmPurchase">
          立即购买
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
// import { purchaseVip } from '@/api/vip';

const vipPlans = ref([
  {
    id: 1,
    name: '月度VIP',
    price: 99.99,
    features: [
      '专属客服',
      '优先处理',
      '月度报告',
      '更多特权'
    ]
  },
  {
    id: 2,
    name: '季度VIP',
    price: 249.99,
    features: [
      '专属客服',
      '优先处理',
      '季度报告',
      '更多特权'
    ]
  },
  {
    id: 3,
    name: '年度VIP',
    price: 899.99,
    features: [
      '专属客服',
      '优先处理',
      '年度报告',
      '更多特权'
    ]
  }
]);

const selectedPlan = ref<number | null>(null);

const selectPlan = (planId: number) => {
  selectedPlan.value = planId;
};

const confirmPurchase = async () => {
  try {
    await ElMessageBox.confirm('确定购买该VIP套餐吗？', '确认购买', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    const response = await purchaseVip({
      userId: 1, // 这里需要替换为实际的用户ID
      vipId: selectedPlan.value
    });
    if (response.code === 200) {
      ElMessage.success('购买成功！');
    } else {
      ElMessage.error('购买失败，请稍后重试');
    }
  } catch (error) {
    console.error('购买失败:', error);
    ElMessage.error('购买失败，请稍后重试');
  }
};
</script>

<style lang="scss" scoped>
.purchase-vip-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.purchase-card {
  width: 80%;
  max-width: 1200px;
  padding: 20px;
}

.vip-header {
  text-align: center;
  h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  p {
    font-size: 16px;
    color: #666;
  }
}

.vip-plans {
  margin-top: 20px;
}

.vip-plan-card {
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  &.active {
    border-color: #409eff;
    .plan-header {
      color: #409eff;
    }
  }
}

.plan-header {
  text-align: center;
  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .price {
    font-size: 18px;
    color: #409eff;
    font-weight: bold;
  }
}

.plan-features {
  ul {
    list-style-type: none;
    padding: 0;
    li {
      padding: 8px 0;
      text-align: center;
      color: #666;
    }
  }
}

.purchase-actions {
  text-align: center;
  margin-top: 20px;
}
</style>
