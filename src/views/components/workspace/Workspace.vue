<!-- components/workspace/Workspace.vue -->
<template>
  <div class="workspace-container">
    <el-drawer
      v-model="componentPanelDrawer"
      title="添加组件"
      :size="200"
      :direction="'ltr'"
    >
      <ComponentPanel
        :available-components="availableComponents"
        @add="addComponent"
      />
    </el-drawer>

    <div class="workspace">
      <el-page-header :title="''">
        <template #icon>
          <div></div>
        </template>
        <template #title>
          <el-button type="text" @click="componentPanelDrawer = true">添加组件</el-button>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button @click="removeAll">清空</el-button>
            <el-button type="primary" class="ml-2" @click="resetLayout">重置工作台</el-button>
          </div>
        </template>
      </el-page-header>
      <DraggableCard
        v-for="item in components"
        :key="item.id"
        :id="item.id"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :name="item.name"
        :component="item.component"
        :compontent-data="item.compontentData"
        @remove="removeComponent(item.id)"
        @try-move="tryMove"
        @change-temp="changeTemp"
        @config-done="configDoneWorkSpace"
        :min-height="item.minHeight"
        :min-width="item.minWidth"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPanel from './ComponentPanel.vue'
import DraggableCard from './DraggableCard.vue'
// await import ChartWidget from '@/views/components/widgets/ChartWidget.vue'
// await import CompareWidget from '@/views/components/widgets/CompareWidget.vue'
// await import TableWidget from '@/views/components/widgets/TableWidget.vue'
import { defineAsyncComponent, markRaw } from 'vue'
import { ComponentItem, CompontentData, getdefaultLayout } from '@/views/components/type/type';
import { initWebSocket } from '@/utils/websocket';

// 异步懒加载组件，并用 markRaw 避免 Vue 响应式包裹
const ChartWidget = markRaw(defineAsyncComponent(() => import('@/views/components/widgets/ChartWidget.vue')))
const CompareWidget = markRaw(defineAsyncComponent(() => import('@/views/components/widgets/CompareWidget.vue')))
const TableWidget = markRaw(defineAsyncComponent(() => import('@/views/components/widgets/TableWidget.vue')))
const OrderWidget = markRaw(defineAsyncComponent(() => import('@/views/components/widgets/OrderWidget.vue')))
const PositionWidget = markRaw(defineAsyncComponent(() => import('@/views/components/widgets/PositionWidget.vue')))

const componentPanelDrawer = ref(false)

const availableComponents = ref<ComponentItem[]>([
  { cid:1,name: '价差监控', component: CompareWidget, minWidth: 500, minHeight: 400 },
  { cid:2,name: '图表组件', component: ChartWidget },
  { cid:3,name: '挂单', component: ChartWidget },
  { cid:4,name: '成交记录', component: OrderWidget ,minWidth:300, minHeight:500 },
  { cid:5,name: '消息通知', component: ChartWidget },
  { cid:6,name: '自动双腿下单', component: ChartWidget},
  { cid:7,name: '实时持仓', component: PositionWidget,minWidth:700, minHeight:360  },
  { cid:8,name: '表格组件', component: TableWidget },
])

const components = ref<ComponentItem[]>([])

const addComponent = (comp: ComponentItem) => {
  let x = 50 + components.value.length * 20
  let y = 50 + components.value.length * 20
  const w = comp.minWidth ?? 300
  const h = comp.minHeight ?? 200

  // 自动寻找不重叠的位置
  // let tries = 0
  // while (
  //   components.value.some((c) =>
  //     isOverlap({ id: -1, x, y, w, h, name: '', component: null }, c)
  //   ) &&
  //   tries < 50
  //   ) {
  //   x += 20
  //   y += 20
  //   tries++
  // }

  components.value.push({
    cid:comp.cid,
    id: crypto.randomUUID(),
    name: comp.name,
    x,
    y,
    w,
    h,
    component: comp.component,
    minWidth:comp.minWidth,
    minHeight:comp.minHeight,
  })
  saveLayout()
  ElMessage.success("添加成功")
}
const loadComponent = (comp: ComponentItem,x?:number,y?:number,w?:number,h?:number,data?:CompontentData) => {
  const component = {
    cid:comp.cid,
      id: crypto.randomUUID(),
    name: comp.name,
    x:x??comp.x,
    y:y??comp.y,
    w:w??comp.w,
    h:h??comp.h,
    component: comp.component,
    compontentData: data??{},
    minWidth:comp.minWidth,
    minHeight:comp.minHeight,
  } as ComponentItem

  components.value.push(component)
  // console.log("loadComponent", component);
  // console.log("loadComponent data ", data);
}
const lastValidStateMap = new Map<number|string, { x: number; y: number; w: number; h: number }>()
const removeComponent = (id: number|string) => {
  components.value = components.value.filter((c) => c.id !== id)
  lastValidStateMap.delete(id)
  saveLayout()
}
const configDoneWorkSpace = (config:CompontentData)=>{
   let find = components.value.find((c) => c.id == config.id);
   if(find){
     find.compontentData= config
   }
   saveLayout()
}

