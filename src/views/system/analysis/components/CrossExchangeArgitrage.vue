<template>
  <el-dialog v-model="visibleRef" :title="title" width="1200px" style="min-height: 700px" :close-on-click-modal="false" @close="$emit('close')">
    <!-- 显示传入对象内容 -->
    <el-form ref="arbitrageFormRef" :model="arbitrageForm" :rules="roles" :label-position="'top'">
      <div class="ab-card">
        <el-card :shadow="'never'" style="flex: 1">
          <div class="form-item-algin">
            <div>
              <el-form-item :label="''">
                <TradePairTag
                  direction="long"
                  :symbol="props.data.buy?.symbol"
                  :exchange="props.data.buy?.exchangeName"
                  :exchangeLogo="props.data.buy?.exchangeLogo"
                />
              </el-form-item>
              <el-form-item :label="''">
                <BalanceCard coin="USDT" :symbol="props.data.symbol" :exchange="props.data.buy?.exchangeName"></BalanceCard>
              </el-form-item>
            </div>
            <div class="info-block">
              <el-form-item :label="'杠杆倍数'" prop="buy.leverage">
                <el-input v-model.number="arbitrageForm.buy.leverage" min="1" max="200" step="1" placeholder="请输入杠杆倍数">
                  <template #suffix>倍</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="'套利金额'" prop="buy.size">
                <el-input
                  v-model.number="arbitrageForm.buy.size"
                  placeholder="Please input"
                  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                />
              </el-form-item>
              <el-form-item :label="'持仓金额'" prop="buy.actualSize">
                <el-input
                  v-model="arbitrageForm.buy.actualSize"
                  placeholder="0"
                  disabled
                  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                />
              </el-form-item>
            </div>
          </div>
        </el-card>
        <el-card :shadow="'never'" style="flex: 1">
          <div class="form-item-algin">
            <div>
              <el-form-item :label="''">
                <TradePairTag
                  direction="short"
                  :symbol="props.data.sell?.symbol"
                  :exchange="props.data.sell?.exchangeName"
                  :exchangeLogo="props.data.sell?.exchangeLogo"
                />
              </el-form-item>
              <el-form-item :label="''">
                <BalanceCard coin="USDT" :symbol="props.data.symbol" :exchange="props.data.sell?.exchangeName"></BalanceCard>
              </el-form-item>
            </div>

            <div class="info-block">
              <el-form-item :label="'杠杆倍数'" prop="sell.leverage">
                <el-input v-model.number="arbitrageForm.sell.leverage" min="1" max="200" step="1" placeholder="请输入杠杆倍数">
                  <template #suffix>倍</template>
                </el-input>
              </el-form-item>
              <el-form-item :label="'套利金额'" prop="sell.size">
                <el-input
                  v-model.number="arbitrageForm.sell.size"
                  placeholder=""
                  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                />
              </el-form-item>
              <el-form-item :label="'持仓金额'" prop="sell.actualSize">
                <el-input
                  v-model="arbitrageForm.sell.actualSize"
                  placeholder="0"
                  disabled
                  :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                  :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                />
              </el-form-item>
            </div>
          </div>
        </el-card>
      </div>
    </el-form>
    <!-- 插槽：用于自定义内容 -->
    <slot :data="data"></slot>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import TradePairTag from '@/views/system/analysis/components/TradePairTag.vue';
import { ArbitrageTaskForm } from '@/api/system/analysis/types';
import BalanceCard from '@/views/system/analysis/components/BalanceCard.vue';
import { ElForm, FormItemRule } from 'element-plus';
import { Arrayable } from 'element-plus/es/utils';
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '详情'
  },
  data: {
    type: Object,
    default: () => ({})
  }
});
const arbitrageFormRef = ref<InstanceType<typeof ElForm>>();
const roles = reactive<ElFormRules>({
  buy: {
    size: [
      { required: true, message: '请输入套利金额', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value === 0) {
            callback(new Error('金额不能为 0'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }],
    actualSize: [
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value !== arbitrageForm.sell.actualSize) {
            callback(new Error('做多做空实际金额必须对等'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ]
  },
  sell: {
    size: [
      { required: true, message: '请输入套利金额', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value === 0) {
            callback(new Error('金额不能为 0'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }],
    actualSize: [
      {
        validator: (rule, value, callback) => {
          console.log('value = ', value);
          if (value !== arbitrageForm.buy.actualSize) {
            callback(new Error('做多做空实际金额必须对等'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ]
  }
});
const arbitrageForm = reactive<ArbitrageTaskForm>({
  buy: {
    size: 0,
    leverage: 1,
    actualSize: 0
  },
  sell: {
    size: 0,
    leverage: 1,
    actualSize: 0
  }
});
// 封装一个自动同步 actualSize 的方法
function setupActualSizeSync(side: 'buy' | 'sell') {
  watch(
    () => [arbitrageForm[side].size, arbitrageForm[side].leverage],
    ([size, leverage]) => {
      arbitrageForm[side].actualSize = size * leverage;
    },
    { immediate: true } // 初始化时就执行一次
  );
}

// 监听 buy 和 sell 两边
setupActualSizeSync('buy');
setupActualSizeSync('sell');

const emit = defineEmits(['update:visible', 'close', 'confirm']);

// 双向绑定 visible
const visibleRef = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    console.log('watch visible', val);
    visibleRef.value = val;
  }
);
watch(visibleRef, (val) => emit('update:visible', val));

// 显示数据（去 Proxy）
const toDisplayObject = computed(() => {
  try {
    return JSON.stringify(toRaw(props.data), null, 2);
  } catch {
    return '[无法解析对象]';
  }
});

const handleCancel = () => {
  visibleRef.value = false;
};

const handleConfirm = () => {
  emit('confirm', props.data);
  arbitrageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      console.log({ ...arbitrageForm });
    }
  });
  // visibleRef.value = false;
};
</script>

<style scoped>
pre {
  background-color: #f8f8f8;
  padding: 12px;
  border-radius: 6px;
  overflow: auto;
}
.ab-card {
  display: flex;
  gap: 16px;
}
.form-item-algin {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: nowrap;
  height: 100%;
}
>>> .el-card__body {
  height: 100%;
}
</style>
