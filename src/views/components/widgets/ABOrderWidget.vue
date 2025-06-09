<script setup lang="ts">
import CompareLinerChart from '@/views/system/analysis/components/CompareLinerChart.vue';
import ExchangeSelector from '@/views/system/analysis/components/ExchangeSelector.vue';
import { getSupportExchange } from '@/api/system/common/common';
import { ElOption, ElSelect } from 'element-plus';
import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { ExchangeVo } from '@/api/system/common/types';
import { ABOrderData, ABOrderForm, CompareWidget } from '@/views/components/type/type';
import ExchangeLogo from '@/views/system/analysis/components/ExchangeLogo.vue';
import OperateForm from '@/views/components/component/OperateForm.vue';
import AccountSelectDialog from '@/views/system/analysis/components/AccountSelectDialog.vue';
import { ApiVO } from '@/api/system/api/types';
import { emitter } from '@/utils/eventBus';
import { syncAbOrderTask } from '@/views/components/type';

const props = withDefaults(
  defineProps<{
    id: number | string;
    componentData: ABOrderData;
  }>(),
  {
    componentData: () => ({
      exchangeA: '',
      exchangeB: '',
      symbolA: '',
      symbolB: '',
      leverage: 1,
      typeA: 'swap',
      typeB: 'swap'
    })
  }
);
const showSettingFlag = ref(false);
const refush = ref<number>(1);

const emit = defineEmits<{
  (e: 'update:componentData', value: ABOrderData): void;
  (e: 'config', value: ABOrderData): void;
}>();

// 创建一个本地响应式副本（避免直接修改 props）
const form = ref<ABOrderData>({ ...props.componentData } as ABOrderData);
const serverTask = ref<ABOrderData>({
  exchangeA: props.componentData.exchangeA,
  exchangeB: props.componentData.exchangeB,
  symbolA: props.componentData.symbolA,
  symbolB: props.componentData.symbolB,
  typeA: props.componentData.typeA,
  typeB: props.componentData.typeB,
  leverage: 1,
  operate: {
    status: 'stop',
    type: 'plusAminB',
    size: null,
    coldSec: null,
    maxSize: null,
    gap: null,
    closeGap: null,
    openGap: null
  }
} as ABOrderData);

watch(
  () => props.componentData, // 用函数返回，确保响应式追踪
  (val) => {
    if (val) {
      console.log('componentData', toRaw(val));
      form.value = { ...val } as ABOrderData;
      refush.value += 1;
    }
  },
  { deep: true, immediate: true }
);
// watch(
//   () => form, // 用函数返回，确保响应式追踪
//   (val) => {
//     if (val) {
//       console.log('componentData form-------->', toRaw(val));
//     }
//   },
//   { deep: true, immediate: true }
// );

const syncRole = () => {
  console.log('form ->', JSON.stringify(toRaw(form.value)));
  syncAbOrderTask(form.value).then((res) => {
    if (res.code == 200) {
      const data = res.data as ABOrderData;
      // form.value = data;
      serverTask.value = data;
      console.log(res.data);
      ElMessage.success('同步成功');
    } else {
      ElMessage.error(res.msg);
    }
  });
};

form.value.operate = {
  type: 'plusAminB',
  size: 0.1,
  coldSec: 3,
  maxSize: 10,
  gap: 0,
  closeGap: 0.4,
  openGap: 0.4
};

const selectOk = () => {
  console.log(toRaw(form.value));
  formRef.value.validate((valid) => {
    if (valid) {
      form.value.id = props.id;
      form.value.accountA = null;
      form.value.accountB = null;

      emit('update:componentData', form.value);
      emit('config', form.value);
      refush.value += 1;
      ElMessage.success('ok');
      showSettingFlag.value = false;
    }
  });
};
const loading = ref<boolean>(false);

const formRef = useTemplateRef('exForm');

const roles = reactive<ElFormRules>({
  exchangeA: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  exchangeB: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  symbolTmpA: [{ required: true, message: '请选择币对', trigger: 'blur' }],
  symbolTmpB: [{ required: true, message: '请选择币对', trigger: 'blur' }],
  typeA: [{ required: true, message: '请选择币对类型', trigger: 'blur' }],
  typeB: [{ required: true, message: '请选择币对类型', trigger: 'blur' }],
  leverage: [{ required: true, message: '请输入杠杆倍数', trigger: 'blur' }]
});
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

