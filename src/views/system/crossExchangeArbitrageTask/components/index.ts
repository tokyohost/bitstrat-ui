import { ref } from 'vue';
import { WebsocketStatus } from '@/layout/components/NotifySetting/types';
import { getWebsocketStatus } from '@/layout/components/NotifySetting/notifySetting';
import { AxiosPromise } from 'axios';
import { LinerSymbol } from '@/views/system/analysis/components/type';
import request from '@/utils/request';

export function connectSocketByEx(exs: WebsocketStatus[]): AxiosPromise<LinerSymbol[]> {
  return request({
    url: '/common/connectSocketByEx',
    method: 'post',
    data: {
      exchanges: exs
    }
  });
}

export async function checkWebsocketStatus(exchanges: string[]) {
  const exchangeList = ref<WebsocketStatus[]>([
    {
      exchange: undefined,
      status: undefined
    }
  ]);
  try {
    // 获取 WebSocket 状态
    const axiosResponse = await getWebsocketStatus();

    // 假设 axiosResponse.data 是包含多个交易所状态的数据
    exchangeList.value = axiosResponse.data;

    // 过滤出状态不是 'active' 的交易所
    const nonActiveExchanges = exchanges.filter((exchangeName) => {
      const exchange = exchangeList.value.find((item) => item.exchange.toLowerCase() === exchangeName.toLowerCase());
      return exchange ? exchange.status !== 'active' : true; // 如果没有找到交换所，默认认为它是非 active
    });

    if (nonActiveExchanges.length > 0) {
      console.log('以下交易所的 WebSocket 状态不是 active:', nonActiveExchanges);
      await connectSocketByEx(nonActiveExchanges);
      console.log('已建立链接');
    } else {
      console.log('所有交易所都处于 active 状态');
    }
  } catch (error) {
    console.error('检查 WebSocket 状态时发生错误:', error);
  }
}
