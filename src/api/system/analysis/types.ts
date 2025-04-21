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
  /**
   * 收益
   */
  fundingIncome?: number;
  fundingRate?: number;
}
export interface ArbitrageTaskForm {
  buy?: ExchangeItemForm;
  sell?: ExchangeItemForm;
  batchIncome?: number; // 分批入场
  batchPrice?: number; //每批数量
  taskId?: string | number;
}

export interface ExchangeItem {
  name?: string;
  logo?: string;
}
export interface FundingRate {
  rate?: number;
}
export interface CoinContractInformation {
  /** 单笔最大市价单委托数量 */
  maxMktSz?: number;

  /** 单笔最大限价单委托数量 */
  maxLmtSz?: number;

  /** 最小委托数量 */
  minSz?: number;

  /** 最大杠杆数 */
  maxLeverage?: number;

  /** 最小杠杆数 */
  minLeverage?: number;

  /** 合约面值  10 就是10个对应的币对数量 */
  contractValue?: number;

  /** 合约乘数  1 就是合约面值*合约乘数 一个合约等于 合约面值*合约乘数  1张 = 1 * 10 = 10 */
  ctMult?: number;

  /** 币种名称 */
  symbol?: string;

  /** 当前价格 */
  price?: number;
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
