<template>
  <el-dialog :title="title" v-model="localVisible" width="900px" append-to-body>
    <el-form ref="arbitrageWarningConfigFormRef" :model="form" :rules="rules" label-width="180px">
      <el-card shadow="hover" class="warning-card">
        <template #header>
          <div class="card-header">
            <span>套利预警配置</span>
            <el-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
            />
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="套利警告阈值" prop="warningThreshold">
              <el-input-number
                v-model="form.warningThreshold"
                :disabled="form.status == 0"
                style="width: 100%"
                placeholder="请输入警告阈值"
                :precision="4"
                :step="0.1"
                :max="10"
              >
                <template #suffix>%</template>
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="告警配置名称" prop="configName">
              <el-input
                v-model="form.configName"
                :disabled="form.status == 0"
                placeholder="请输入告警配置名称"
                :maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"
                        :disabled="form.status == 0"
                        type="textarea"
                        placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card shadow="hover" class="warning-card">
        <template #header>
          <div class="card-header">
            <span>爆仓预警配置</span>
            <el-switch
              v-model="form.liquidationConfigStatus"
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="禁用"
            />
          </div>
        </template>
      </el-card>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listCrossExchangeArbitrageTask } from '@/api/system/crossExchangeArbitrageTask';
import { getArbitrageWarningConfig, addArbitrageWarningConfig, updateArbitrageWarningConfig, getByTaskId } from '@/api/system/arbitrageWarningConfig';


const props = defineProps({
  title: {
    type: String,
    default: '配置套利告警'
  },
  visible: {
    type: Boolean,
    default: false
  },
  taskId: {
    type: String,
    default: ''
  }
});
const arbitrageWarningConfigFormRef = ref<ElFormInstance>();
const emit = defineEmits(['update:visible', 'submit']);

const taskIdV = ref(0);
const arbitrageTypeV = ref(0);

// 使用本地变量来管理可见性，确保与父组件的双向绑定
const localVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const form = ref({
  taskId: undefined,
  warningThreshold: undefined,
  configName: undefined,
  status: 0,
  remark: undefined,
  liquidationConfigStatus: 0
});

const rules = ref({
  warningThreshold: [{ required: true, message: '请输入警告阈值', trigger: 'blur' }],
  configName: [{ required: true, message: '请输入告警配置名称', trigger: 'blur' }],
});

const buttonLoading = ref(false);


const fetchWarningConfig = async (arbitrageType, taskId) => {
  const res = await getByTaskId(arbitrageType, taskId);
  arbitrageTypeV.value = arbitrageType;
  taskIdV.value = taskId;
  if (res.data) {
    Object.assign(form.value, res.data);
  }
};
defineExpose({ fetchWarningConfig })


const submitForm = async () => {
  arbitrageWarningConfigFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        buttonLoading.value = true;
        form.value.arbitrageType = arbitrageTypeV.value;
        form.value.taskId = taskIdV.value;
        if (form.value.id) {
          await updateArbitrageWarningConfig(form.value);
        } else {
          await addArbitrageWarningConfig(form.value);
        }
        ElMessage.success('操作成功');
        localVisible.value = false; // 更新本地可见性
        emit('submit', form.value);
      } catch (error) {
        ElMessage.error('操作失败');
      } finally {
        buttonLoading.value = false;
      }
    }
  })
}

const cancel = () => {
  localVisible.value = false; // 更新本地可见性
};
</script>

<style scoped>
.warning-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
