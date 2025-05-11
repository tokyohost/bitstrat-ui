export interface SymbolFundingRate {
  /**
   * 资金费率
   */
  fundingRate?: number;

  /**
   * 下次资金结算时间戳
   */
  nextFundingTime?: number;
}

/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/5/11 17:19
 * @Content
 */
export interface LinerSymbol {
  symbol?: string;

  coin?: string;

  fundingInterval?: number;
}
