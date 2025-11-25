<template>
  <!--  <el-image :src="`${realSrc}`" :zoom-rate="0" :style="`width:${realWidth};height:${realHeight};`" fit="contain" preview-teleported>-->
  <!--    <template #error>-->
  <!--      <div class="image-slot">-->
  <!--        {{ realSrc }}-->
  <!--        <el-icon><picture-filled /></el-icon>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </el-image>-->
  <img v-if="realSrc" :src="`${realSrc}`" :style="`width:${realWidth};height:${realHeight};`" alt="icon" />
  <el-icon v-else><picture-filled /></el-icon>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes';
import { OssVO } from '@/api/system/oss/types';
import { listByIds } from '@/api/system/oss';
const fileList = ref<any[]>([]);
const props = defineProps({
  src: propTypes.string.def(''),
  width: {
    type: [Number, String],
    default: ''
  },
  height: {
    type: [Number, String],
    default: ''
  }
});
watch(
  () => props.src,
  async (val: string) => {
    if (val) {
      // 首先将值转为数组
      let list: OssVO[] = [];
      if (Array.isArray(val)) {
        list = val as OssVO[];
      } else {
        const res = await listByIds(val);
        list = res.data;
      }
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        // 字符串回显处理 如果此处存的是url可直接回显 如果存的是id需要调用接口查出来
        let itemData;
        if (typeof item === 'string') {
          itemData = { name: item, url: item };
        } else {
          // 此处name使用ossId 防止删除出现重名
          itemData = { name: item.ossId, url: item.url, ossId: item.ossId };
        }
        return itemData;
      });
      console.log('fileList.value', fileList.value);
    } else {
      fileList.value = [];
      return [];
    }
  },
  { deep: true, immediate: true }
);
const realSrc = computed(() => {
  // if (!props.src) {
  //   return;
  // }
  const real_src = fileList.value[0];
  return real_src?.url;
});

const realSrcList = computed(() => {
  if (!props.src) {
    return [];
  }
  const real_src_list = props.src.split(',');
  const srcList: string[] = [];
  real_src_list.forEach((item: string) => {
    if (item.trim() === '') {
      return;
    }
    return srcList.push(item);
  });
  return srcList;
});

const realWidth = computed(() => (typeof props.width == 'string' ? props.width : `${props.width}px`));

const realHeight = computed(() => (typeof props.height == 'string' ? props.height : `${props.height}px`));
</script>

<style lang="scss" scoped>
.el-image {
  border-radius: 5px;
  background-color: #ebeef5;
  box-shadow: 0 0 5px 1px #ccc;

  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }

  :deep(.image-slot) {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #909399;
    font-size: 30px;
  }
}
</style>
