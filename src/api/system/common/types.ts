export interface StrategyVo {
  name: string;
  id: number;
}

export interface PositionStrategyVo {
  name: string;
  description: string;
  id: number;
}

export interface MarketIntervalVo {
  name: string;
  interval: string;
}

export interface ExchangeVo {
  name: string;
  desc: string;
}
export interface SyncLossPoint {
  clientId?: string | number;
  lossPointId?: string | number;
}
export interface DeviceInfo {
  clientId?: string | number;
  delay?: string | number;
  status?: string | number;
  exchangeName?: string | number;
}
export interface ExchangeData {
  clientId?: string | number;
  delay?: string | number;
  nodeName?: string | number;
  exchangeName?: string | number;
}
