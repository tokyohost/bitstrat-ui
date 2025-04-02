import defaultSettings from '@/settings';
import { useSettingsStore } from '@/store/modules/settings';
import { i18nMsg } from '@/layout/components';

/**
 * 动态修改标题
 */
export const useDynamicTitle = () => {
  const settingsStore = useSettingsStore();
  if (settingsStore.dynamicTitle) {
    console.log(settingsStore.title);
    document.title = i18nMsg(settingsStore.title) + ' - ' + import.meta.env.VITE_APP_TITLE;
  } else {
    document.title = i18nMsg(defaultSettings.title) as string;
  }
};
