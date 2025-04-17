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
}
export interface ArbitrageTaskForm {
  buy?: ExchangeItemForm;
  sell?: ExchangeItemForm;
}

export interface ExchangeItem {
  name?: string;
  logo?: string;
}
