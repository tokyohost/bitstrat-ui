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
