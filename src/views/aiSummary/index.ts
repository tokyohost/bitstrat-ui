import { AiStreamQuery } from '@/views/aiSummary/type';
import { getToken } from '@/utils/auth';
import { getEnv } from '@/env';

export async function streamDifyPost(params: AiStreamQuery) {
  const response = await fetch('/api/aireq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  return response.body;
}

export async function streamAIPost(params: AiStreamQuery, onChunk: (text: string) => void, onError: (err: any) => void) {
  try {
    const { BASE_API } = getEnv();
    const baseUrl = BASE_API;

    const response = await fetch(baseUrl + '/stream/aireq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + getToken(),
        clientid: import.meta.env.VITE_APP_CLIENT_ID
      },
      body: JSON.stringify(params)
    });

    // ----------- 新增 HTTP 错误处理 -----------
    if (!response.ok) {
      let errText = '';
      try {
        errText = await response.text(); // 后端的错误信息
      } catch {}
      throw new Error(errText || `请求失败: ${response.status}`);
    }

    // 若没有 body（理论不会发生，但保险）
    if (!response.body) {
      throw new Error('后端未返回流');
    }
    // -----------------------------------------

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });

      onChunk(text);
    }
  } catch (err: any) {
    onError(err);
  }
}