const filteredSymbols = ref<LinerSymbol[]>();

// 处理选择交易所的函数
const onExchange = async (exchangeName, exchangeType) => {
  form.value[exchangeType] = exchangeName;
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
    console.error(`加载失败: ${error}`);
  }
};

const fetchExchangeData = async (exchangeName) => {
  loading.value = true;
  const response = await queryLinerSymbolsByEx(exchangeName);
  console.log(response);
  loading.value = false;
  return response.data;
};

const symbolChange = (selectedSymbol, symbolType) => {
  const selectedSymbolObj = filteredSymbols.value.find((symbol) => symbol.symbol == selectedSymbol);
  form.value[symbolType] = selectedSymbolObj.coin;
};

const showAccountSelectA = ref(false);
const showAccountSelectB = ref(false);
const selectAccount = (account: ApiVO, type) => {
  console.log(account);
  if (type == 'A') {
    showAccountSelectA.value = false;
  } else if (type == 'B') {
    showAccountSelectB.value = false;
  }
  const deSecAccount = {
    id: account.id,
    name: account.name
  } as ApiVO;
  form.value['account' + type] = deSecAccount;
  emit('update:componentData', form.value);
  emit('config', form.value);
};
const openSelect = (type) => {
  const switchObj = {
    'A': showAccountSelectA,
    'B': showAccountSelectB
  };
  if (form.value['exchange' + type] && form.value['symbol' + type]) {
  } else {
    ElMessage.error('请先选择交易所、币对');
    return;
  }
  if (form.value.operate.status == 'stop') {
  } else {
    ElMessage.error('运行中不允许修改账户');
    return;
  }
  switchObj[type].value = true;
};

const openSetting = () => {
  if (form.value.operate.status == 'stop') {
    showSettingFlag.value = true;
  } else {
    ElMessage.error('运行中不允许修改');
  }
};
defineExpose({
  openSetting
});
const handleOrderTaskMessage = (data: ABOrderData) => {
  form.value = data;
  serverTask.value = data;
};
const handleAddNewMessage = (data: ABOrderData) => {
  form.value = data;
  const id = crypto.randomUUID();
  form.value.taskId = id;
  serverTask.value = data;
  serverTask.value.taskId = id;
};
const handleWsMessage = (data: ABOrderData[]) => {
  console.log('abOrderMessage', data);
  if (data && data.length > 0) {
    if (form.value.taskId == undefined || form.value.taskId == null) {
      serverTask.value = data[0];
      form.value = data[0];
      emit('update:componentData', form.value);
      emit('config', form.value);
      return;
    }

    for (const orderData of data) {
      console.log('ws taskId:', orderData.taskId, 'serverTaskId:', serverTask.value.taskId, 'formTaskId:', form.value.taskId);
      if (orderData.taskId == serverTask.value.taskId) {
        serverTask.value = orderData;
        // emit('update:componentData', serverTask.value);
        // emit('config', serverTask.value);
        form.value.taskId = orderData.taskId;
        refush.value += 1;
      }
    }
  }
};

onBeforeUnmount(() => {
  emitter.off('abOrderMessage', handleWsMessage);
  emitter.off('selectTask', handleOrderTaskMessage);
  emitter.off('addNew', handleAddNewMessage);
});
onMounted(() => {
  loadExchange();
  emitter.on('abOrderMessage', handleWsMessage);
  emitter.on('selectTask', handleOrderTaskMessage);
  emitter.on('addNew', handleAddNewMessage);
});
</script>

