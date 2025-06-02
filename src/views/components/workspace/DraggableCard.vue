
<template>
  <vue-draggable-resizable
    :x="x"
    :y="y"
    :w="w"
    :h="h"
    :min-width="minWidth ?? 200"
    :min-height="minHeight ?? 200"
    :parent="true"
    :resizable="true"
    :draggable="true"
    @dragging="onChanging"
    @resizing="onChanging"
    @update:x="update('x', $event)"
    @update:y="update('y', $event)"
    @update:w="update('w', $event)"
    @update:h="update('h', $event)"
    :grid="[10, 10]"
    class="draggable-card"
    :drag-handle="'.drag-handle'"
    :class-name-active="'active-class'"

  >
    <template #tl>
      <div class="w-10 h-1 drag-handle color-red"></div>
    </template>
    <template #tm>
      <div class="w-10 h-1 drag-handle"></div>
    </template>
    <template #tr>
      <div class="w-10 h-1 drag-handle"></div>
    </template>
    <template #mr>
      <div class="w-1 h-10 drag-handle"></div>
    </template>
    <template #br>
      <div class="w-10  h-1 drag-handle"></div>
    </template>
    <template #bm>
      <div class="w-10 h-1 drag-handle"></div>
    </template>
    <template #bl>
      <div class="w-10 h-1 drag-handle"></div>
    </template>
    <template #ml>
      <div class="w-1 h-10 drag-handle"></div>
    </template>
    <div class="card">
      <div class="card-header drag-handle">
        <span>{{ name }}</span>
        <button class="delete-btn" @click="$emit('remove')">✕</button>
      </div>
      <div :class="['card-content', 'flex']" :style="{ height: props.h + 'px' }">
        <component :is="component" :id="props.id" v-model:componentData="props.compontentData" @config="configDone"/>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/style.css';
import { CompontentData } from '@/views/components/type/type';

const props = withDefaults(
  defineProps<{
    id: number|string
    name: string
    component: Component
    x: number
    y: number
    w: number
    h: number
    minWidth?: number
    minHeight?: number
    compontentData?: CompontentData
  }>(),
  {
    minWidth: 100,
    minHeight: 100,
    compontentData: () => ({})
  }
)


const emit = defineEmits(['remove', 'try-move', 'change-temp',"configDone"]);


const configDone = (config: CompontentData) => {
  console.log("configDone",config);
  emit('configDone', config);
}

const onChanging = (left: number, top: number, width: number, height: number) => {
  emit('change-temp', {
    id: props.id,
    x: left,
    y: top,
    w: width ?? props.w,
    h: height ?? props.h,
  });
};
const update = (key: 'x' | 'y' | 'w' | 'h', value: number) => {
  emit('try-move', {
    id: props.id,
    x: key === 'x' ? value : props.x,
    y: key === 'y' ? value : props.y,
    w: key === 'w' ? value : props.w,
    h: key === 'h' ? value : props.h,
    key
  });
};
watch(props,(value)=>{
  onChanging(value.x,value.y,value.w,value.h);
},{immediate:true});
onMounted(()=>{

})

</script>

<style scoped lang="scss">
.draggable-card {
  position: absolute;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background-color: white;
  border: 0;
}

.card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 12px;
}

.card-header {
  background-color: #f7f9fa;
  padding: 8px 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eaecef;
}

.card-content {
  flex: 1;
  padding: 0px;
}

.delete-btn {
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #999;
}

.delete-btn:hover {
  color: #f56c6c;
}

::v-deep .handle {
  border: 0;
  //background: none;
  background: #909399;
}

.active-class {
  border: 1px solid #dbeafe;
}

::v-deep .vdr {
  border: 0;
}
</style>
