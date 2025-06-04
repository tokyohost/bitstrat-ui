import { ApiVO } from '@/api/system/api/types';

export interface ComponentItem {
  cid: number;
  id?: number | string;
  name: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  component: any;
  minHeight?: number;
  minWidth?: number;
  hasSetting?: boolean;
  compontentData?: CompontentData; //组件数据
}
export interface CompontentData {
  id?: number | string;
}
//价差对比组件数据
export interface CompareWidget extends CompontentData {
  businessType?: string;
  exchangeA: string;
  symbolA: string;
  typeA: string;
  exchangeB: string;
  symbolB: string;
  typeB: string;
  symbolTmpA?: string;
  symbolTmpB?: string;
}
export interface ABOrderData extends CompareWidget {
  taskId?: number | string;
  delyA?: number; //A单延迟时间
  delyB?: number; //B单延迟时间
  accountA?: ApiVO;
  accountB?: ApiVO;
  operate?: ABOrderForm;

  lastUpdateTime?: string; //最后更新时间
  serverTime?: string; //服务器时间
}

export interface PositionWsData {
  exchange?: string;

  /**
   * 仓位类型
   * see {@link PositionType}
   */
  posType?: string;

  symbol?: string;

  size?: number;

  /**
   * see {@link SideType}
   */
  side?: string;

  avgPrice?: number;

  /**
   * 资金费
   */
  fundingFee?: number;

  /**
   * 手续费
   */
  fee?: number;

  /**
   * 盈亏
   */
  profit?: number;

  /**
   * 未实现盈亏
   */
  unrealizedProfit?: number;

  /**
   * 保证金模式
   */
  marginType?: string;

  /**
   * 保证金
   */
  marginPrice?: number;

  /**
   * 保证金率
   */
  marginRatio?: number;

  /**
   * api名称
   */
  accountName?: string;

  /**
   * 更新时间
   */
  updateTime?: string;

  /**
   * 杠杆倍数
   */
  leverage?: number;

  /**
   * 预估强平价
   */
  liqPrice?: number;

  /**
   * 是否平仓
   */
  closed?: boolean;

  accountId?: number;
}

export interface WebsocketMsgData<T> {
  /**
   * see {@link WebsocketMsgType}
   */
  type?: string;

  accountId?: number;

  exchangeName?: string;

  data?: T;
}

export interface ABOrderForm {
  type?: 'plusAminB' | 'plusBminA';
  size?: number;
  coldSec?: number;
  maxSize?: number;
  gap?: number;
  closeGap?: number;
  openGap?: number;
  reduceOnly?: 1 | 0;
  status?: 'run' | 'stop';
}

export function getdefaultLayout() {
  return (
    '[\n' +
    '  {\n' +
    '    "cid": 1,\n' +
    '    "id": "9f387c21-3660-4b26-a1f7-881f6761f64a",\n' +
    '    "name": "价差监控",\n' +
    '    "x": 0,\n' +
    '    "y": 0,\n' +
    '    "w": 1080,\n' +
    '    "h": 560,\n' +
    '    "hasSetting": true,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      "typeA": "swap",\n' +
    '      "exchangeA": "okx",\n' +
    '      "symbolTmpA": "ETH-USDT-SWAP",\n' +
    '      "symbolA": "ETH",\n' +
    '      "typeB": "swap",\n' +
    '      "exchangeB": "binance",\n' +
    '      "symbolTmpB": "ETHUSDT",\n' +
    '      "symbolB": "ETH",\n' +
    '      "id": "9fd1c2a2-d66d-4809-b51c-6730b1d4d0dc"\n' +
    '    },\n' +
    '    "minWidth": 1200,\n' +
    '    "minHeight": 560\n' +
    '  },\n' +
    '  {\n' +
    '    "cid": 3,\n' +
    '    "id": "c44583e5-8c03-4798-b0d2-5793d4d79ad6",\n' +
    '    "name": "挂单",\n' +
    '    "x": 1430,\n' +
    '    "y": 0,\n' +
    '    "w": 300,\n' +
    '    "h": 930,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      \n' +
    '    }\n' +
    '  },\n' +
    '  {\n' +
    '    "cid": 4,\n' +
    '    "id": "e2113333-d14b-42d2-8cad-24dc1a563dab",\n' +
    '    "name": "成交记录",\n' +
    '    "x": 1740,\n' +
    '    "y": 0,\n' +
    '    "w": 300,\n' +
    '    "h": 930,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      \n' +
    '    }\n' +
    '  },\n' +
    '  {\n' +
    '    "cid": 5,\n' +
    '    "id": "6dfc05dc-55e6-41e4-92c1-517ef0c56c02",\n' +
    '    "name": "消息通知",\n' +
    '    "x": 1090,\n' +
    '    "y": 530,\n' +
    '    "w": 330,\n' +
    '    "h": 400,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      \n' +
    '    }\n' +
    '  },\n' +
    '  {\n' +
    '    "cid": 7,\n' +
    '    "id": "ff275ee3-9be0-4d2f-be28-8931927db02a",\n' +
    '    "name": "实时持仓",\n' +
    '    "x": 0,\n' +
    '    "y": 570,\n' +
    '    "w": 1080,\n' +
    '    "h": 360,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      \n' +
    '    }\n' +
    '  },\n' +
    '  {\n' +
    '    "cid": 6,\n' +
    '    "id": "473aded0-100e-4a86-9b28-22a4ad178270",\n' +
    '    "name": "自动双腿下单",\n' +
    '    "x": 1090,\n' +
    '    "y": 0,\n' +
    '    "w": 330,\n' +
    '    "h": 520,\n' +
    '    "hasSetting": true,\n' +
    '    "component": {\n' +
    '      "name": "AsyncComponentWrapper"\n' +
    '    },\n' +
    '    "compontentData": {\n' +
    '      \n' +
    '    }\n' +
    '  }\n' +
    ']'
  );
}
/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/6/3 21:26
 * @Content
 */
export interface WebsocketMsgDataAi<T> {
  type?: string;

  data?: T;
}
