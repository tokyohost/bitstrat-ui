<template>
  <el-card title="套利操作" class="w-full" shadow="hover">
    <el-form size="small">
      <el-form-item>
        <div class="flex justify-between w-full">
          <el-switch
            v-model="props.operate.type"
            :disabled="disabled"
            class="mb-2"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            active-text="+A -B"
            active-value="plusAminB"
            inactive-value="plusBminA"
            inactive-text="+B -A"
          />
          <div class="flex justify-end gap-col-1">
            <el-switch
              v-model="props.operate.status"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              :active-text="'run'"
              :active-value="'run'"
              :inactive-text="'stop'"
              :inactive-value="'stop'"
              v-if="!disabled"
              @change="change"
            />
            <el-button type="text" @click="syncRole" v-if="!disabled"
              ><img src="@/assets/icons/png/cloud-sync.png" height="25" width="25" class="hover:color-amber" title="同步"
            /></el-button>
            <div class="flex flex-col">
              <el-tag :type="props.operate.status == 'run' ? 'success' : 'error'" effect="plain" round v-if="disabled">
                {{ props.operate.status == 'run' ? '正在运行' : '已停止' }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="开仓触发价差">
        <el-input type="number" :disabled="disabled" v-model="props.operate.openGap" :step="0.0001" :max="100" :min="0.00001">
          <template #prepend>
            <img src="@/assets/icons/png/maxequls.png" height="12" width="12" />
          </template>
          <template #append>%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="平仓触发价差">
        <el-input type="number" :disabled="disabled" v-model="props.operate.closeGap" :step="0.0001" :max="100" :min="0.00001">
          <template #prepend>
            <img src="@/assets/icons/png/minos.png" height="12" width="12" />
          </template>
          <template #append>%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="开平数量">
        <el-input type="number" :disabled="disabled" v-model="props.operate.size" />
      </el-form-item>

      <el-form-item label="开平间隔 (秒)">
        <el-input type="number" :disabled="disabled" v-model="props.operate.coldSec" />
      </el-form-item>

      <el-form-item label="最大持仓数量">
        <el-input type="number" :disabled="disabled" v-model="props.operate.maxSize" />
      </el-form-item>
      <el-form-item label="仅减仓">
        <el-switch
          v-model="props.operate.reduceOnly"
          :disabled="disabled"
          class="mb-2"
          style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
      <el-form-item label="" v-if="disabled">
        <div class="flex justify-end flex-col w-full gap-col-1 gap-row-1">
          <el-tag type="success" effect="plain" round v-if="disabled">上次更新时间 {{ serverTask.lastUpdateTime || '-' }}</el-tag>
          <el-tag type="success" effect="plain" round v-if="disabled">服务器时间:{{ serverTask.serverTime || '-' }}</el-tag>
          <el-tag type="success" effect="plain" round v-if="disabled">
            实时延迟： <span class="color-green-7">A </span>{{ serverTask.delyA }}ms /<span class="color-red"> B</span>{{ serverTask.delyB }}ms
          </el-tag>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { emitter } from '@/utils/eventBus';
import { ABOrderData, ABOrderForm } from '@/views/components/type/type';

const emit = defineEmits(['syncRole', 'update:operate']);

const props = defineProps<{
  operate: ABOrderForm;
  serverTask: ABOrderData;
  lastUpdateTime: string;
  disabled: boolean;
}>();

const syncRole = () => {
  emit('syncRole');
};
const change = () => {
  emit('update:operate', props.operate);
};
</script>
