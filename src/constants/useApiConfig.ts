import { useI18n } from 'vue-i18n';
import { computed, ref } from 'vue';

export const useApiConfig = () => {
  const { t } = useI18n();

  const configForm = ref({
    exchangeName: undefined,
    name: undefined,
    apiKey: '',
    secret: '',
    passphrase: '',
    type: ''
  });

  // 返回字段配置对象
  const fieldConfigs = computed(() => {
    return {
      binance: [
        { label: t('apiSetting.fields.apiKey'), prop: 'apiKey' },
        { label: t('apiSetting.fields.secret'), prop: 'secret', type: 'password', showPassword: true }
      ],
      okx: [
        { label: t('apiSetting.fields.apiKey'), prop: 'apiKey' },
        { label: t('apiSetting.fields.secret'), prop: 'secret', type: 'password', showPassword: true },
        { label: t('apiSetting.fields.passphrase'), prop: 'passphrase', type: 'password', showPassword: true }
      ],
      bitget: [
        { label: t('apiSetting.fields.apiKey'), prop: 'apiKey' },
        { label: t('apiSetting.fields.secret'), prop: 'secret', type: 'password', showPassword: true },
        { label: t('apiSetting.fields.passphrase'), prop: 'passphrase', type: 'password', showPassword: true }
      ],
      bybit: [
        { label: t('apiSetting.fields.apiKey'), prop: 'apiKey' },
        { label: t('apiSetting.fields.secret'), prop: 'secret', type: 'password', showPassword: true }
      ]
    };
  });

  // 获取特定交易所的字段配置
  const getExchangeFields = (exchangeName: string | undefined) => {
    if (!exchangeName) return [];
    const exchange = exchangeName.toLowerCase();
    return fieldConfigs.value[exchange as keyof typeof fieldConfigs.value] || [];
  };

  return {
    configForm,
    fieldConfigs,
    getExchangeFields
  };
};
