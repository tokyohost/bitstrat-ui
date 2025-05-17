<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="用户id" prop="userId">
              <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="VIP ID" prop="vipId">
              <el-input v-model="queryParams.vipId" placeholder="请输入VIP ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="购买时间" prop="buyTime">
              <el-date-picker clearable
                v-model="queryParams.buyTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择购买时间"
              />
            </el-form-item>
            <el-form-item label="过期时间" prop="expireTime">
              <el-date-picker clearable
                v-model="queryParams.expireTime"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择过期时间"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:userVip:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:userVip:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:userVip:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:userVip:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="userVipList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户id" align="center" prop="userId" />
        <el-table-column label="VIP ID" align="center" prop="vipId" />
        <el-table-column label="购买时间" align="center" prop="buyTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.buyTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="过期时间" align="center" prop="expireTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.expireTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="会员状态 1-正常 2-禁用 3-过期" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:userVip:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:userVip:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改用户VIP 状态对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="userVipFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="VIP ID" prop="vipId">
          <el-input v-model="form.vipId" placeholder="请输入VIP ID" />
        </el-form-item>
        <el-form-item label="购买时间" prop="buyTime">
          <el-date-picker clearable
            v-model="form.buyTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择购买时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间" prop="expireTime">
          <el-date-picker clearable
            v-model="form.expireTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择过期时间">
          </el-date-picker>
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

<script setup name="UserVip" lang="ts">
import { listUserVip, getUserVip, delUserVip, addUserVip, updateUserVip } from '@/api/system/vip/userVip';
import { UserVipVO, UserVipQuery, UserVipForm } from '@/api/system/vip/userVip/types';
import {parseTime} from "../../../../utils/ruoyi";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const userVipList = ref<UserVipVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const userVipFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: UserVipForm = {
  id: undefined,
  userId: undefined,
  vipId: undefined,
  buyTime: undefined,
  expireTime: undefined,
  status: undefined,
}
const data = reactive<PageData<UserVipForm, UserVipQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    vipId: undefined,
    buyTime: undefined,
    expireTime: undefined,
    status: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    userId: [
      { required: true, message: "用户id不能为空", trigger: "blur" }
    ],
    vipId: [
      { required: true, message: "VIP ID不能为空", trigger: "blur" }
    ],
    buyTime: [
      { required: true, message: "购买时间不能为空", trigger: "blur" }
    ],
    expireTime: [
      { required: true, message: "过期时间不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "会员状态 1-正常 2-禁用 3-过期不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户VIP 状态列表 */
const getList = async () => {
  loading.value = true;
  const res = await listUserVip(queryParams.value);
  userVipList.value = res.rows;
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
  userVipFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: UserVipVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加用户VIP 状态";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: UserVipVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getUserVip(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改用户VIP 状态";
}

/** 提交按钮 */
const submitForm = () => {
  userVipFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateUserVip(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addUserVip(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: UserVipVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除用户VIP 状态编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delUserVip(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/userVip/export', {
    ...queryParams.value
  }, `userVip_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
