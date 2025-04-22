export interface CrossExchangeArbitrageTaskVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 做多交易所
   */
  longEx: string;

  /**
   * 做多币对
   */
  longSymbol: string;

  /**
   * 做多金额 USDT
   */
  longSize: number;

  /**
   * 做多持仓数量
   */
  longSymbolSize: number;

  /**
   * 做多入场价
   */
  longAvgPrice: string;

  /**
   * 做多出场价
   */
  longOutPrice: string;

  /**
   * 做多盈亏 USDT
   */
  longProfit: number;

  /**
   * 做多入场时间
   */
  longInTime: string;

  /**
   * 做多杠杆倍数
   */
  longLeverage: number;

  /**
   * 做多开仓手续费
   */
  longInFee: number;

  /**
   * 做多平仓手续费
   */
  longOutFee: number;

  /**
   * 做空交易所
   */
  shortEx: string;

  /**
   * 做空币对
   */
  shortSymbol: string;

  /**
   * 做空金额 USDT
   */
  shortSize: number;

  /**
   * 做空持仓数量
   */
  shortSymbolSize: number;

  /**
   * 做空入场价
   */
  shortAvgPrice: string;

  /**
   * 做空出场价
   */
  shortOutPrice: string;

  /**
   * 做空盈亏 USDT
   */
  shortProfit: number;

  /**
   * 做空入场时间
   */
  shortInTime: string;

  /**
   * 做空杠杆倍数
   */
  shortLeverage: number;

  /**
   * 做空开仓手续费
   */
  shortInFee: number;

  /**
   * 做空平仓手续费
   */
  shortOutFee: number;

  /**
   * 执行节点clientId
   */
  excuteNodeId: string | number;

  /**
   * 总盈亏 USDT
   */
  totalProfit: number;

  /**
   * 状态 1-正在运行 2-已停止 3-未启动
   */
  status: number;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 任务开始时间戳
   */
  startTime: number;

  createTime: string;
  symbol?: string;

  role?: string;
}

export interface CrossExchangeArbitrageTaskForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 做多交易所
   */
  longEx?: string;

  /**
   * 做多币对
   */
  longSymbol?: string;

  /**
   * 做多金额 USDT
   */
  longSize?: number;

  /**
   * 做多持仓数量
   */
  longSymbolSize?: number;

  /**
   * 做多入场价
   */
  longAvgPrice?: string;

  /**
   * 做多出场价
   */
  longOutPrice?: string;

  /**
   * 做多盈亏 USDT
   */
  longProfit?: number;

  /**
   * 做多入场时间
   */
  longInTime?: string;

  /**
   * 做多杠杆倍数
   */
  longLeverage?: number;

  /**
   * 做多开仓手续费
   */
  longInFee?: number;

  /**
   * 做多平仓手续费
   */
  longOutFee?: number;

  /**
   * 做空交易所
   */
  shortEx?: string;

  /**
   * 做空币对
   */
  shortSymbol?: string;

  /**
   * 做空金额 USDT
   */
  shortSize?: number;

  /**
   * 做空持仓数量
   */
  shortSymbolSize?: number;

  /**
   * 做空入场价
   */
  shortAvgPrice?: string;

  /**
   * 做空出场价
   */
  shortOutPrice?: string;

  /**
   * 做空盈亏 USDT
   */
  shortProfit?: number;

  /**
   * 做空入场时间
   */
  shortInTime?: string;

  /**
   * 做空杠杆倍数
   */
  shortLeverage?: number;

  /**
   * 做空开仓手续费
   */
  shortInFee?: number;

  /**
   * 做空平仓手续费
   */
  shortOutFee?: number;

  /**
   * 执行节点clientId
   */
  excuteNodeId?: string | number;

  /**
   * 总盈亏 USDT
   */
  totalProfit?: number;

  /**
   * 状态 1-正在运行 2-已停止 3-未启动
   */
  status?: number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 任务开始时间戳
   */
  startTime?: number;
}

export interface CrossExchangeArbitrageTaskQuery extends PageQuery {
  /**
   * 日期范围参数
   */
  params?: any;

  status?: string | number;
}
