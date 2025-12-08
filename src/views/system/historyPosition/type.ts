export interface HistoryPositionQuery {
  exchange: string;

  apiId: number;

  size?: number;

  symbol?: string;

  startTime?: string;

  endTime?: string;

  idLessThan?: string;
}

export interface HistoryPosition {
  openAvgPrice?: number;

  symbol?: string;

  utime?: string;

  openFee?: number;

  marginCoin?: string;

  posMode?: string;

  marginMode?: string;

  totalFunding?: number;

  closeFee?: number;

  netProfit?: number;

  pnl?: number;

  openTotalPos?: number;

  positionId?: string;

  holdSide?: string;

  posSide?: string;

  leverage?: string;

  ctime?: string;

  closeTotalPos?: number;

  closeAvgPrice?: number;

  idLessThan?: string;
}

export interface HistoryPositionTpslQuery {
  exchange: string;

  apiId: number;

  symbol?: string;
}

/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/10/27 17:18
 * @Content
 */
export interface TpSlOrder {
  symbol?: string;

  takeProfitPrice?: string;

  stopLossPrice?: string;
}
