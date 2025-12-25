// @/hooks/useChart.ts
import { inject, onMounted } from 'vue';

export function useChartAutoRegister(refreshFn: () => Promise<any>) {
  // 注入父组件提供的注册方法
  const register = inject<(fn: () => Promise<any>) => void>('CHART_WRAPPER_REGISTER', undefined);

  onMounted(() => {
    if (register) {
      register(refreshFn);
    }
  });
}
