<template>
  <el-dialog v-model="visibleRef" title="选择交易所和合约币种" width="500px">
    <!-- 选择交易所 -->
    <el-form :label-position="'top'" label-width="auto" :model="form" :rules="roles" ref="exSymbolForm" style="max-width: 600px" v-loading="loading">
      <el-form-item label="选择交易所" prop="exchangeName">
        <el-select v-model="form.exchangeName" placeholder="请选择交易所" @change="onExchange">
          <el-option v-for="exchange in filteredExchanges" :key="exchange.name" :label="exchange.name" :value="exchange.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="选择合约币种" v-if="form.exchangeName" prop="symbol">
        <el-select v-model="form.symbol" placeholder="请选择合约币种" id="symbol" :filterable="true" clearable @change="onSymbolChange">
          <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.symbol" :value="symbol.symbol" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="confirmSelection">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ElDialog, ElSelect, ElOption, ElButton } from 'element-plus';
import { defineProps, defineEmits } from 'vue';
import { ArbitrageTaskForm, ExchangeItemForm } from '@/api/system/analysis/types.js';
import { getSupportExchange } from '@/api/system/common/common';
import { ExchangeVo } from '@/api/system/common/types';
import { queryLinerSymbolsByEx, queryLinerSymbolsFundingTimeInterval } from '@/views/system/analysis/components/index';
import { LinerSymbol } from '@/views/system/analysis/components/type';

// 通过 defineProps 接收外部传入的 prop
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    required: true
  },
  disabledExchange: {
    type: String,
    default: ''
  }
});
const roles = reactive<ElFormRules>({
  exchangeName: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  symbol: [{ required: true, message: '请选择币对', trigger: 'blur' }]
});

const filteredSymbols = ref<LinerSymbol[]>();
const form = ref<ExchangeItemForm>({
  size: 0,
  leverage: 1,
  actualSize: 0,
  fundingIncome: 0,
  fundingRate: 0,
  symbol: props.data?.symbol,
  exchangeName: props.data?.buy?.exchangeName,
  fundingIntervalHours: null
});
// 通过 defineEmits 来发出事件
const emit = defineEmits(['update:visible', 'close', 'confirm']);

const exSymbolForm = ref(null);
const loading = ref(false);
// 双向绑定 visible
const visibleRef = ref(props.visible);
watch(
  () => props.visible,
  (val) => {
    // console.log('watch visible', val);
    visibleRef.value = val;
  }
);
watch(visibleRef, (val) => emit('update:visible', val));
// 交易所列表
const supportExchangeList = ref<ExchangeVo[]>([]);
const loadExchange = async () => {
  loading.value = true;
  // loading.value = true;
  try {
    const res = await getSupportExchange();

    // console.log(res);
    if (res.code == 200) {
      supportExchangeList.value = res.data;
    } else {
      const msg = res.msg;
      ElMessage.error(msg);
    }
  } finally {
    loading.value = false;
  }

  // loading.value = false;
};
// 定义交易所和币种数据
// 已加载的交易所列表，用 Set 来避免重复请求
const loadedExchanges = ref(new Set());

const fetchExchangeData = async (exchangeName) => {
  const response = await queryLinerSymbolsByEx(exchangeName);
  console.log(response);
  return response.data;
};
const onSymbolChange = async (selectedSymbol) => {
  console.log(selectedSymbol);
  const selectedSymbolObj = filteredSymbols.value.find((symbol) => symbol.symbol == selectedSymbol);
  console.log(selectedSymbolObj);
  form.value.fundingIntervalHours == selectedSymbolObj.fundingInterval;
  form.value.symbol == selectedSymbolObj.coin;
  if (selectedSymbol && (form.value.fundingIntervalHours == null || form.value.fundingIntervalHours == 0)) {
    // 如果没有加载过，则请求后台加载
    loading.value = true;
    try {
      const data = await queryLinerSymbolsFundingTimeInterval(form.value.exchangeName, selectedSymbolObj.coin);
      form.value.fundingIntervalHours = data.data;
    } catch (error) {
      console.error(`加载失败: ${error.message}`);
    } finally {
      loading.value = false;
    }
  } else {
    console.log('币对 已加载 ', symbol);
  }
};
// 处理选择交易所的函数
const onExchange = async (exchangeName) => {
  // if (loadedExchanges.value.has(exchangeName)) {
  //   // 如果该交易所已经加载过，直接提示并返回
  //   console.info(`交易所 ${exchangeName} 已经加载过，无需重新加载`);
  //   return;
  // }
  form.value.fundingIntervalHours = null;
  form.value.symbol = null
  // 如果没有加载过，则请求后台加载
  try {
    loading.value = true;
    try {
      const data = await fetchExchangeData(exchangeName);
      filteredSymbols.value = data;
    } finally {
      loading.value = false;
    }

    // 标记该交易所已加载
    // loadedExchanges.value.add(exchangeName);
    // console.success(data); // 显示加载成功的信息
  } catch (error) {
    console.error(`加载失败: ${error.message}`);
  }
};
// 选中的交易所和合约币种
const selectedExchange = ref(null);
const selectedSymbol = ref(null);

// 计算禁用的交易所列表
const filteredExchanges = computed(() => {
  return supportExchangeList.value.filter((exchange) => exchange.name.toLowerCase() !== props.disabledExchange.toLowerCase());
});

// 监听外部控制的显示状态，保持同步
watch(
  () => props.modelValue,
  (newVal) => {
    dialogVisible.value = newVal;
  }
);

// 关闭 dialog
const closeDialog = () => {
  emit('update:visible', false);
};

// 确认选择
const confirmSelection = () => {
  exSymbolForm.value?.validate(async (valid: boolean) => {
    if (valid) {
      const selectedSymbolObj = filteredSymbols.value.find((symbol) => symbol.symbol == form.value.symbol);
      console.log(selectedSymbolObj);
      // form.value.fundingIntervalHours == selectedSymbolObj.fundingInterval;
      // form.value.symbol == selectedSymbolObj.coin;
      const data = toRaw(form.value);
      data.symbol = selectedSymbolObj.coin;
      emit('confirm', data);
      closeDialog();
    }
  });
};
onMounted(() => {
  loadExchange();
});
</script>

<style scoped>
.exchange-symbol-select {
  margin: 20px;
}

label {
  font-weight: bold;
}

.el-select {
  margin-left: 10px;
  width: 100%;
}

.el-button {
  margin-top: 20px;
}
</style>
