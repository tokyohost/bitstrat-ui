interface ExchangeInfo {
  logo: string;
  name: string;
  position: string | number;
  pnl: string | number;
  entryPrice: string | number;
  fundingRate: string | number;
  latestPrice: string | number;
}

interface Summary {
  createdAt: string;
  runTime: string;
  totalProfit: string | number;
  profitRate: string | number;
  annualProfit: string | number;
  totalFundingRate: string | number;
}
export interface ArbitrageFormData {
  leverage?: number;

  size?: number;

  actualSize?: number;

  fundingIncome?: number;

  fundingRate?: number;
}

export interface AbTaskFrom {
  buy?: ArbitrageFormData;

  sell?: ArbitrageFormData;
}

export interface ExchangeItem {
  symbol?: string;

  fundingIntervalHours?: number;

  openInterest?: number;

  rate?: number;

  exchangeName?: string;

  predictedRate?: number;

  exchangeLogo?: string;

  url?: string;

  status?: number;
}

export interface CoinFundingInfo {
  buy?: ExchangeItem;

  sell?: ExchangeItem;

  buyPrice?: number;

  symbol?: string;

  apr?: number;

  funding?: number;

  fee?: number;

  nextFundingTime?: number;

  sellPrice?: number;

  symbolLogo?: string;

  spread?: number;
}

/**
 * 创建跨交易所套利任务
 */
export interface CreateArbitrageTaskVo {
  from?: AbTaskFrom;

  argitrageData?: CoinFundingInfo;

  batchIncome?: number;

  batchPrice?: number;
}

export interface websocketExAccount {
  exchange: string;
  accountId: number;
}