<template>
  <div class="flex-1 w-full p-2 overflow-y-hidden hover:overflow-y-auto">
    <el-dialog v-model="showSettingFlag" title="选择币对" width="500" v-loading="loading" append-to-body>
      <div>
        <el-form :model="form" :rules="roles" ref="exForm" :label-position="'top'">
          <el-form-item label="请选择交易所A币对类型" prop="typeA">
            <el-select v-model="form.typeA" placeholder="请选择交易所A币对类型" prop="typeA">
              <el-option :key="'swap'" :label="'合约'" value="swap" />
              <!--                <el-option  :key="'spot'" :label="'现货'" value="spot" />-->
            </el-select>
          </el-form-item>
          <el-form-item label="选择交易所A" prop="exchangeA">
            <el-select v-model="form.exchangeA" placeholder="请选择交易所A" @change="onExchange($event, 'exchangeA')" prop="exchangeA">
              <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择合约币种" v-if="form.exchangeA" prop="symbolTmpA">
            <el-select
              v-model="form.symbolTmpA"
              placeholder="请选择合约币种A"
              id="symbol"
              @change="symbolChange($event, 'symbolA')"
              :filterable="true"
              clearable
            >
              <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.symbol" :value="symbol.symbol" />
            </el-select>
          </el-form-item>
          <el-form-item label="请选择交易所B币对类型" prop="typeB">
            <el-select v-model="form.typeB" placeholder="请选择交易所B币对类型" prop="typeB">
              <el-option :key="'swap'" :label="'合约'" value="swap" />
              <!--                <el-option  :key="'spot'" :label="'现货'" value="spot" />-->
            </el-select>
          </el-form-item>
          <el-form-item label="选择交易所B" prop="exchangeB">
            <el-select v-model="form.exchangeB" placeholder="请选择交易所A" @change="onExchange($event, 'exchangeB')" prop="exchangeB">
              <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="选择合约币种" v-if="form.exchangeB" prop="symbolTmpB">
            <el-select
              v-model="form.symbolTmpB"
              placeholder="请选择合约币种B"
              id="symbol"
              @change="symbolChange($event, 'symbolB')"
              :filterable="true"
              clearable
            >
              <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.symbol" :value="symbol.symbol" />
            </el-select>
          </el-form-item>
          <el-form-item label="杠杆倍数(调整杠杆倍数请确认持仓已全平)" prop="leverage">
            <el-input type="number" :min="1" :max="100" v-model="form.leverage" placeholder="请输入杠杆倍数"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showSettingFlag = false">取消</el-button>
          <el-button type="primary" @click="selectOk"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="flex flex-col gap-y-1">
      <el-card title="A" class="w-full" shadow="hover">
        <div class="flex justify-between w-full">
          <div class="flex gap-x-2 flex-row">
            <div class="font-400 color-green">A</div>
            <ExchangeLogo :exchange="form.exchangeA" :key="form.exchangeA">
              {{ form.symbolA }}
            </ExchangeLogo>
            <el-tag type="danger" size="small" disable-transitions>{{ form.leverage }}x</el-tag>
          </div>
          <div class="flex justify-end hover:cursor-pointer text-xs" @click="openSelect('A')">
            <div>{{ form.accountA?.name || '-' }}</div>
            <img src="@/assets/icons/png/switch.png" height="18" width="18" v-if="form.accountA" />
            <div class="color-#409EFF" v-else>选择账户</div>
            <AccountSelectDialog
              v-model:visible="showAccountSelectA"
              :exchange-name="form.exchangeA"
              @select="selectAccount($event, 'A')"
            ></AccountSelectDialog>
          </div>
        </div>
      </el-card>
      <el-card title="B" class="w-full" shadow="hover">
        <div class="flex justify-between w-full">
          <div class="flex gap-x-2 flex-row">
            <div class="font-400 color-red">B</div>
            <ExchangeLogo :exchange="form.exchangeB" :key="form.exchangeB">
              {{ form.symbolB }}
            </ExchangeLogo>
            <el-tag type="danger" size="small" disable-transitions>{{ form.leverage }}x</el-tag>
          </div>
          <div class="flex justify-end hover:cursor-pointer text-xs" @click="openSelect('B')">
            <div>{{ form.accountB?.name || '-' }}</div>
            <img src="@/assets/icons/png/switch.png" height="18" width="18" v-if="form.accountB" />
            <div class="color-#409EFF" v-else>选择账户</div>
            <AccountSelectDialog
              v-model:visible="showAccountSelectB"
              :exchange-name="form.exchangeB"
              @select="selectAccount($event, 'B')"
            ></AccountSelectDialog>
          </div>
        </div>
      </el-card>

      <div class="flex flex-row gap-x-2">
        <OperateForm v-model:operate="form.operate" v-model:serverTask="serverTask" :disabled="false" @syncRole="syncRole" class="flex-1" />
        <OperateForm
          v-model:operate="serverTask.operate"
          :disabled="true"
          :last-update-time="serverTask.lastUpdateTime"
          v-model:serverTask="serverTask"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
