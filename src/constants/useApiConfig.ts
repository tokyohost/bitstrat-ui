import { ref } from 'vue';

export function useApiConfig() {
  const configForm = ref({
    exchangeName: null,
    name: null,
    apiKey: '',
    secret: '',
    passphrase: ''
  });

  const fieldConfigs = {
    binance: [
      { label: 'API Key', prop: 'apiKey' },
      { label: 'Secret', prop: 'secret', type: 'password', showPassword: true }
    ],
    okx: [
      { label: 'API Key', prop: 'apiKey' },
      { label: 'Secret', prop: 'secret', type: 'password', showPassword: true },
      { label: 'Passphrase', prop: 'passphrase', type: 'password', showPassword: true }
    ],
    bitget: [
      { label: 'API Key', prop: 'apiKey' },
      { label: 'Secret', prop: 'secret', type: 'password', showPassword: true },
      { label: 'Passphrase', prop: 'passphrase', type: 'password', showPassword: true }
    ],
    bybit: [
      { label: 'API Key', prop: 'apiKey' },
      { label: 'Secret', prop: 'secret', type: 'password', showPassword: true }
    ]
  };

  return {
    configForm,
    fieldConfigs
  };
}
