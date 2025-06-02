// utils/eventBus.ts
import mitt from 'mitt'
import { OrderVO } from '@/api/system/order/types';
import { PositionWsData, WebsocketMsgData } from '@/views/components/type/type';

// 自定义事件类型（可按需添加）
type Events = {
  wsMessage: any,
  orderMessage: OrderVO,
  positionMessage: WebsocketMsgData<PositionWsData[]>,
}

export const emitter = mitt<Events>()
