import i18n from '@/lang';

export { default as AppMain } from './AppMain.vue';
export { default as Navbar } from './Navbar.vue';
export { default as Settings } from './Settings/index.vue';
export { default as TagsView } from './TagsView/index.vue';

const i18nMsg = <T extends string>(key: T): string => {
  i18n.global.t(`menu.${key}`);

  let ivalue
  if(i18n.global.te(`menu.${key}` as unknown as Parameters<typeof i18n.global.te>[0])){
    ivalue= i18n.global.t(`menu.${key}` as unknown as Parameters<typeof i18n.global.t>[0]);
  }else{
    ivalue = key
  }
  return ivalue ;
};

export {i18nMsg}