const changeTemp = (payload: {
  id: number
  x: number
  y: number
  w: number
  h: number
}) => {
  // console.log(payload);
  const item = components.value.find((c) => c.id === payload.id)
  // console.log(item);
  if (!item) return

  const proposed = { ...payload }
  // const others = components.value.filter((c) => c.id !== payload.id)
  // const hasOverlap = others.some((c) => isOverlap(proposed, c))

  // if (!hasOverlap) {
    console.log("合法", payload);
    // 合法 -> 记录并更新
    item.x = proposed.x
    item.y = proposed.y
    item.w = proposed.w
    item.h = proposed.h
    lastValidStateMap.set(payload.id, { ...proposed })
    saveLayout() // 👉 每次合法操作都保存
  // } else {
  //   非法 -> 强制还原
    // console.log("非法", payload);
    // const last = lastValidStateMap.get(payload.id)
    // if (last) {
    //   item.x = last.x
    //   item.y = last.y
    //   item.w = last.w
    //   item.h = last.h
    // }
    // loadLayout()
  // }
}




// 拖动尝试更新时进行碰撞检测
const tryMove = (payload: {
  id: number
  x: number
  y: number
  w: number
  h: number
  key: 'x' | 'y' | 'w' | 'h'
}) => {
  const current = payload
  const others = components.value.filter((c) => c.id !== payload.id)
  const willOverlap = others.some((c) => isOverlap(current, c))

  if (!willOverlap) {
    const item = components.value.find((c) => c.id === payload.id)
    if (item) item[payload.key] = payload[payload.key]
  }
}

// 计算是否碰撞
function isOverlap(a: ComponentItem, b: ComponentItem): boolean {
  return !(
    a.x + a.w <= b.x ||
    a.x >= b.x + b.w ||
    a.y + a.h <= b.y ||
    a.y >= b.y + b.h
  )
}

//保存
const STORAGE_KEY = 'workspace-layout'

const saveLayout = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(components.value))
}

const loadLayout = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  let parse = []
  if (saved) {
    try {
      parse = JSON.parse(saved);

    } catch (e) {
      console.error('Failed to parse layout:', e)
    }
  }else{
    //加载默认
    let defaultLayout = getdefaultLayout();
    console.log(defaultLayout);
    parse = JSON.parse(defaultLayout);
  }


  for (let i = 0; i < parse.length; i++) {
    let cacheComp = parse[i];
    // console.log("cache",cacheComp);
    let filter = availableComponents.value.filter((item)=>item.cid == cacheComp.cid);
    if (filter) {
      let component = filter[0] as ComponentItem;
      loadComponent(component,cacheComp.x,cacheComp.y,cacheComp.w,cacheComp.h,cacheComp.compontentData);
    }
  }
}
const resetLayout = () => {
  saveLayout()
  location.reload()
}
const removeAll = () => {
  localStorage.removeItem(STORAGE_KEY)
  location.reload()
}
onMounted(() => {
  loadLayout()
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  initWebSocket(protocol + window.location.host + import.meta.env.VITE_APP_BASE_API + '/resource/websocket');
})
</script>

<style scoped>
.workspace-container {
  display: flex;
  height: 100vh;
  background-color: #f5f6fa;
  font-family: 'Segoe UI', sans-serif;
}

.workspace {
  flex: 1;
  position: relative;
  overflow: auto;
  padding: 16px;
}
</style>
