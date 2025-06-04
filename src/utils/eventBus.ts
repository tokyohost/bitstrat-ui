// utils/eventBus.ts
import mitt from 'mitt';
import { OrderVO } from '@/api/system/order/types';
import { ABOrderData, PositionWsData, WebsocketMsgData } from '@/views/components/type/type';
import { WebsocketExStatus, WebsocketStatus } from '@/layout/components/NotifySetting/types';

// 自定义事件类型（可按需添加）
type Events = {
  wsMessage: any;
  orderMessage: OrderVO;
  positionMessage: WebsocketMsgData<PositionWsData[]>;
  accountMessage: WebsocketExStatus[];
  abOrderMessage: ABOrderData[];
};

export const emitter = mitt<Events>();
