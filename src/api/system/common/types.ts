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
export interface EnableLossPointBody {
  lossPointId?: string | number;
  enable?: number;
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
  status?: string | number;
  ip?: string | number;
  currRoleSize?: string | number;
  maxRoleSize?: string | number;
}
export interface SetLeverageBody {
  category?: string | number;
  symbol?: string | number;
  buyLeverage?: string | number;
  sellLeverage?: string | number;
}
export interface QueryBalanceBody {
  exchange?: string | number;
  symbol?: string | number;
  coin?: string | number;
}
export interface QueryFeeBody {
  exchange?: string | number;
  symbol?: string | number;
}
export interface AccountBalance {
  balance?: string | number;
  symbol?: string | number;
}

export interface SymbolFee {
  symbol: string;

  // 合约吃单手续费
  linerTakerFeeRate: number; // 或者 BigNumber 类型

  // 合约挂单手续费
  linerMakerFeeRate: number;

  // 现货吃单手续费
  sportTakerFeeRate: number;

  // 现货挂单手续费
  sportMakerFeeRate: number;
}

export interface OrderResult {
  success?: boolean;
  logs?: string[];
}
