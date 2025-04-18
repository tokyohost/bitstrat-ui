export interface CMargin {
  fundingIntervalHours?: number;
  rate?: number;
  nextFundingTime?: number;
  exchangeName?: string;
  exchangeLogo?: string;
  status?: string;
}

export interface UMargin {
  fundingIntervalHours?: number;
  rate?: number;
  nextFundingTime?: number;
  exchangeName?: string;
  exchangeLogo?: string;
  status?: string;
}

export interface ArbitrageItem {
  cMarginList: CMargin[];
  uMarginList: UMargin[];
  symbol?: string;
  uIndexPrice?: number;
  uPrice?: number;
  cPrice?: number;
  symbolLogo?: string;
  cIndexPrice?: number;
  status?: number;
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

export interface ArbitrageQuery {
  symbol?: string;
  exchange?: string;
}
export interface ExchangeItemForm extends ExchangeItem {
  size?: number;
  leverage?: number;
  actualSize?: number;
}
export interface ArbitrageTaskForm {
  buy?: ExchangeItemForm;
  sell?: ExchangeItemForm;
}

export interface ExchangeItem {
  name?: string;
  logo?: string;
}

export interface SportFundingRateItem {
  quoteCurrency: string;
  symbol: string;
  futuresType: string;
  threeDayFundingRate: number | null; // 对应 Java Double，允许 null
  yearFundingRate: number | null;
  currencyLog: string;
  spotType: string;
  currency: string;
  exchangeName: string;
  fundingRatePositive: number | null; // Java Long → number（建议使用 bigint 若超出 JS 安全范围）
  updateTime: number | null;
  fundingRate: number | null;
}
