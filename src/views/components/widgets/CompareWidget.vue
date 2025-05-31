<script setup lang="ts">

import CompareLinerChart from '@/views/system/analysis/components/CompareLinerChart.vue';
import ExchangeSelector from '@/views/system/analysis/components/ExchangeSelector.vue';
import { getSupportExchange } from '@/api/system/common/common';
import { ElOption, ElSelect } from 'element-plus';
import { queryLinerSymbolsByEx } from '@/views/system/analysis/components';
import { ref } from 'vue';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import { ExchangeVo } from '@/api/system/common/types';
import { CompareWidget } from '@/views/components/type/type'
const props = withDefaults(
  defineProps<{
    id: number|string,
    componentData: CompareWidget
  }>(),
  {
    componentData: () => ({
      exchangeA: '',
      exchangeB: '',
      symbolA: '',
      symbolB: '',
      typeA: 'swap',
      typeB: 'swap'
    })
  }
)
const showSettingFlag = ref(false);
const refush = ref<number>(1);

const emit = defineEmits<{
  (e: 'update:componentData', value: CompareWidget): void
  (e: 'config', value: CompareWidget): void
}>()

// 创建一个本地响应式副本（避免直接修改 props）
const form = ref<CompareWidget>({...props.componentData} as CompareWidget)


// 双向同步本地 -> 父组件
// watch(
//   form,
//   (val) => {
//     if (val) {
//       console.log(toRaw(val));
//       emit('update:componentData', val)
//     }
//
//   },
//   { deep: true,immediate:true}
// )
watch(
  () => props.componentData,  // 用函数返回，确保响应式追踪
  (val) => {
    if (val) {
      console.log("componentData", toRaw(val));
      form.value = { ...val } as CompareWidget;
      refush.value += 1;
    }
  },
  { deep: true, immediate: true }
)




const selectOk = ()=>{
  console.log(toRaw(form.value));
  formRef.value.validate(valid => {
    if (valid) {
      form.value.id=props.id
      emit('update:componentData', form.value)
      emit('config', form.value)
      refush.value +=1
      ElMessage.success("ok")
      showSettingFlag.value = false;
    }
  })
}
const loading =ref<Boolean>(false);

const formRef = useTemplateRef("exForm")

const roles = reactive<ElFormRules>({
  exchangeA: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  exchangeB: [{ required: true, message: '请选择交易所', trigger: 'blur' }],
  symbolTmpA: [{ required: true, message: '请选择币对', trigger: 'blur' }],
  symbolTmpB: [{ required: true, message: '请选择币对', trigger: 'blur' }],
  typeA: [{ required: true, message: '请选择币对类型', trigger: 'blur' }],
  typeB: [{ required: true, message: '请选择币对类型', trigger: 'blur' }],
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
const onExchange = async (exchangeName,exchangeType) => {
  form.value[exchangeType] = exchangeName
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

const symbolChange = (selectedSymbol,symbolType) => {
  const selectedSymbolObj = filteredSymbols.value.find((symbol) => symbol.symbol == selectedSymbol);
  form.value[symbolType] = selectedSymbolObj.coin;
}
onMounted(()=>{
  loadExchange()
})
</script>

<template>
  <div style="padding: 8px;" >
    <div class="flex justify-end">
      <el-button @click="showSettingFlag =true"><img src="../../../assets/icons/png/setting.png" height="20" width="20" /></el-button>
      <el-dialog
        v-model="showSettingFlag"
        title="选择币对"
        width="500"
        v-loading="loading"
        append-to-body
      >
        <div>
          <el-form :model="form" :rules="roles" ref="exForm" :label-position="'top'">
            <el-form-item label="请选择交易所A币对类型" prop="typeA">
              <el-select v-model="form.typeA" placeholder="请选择交易所A币对类型" prop="typeA">
                <el-option  :key="'swap'" :label="'合约'" value="swap"/>
<!--                <el-option  :key="'spot'" :label="'现货'" value="spot" />-->
              </el-select>
            </el-form-item>
            <el-form-item label="选择交易所A" prop="exchangeA">
              <el-select v-model="form.exchangeA" placeholder="请选择交易所A" @change="onExchange($event,'exchangeA')" prop="exchangeA">
                <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择合约币种" v-if="form.exchangeA" prop="symbolTmpA">
              <el-select v-model="form.symbolTmpA" placeholder="请选择合约币种A" id="symbol" @change="symbolChange($event,'symbolA')" :filterable="true" clearable >
                <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.symbol" :value="symbol.symbol" />
              </el-select>
            </el-form-item>
            <el-form-item label="请选择交易所B币对类型" prop="typeB">
              <el-select v-model="form.typeB" placeholder="请选择交易所B币对类型" prop="typeB">
                <el-option  :key="'swap'" :label="'合约'" value="swap"/>
<!--                <el-option  :key="'spot'" :label="'现货'" value="spot" />-->
              </el-select>
            </el-form-item>
            <el-form-item label="选择交易所B" prop="exchangeB">
              <el-select v-model="form.exchangeB" placeholder="请选择交易所A" @change="onExchange($event,'exchangeB')" prop="exchangeB">
                <el-option v-for="exchange in supportExchangeList" :key="exchange.name" :label="exchange.name" :value="exchange.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="选择合约币种" v-if="form.exchangeB" prop="symbolTmpB">
              <el-select v-model="form.symbolTmpB" placeholder="请选择合约币种B" id="symbol" @change="symbolChange($event,'symbolB')" :filterable="true" clearable >
                <el-option v-for="symbol in filteredSymbols" :key="symbol.symbol" :label="symbol.symbol" :value="symbol.symbol" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showSettingFlag = false">取消</el-button>
            <el-button type="primary" @click="selectOk">
              确定
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
    <compare-liner-chart :key="refush" :exchange-a="props.componentData.exchangeA"
                         :symbol-a="props.componentData.symbolA"
                         :type-a="props.componentData.typeA"
                         :exchange-b="props.componentData.exchangeB"
                         :symbol-b="props.componentData.symbolB"
                         :type-b="props.componentData.typeB"></compare-liner-chart>
  </div>
</template>

<style scoped lang="scss">

</style>
