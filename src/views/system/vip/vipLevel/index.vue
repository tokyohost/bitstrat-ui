<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="VIP名称" prop="name">
              <el-input v-model="queryParams.name" placeholder="请输入VIP名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="VIP等级" prop="level">
              <el-input-number v-model="queryParams.level" placeholder="请输入VIP等级"
                               :min="1" :max="10" @keyup.enter="handleQuery" style="width: 240px"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:vipLevel:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:vipLevel:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:vipLevel:remove']">删除</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="vipLevelList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="VIP名称" align="center" prop="name" />
        <el-table-column label="VIP等级" align="center" prop="level" />
        <el-table-column label="最大套利金额 USDT" align="center" prop="maxAbAmount" />
        <el-table-column label="最大任务数" align="center" prop="maxActiveTask" />
        <el-table-column label="VIP状态" align="center" prop="status">
          <template #default="scope">
            <el-tag :type="parseStatus(scope.row.status).type">
              {{ parseStatus(scope.row.status).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="VIP 开通金额 单位USDT" align="center" prop="price" />
        <el-table-column label="可用时长" align="center" prop="avaliableDay">
          <template #default="scope">
            {{ scope.row.avaliableDay }}天
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:vipLevel:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:vipLevel:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改VIP等级对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body>
      <el-form ref="vipLevelFormRef" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="VIP名称" prop="name" required>
          <el-input v-model="form.name" placeholder="请输入VIP名称" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="VIP等级" prop="level" required>
          <el-input-number v-model="form.level" placeholder="请输入VIP等级" :min="1" :max="10" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="最大套利金额 USDT" prop="maxAbAmount" required>
          <el-input-number v-model="form.maxAbAmount" placeholder="请输入最大套利金额 USDT"
                           :precision="2" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="最大任务数" prop="maxActiveTask" required>
          <el-input-number v-model="form.maxActiveTask" placeholder="请输入最大同时允许运行中状态的任务数量"
                           :min="1" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="VIP状态" prop="status" required>
          <el-select v-model="form.status" placeholder="请选择VIP状态" style="width: 100%">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
            <el-option label="不可购买" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VIP 开通金额 单位USDT" prop="price" required>
          <el-input-number v-model="form.price" placeholder="请输入VIP 开通金额 单位USDT"
                           :precision="2" :min="0" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="可用时长 单位-天" prop="avaliableDay" required>
          <el-input-number v-model="form.avaliableDay" placeholder="请输入可用时长 单位-天"
                           :min="1" style="width: 100%"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="VipLevel" lang="ts">
import { listVipLevel, getVipLevel, delVipLevel, addVipLevel, updateVipLevel } from '@/api/system/vip/vipLevel';
import { VipLevelVO, VipLevelQuery, VipLevelForm } from '@/api/system/vip/vipLevel/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const vipLevelList = ref<VipLevelVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const vipLevelFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: VipLevelForm = {
  id: undefined,
  name: undefined,
  level: undefined,
  maxAbAmount: undefined,
  maxActiveTask: undefined,
  status: 1,
  price: undefined,
  avaliableDay: undefined,
}
const data = reactive<PageData<VipLevelForm, VipLevelQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    level: undefined,
    maxAbAmount: undefined,
    maxActiveTask: undefined,
    status: undefined,
    price: undefined,
    avaliableDay: undefined,
    params: {
    }
  },
  rules: {
    name: [{ required: true, message: 'VIP名称不能为空', trigger: 'blur' }],
    level: [{ required: true, message: 'VIP等级不能为空', trigger: 'blur' }],
    maxAbAmount: [{ required: true, message: '最大套利金额不能为空', trigger: 'blur' }],
    maxActiveTask: [{ required: true, message: '最大任务数量不能为空', trigger: 'blur' }],
    status: [{ required: true, message: 'VIP状态不能为空', trigger: 'change' }],
    price: [{ required: true, message: '开通金额不能为空', trigger: 'blur' }],
    avaliableDay: [{ required: true, message: '可用时长不能为空', trigger: 'blur' }],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询VIP等级列表 */
const getList = async () => {
  loading.value = true;
  const res = await listVipLevel(queryParams.value);
  vipLevelList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  vipLevelFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: VipLevelVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加VIP等级";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: VipLevelVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getVipLevel(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改VIP等级";
}

/** 提交按钮 */
const submitForm = () => {
  vipLevelFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateVipLevel(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addVipLevel(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: VipLevelVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除VIP等级编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delVipLevel(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/vipLevel/export', {
    ...queryParams.value
  }, `vipLevel_${new Date().getTime()}.xlsx`)
}

const parseStatus = (status: number) => {
  switch (status) {
    case 1:
      return { text: '正常', type: 'success' };
    case 2:
      return { text: '禁用', type: 'danger' };
    case 3:
      return { text: '不可购买', type: 'warning' };
    default:
      return { text: '未知', type: '' };
  }
};

onMounted(() => {
  getList();
});
</script>
