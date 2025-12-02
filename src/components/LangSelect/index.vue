<template>
  <el-dropdown trigger="click" @command="handleLanguageChange">
    <div class="lang-select--style">
      <svg-icon icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="appStore.language === 'zh_CN'" command="zh_CN"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language === 'en_US'" command="en_US"> English </el-dropdown-item>
        <el-dropdown-item :disabled="appStore.language === 'ko_KR'" command="ko_KR"> 한국어 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/modules/app';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { checkTime } from '@/layout/components/ApiSetting/apiSetting';

const appStore = useAppStore();
const { locale } = useI18n();

const message: any = {
  zh_CN: '切换语言成功！',
  en_US: 'Switch Language Successful!',
  ko_KR: '언어 변경이 완료되었습니다!'
};
const handleLanguageChange = (lang: any) => {
  locale.value = lang;
  appStore.changeLanguage(lang);
  ElMessage.success(message[lang] || '切换语言成功！');
  const check = checkTime();
  console.log(check);
};
</script>

<style lang="scss" scoped>
.lang-select--style {
  font-size: 18px;
  line-height: 50px;
}
</style>
