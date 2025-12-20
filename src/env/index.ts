import { RuntimeEnv } from '@/env/type';

declare global {
  interface Window {
    __ENV__?: RuntimeEnv;
  }
}

/**
 * 获取运行时环境变量（k3s / nginx 注入）
 */
export const getRuntimeEnv = (): RuntimeEnv => {
  return window.__ENV__ || {};
};

/**
 * 带兜底的读取方式
 * - 优先 runtime env
 * - fallback 到 vite env（本地 dev）
 */
export const getEnv = (): RuntimeEnv => {
  const runtime = getRuntimeEnv();

  return {
    CONTEXT_PATH: runtime.CONTEXT_PATH || import.meta.env.VITE_APP_CONTEXT_PATH,

    BASE_API: runtime.BASE_API || import.meta.env.VITE_APP_BASE_API,

    MONITOR_ADMIN: runtime.MONITOR_ADMIN || import.meta.env.VITE_APP_MONITOR_ADMIN,

    SNAILJOB_ADMIN: runtime.SNAILJOB_ADMIN || import.meta.env.VITE_APP_SNAILJOB_ADMIN,

    API_WS_SERVER: runtime.API_WS_SERVER || import.meta.env.VITE_APP_API_WS_SERVER,

    USER_WS_SERVER: runtime.USER_WS_SERVER || import.meta.env.VITE_APP_USER_WEBSOCKET_SERVER
  };
};
