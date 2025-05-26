<template>
  <div class="p-2 w-full">
    <el-button type="primary" @click="dialog.visible = true">选择账户</el-button>
    <el-card shadow="never">
      <el-table
        class="w-full"
        v-loading="loading"
        :data="selectedApis"
        :row-key="row => row.id"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="交易所" align="center" prop="exchangeName" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="API Key" align="center" prop="apiKey" >
          <template #default="scope">
            <el-tooltip class="item" effect="dark" trigger="click" :content="scope.row.apiKey" placement="top">
              <div class="truncate w-full max-w-[180px] hover:cursor-pointer">{{ scope.row.apiKey }}</div>
            </el-tooltip>
          </template>
          </el-table-column>
        <el-table-column label="总余额" align="center" prop="balance" >
          <template #default="scope">
            {{scope.row.balance ?? "-"}} USDT
          </template>
        </el-table-column>
        <el-table-column label="可用额度" align="center" prop="freeBalance" >
          <template #default="scope">
            {{scope.row.balance ?? "-"}} USDT
          </template>
        </el-table-column>
        <el-table-column label="余额更新时间" align="center" prop="balanceUpdate" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      title="选择 API"
      width="1000px"
      @click.stop
    >
      <transition>
        <div v-show="showSearch" class="mb-[10px]">
          <el-card shadow="hover">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="100">
              <el-form-item label="api key" prop="apiKey">
                <el-input v-model="queryParams.apiKey" placeholder="请输入api key" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入API名称" clearable @keyup.enter="handleQuery" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                <el-button icon="Refresh" @click="syncBalanceBtn">更新账户余额</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </transition>

      <el-table
        v-loading="loading"
        :data="apiList"
        @selection-change="handleSelectionChange"
        :row-key="row => row.id"
        :default-selection="selectedApis"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="交易所" align="center" prop="exchangeName" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="API Key" align="center" prop="apiKey" >
          <template #default="scope">
            <el-tooltip class="item" trigger="click" effect="dark" :content="scope.row.apiKey" placement="top">
              <div class="truncate w-full max-w-[180px] hover:cursor-pointer">{{ scope.row.apiKey }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="总余额" align="center" prop="balance" >
          <template #default="scope">
            {{scope.row.balance ?? "-"}} USDT
          </template>
        </el-table-column>
        <el-table-column label="可用额度" align="center" prop="freeBalance" >
          <template #default="scope">
            {{scope.row.balance ?? "-"}} USDT
          </template>
        </el-table-column>
        <el-table-column label="余额更新时间" align="center" prop="balanceUpdate" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitSelection">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="AccountMutiSelect">
import { ref, reactive, onMounted, toRefs, watch } from 'vue';
import { listApi, syncBalance } from '@/api/system/api';
import { ApiVO, ApiQuery } from '@/api/system/api/types';

const props = defineProps<{
  exchangeName?: string;
  modelValue: ApiVO[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ApiVO[]): void;
}>();
const showSearch = ref(true);
const dialog = reactive({ visible: false });
const loading = ref(false);
const apiList = ref<ApiVO[]>([]);
const total = ref(0);
const selectedApis = ref<ApiVO[]>([]);

const queryFormRef = ref();
const queryParams = reactive<ApiQuery>({
  pageNum: 1,
  pageSize: 10,
  apiKey: undefined,
  name: undefined,
  exchangeName: props.exchangeName,
  params: {}
});

const getList = async () => {
  loading.value = true;
  const res = await listApi(queryParams);
  apiList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 表格选择变化时触发 */
const handleSelectionChange = (selection: ApiVO[]) => {
  selectedApis.value = selection;
};

/** 查询操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

/** 重置操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};
const syncBalanceBtn = async () => {
  loading.value = true;
  let axiosResponse = await syncBalance();
  ElMessage.success(axiosResponse.msg)
  loading.value = false;
}
/** 提交选择 */
const submitSelection = () => {
  emit('update:modelValue', selectedApis.value);
  dialog.visible = false;
};

/** 同步回显已选项 */
onMounted(() => {
  selectedApis.value = [...props.modelValue];
  getList();
});

watch(
  () => props.modelValue,
  (newVal) => {
    selectedApis.value = [...newVal];
  }
);
</script>
