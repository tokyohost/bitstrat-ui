export interface BatchVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 任务id
   */
  taskId: string | number;

  /**
   * 买入交易所
   */
  buyEx: string;

  /**
   * 买入总数量
   */
  buyTotal: number;

  /**
   * 卖出交易所
   */
  sellEx: string;

  /**
   * 卖出总数量
   */
  sellTotal: number;

  /**
   * 总批次数量
   */
  totalSize: number;

  /**
   * 总批次
   */
  batchTotal: number;

  /**
   * 已完成批次
   */
  doneBatch: number;

  /**
   * 已完成数量
   */
  doneSize: number;

  /**
   * 状态 10-正在执行 20-执行异常 30-已执行完毕  40-已终止
   */
  status: number;

  /**
   * 异常信息
   */
  msg: string;

  /**
   * 开始时间
   */
  startTime: string;

  /**
   * 结束时间
   */
  endTime: string;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * 操作类型，1-加仓，2-平仓
   */
  side: string | number;

  /**
   * 每批次操作比例
   */
  batchSize: number;

  /**
   * 已完成卖单总数
   */
  doneSellSize: number;

  /**
   * 已完成买单总数
   */
  doneBuySize: number;

  /**
   * 卖出订单类型
   */
  sellOrderType: string;

  /**
   * 买入订单类型
   */
  buyOrderType: string;

  /**
   * 卖出杠杆倍数
   */
  sellLeverage: number;

  /**
   * 买入杠杆倍数
   */
  buyLeverage: number;

  /**
   * 币对
   */
  symbol: string;

}

export interface BatchForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 买入交易所
   */
  buyEx?: string;

  /**
   * 买入总数量
   */
  buyTotal?: number;

  /**
   * 卖出交易所
   */
  sellEx?: string;

  /**
   * 卖出总数量
   */
  sellTotal?: number;

  /**
   * 总批次数量
   */
  totalSize?: number;

  /**
   * 总批次
   */
  batchTotal?: number;

  /**
   * 已完成批次
   */
  doneBatch?: number;

  /**
   * 已完成数量
   */
  doneSize?: number;

  /**
   * 状态 10-正在执行 20-执行异常 30-已执行完毕  40-已终止
   */
  status?: number;

  /**
   * 异常信息
   */
  msg?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 操作类型，1-加仓，2-平仓
   */
  side?: string | number;

  /**
   * 每批次操作比例
   */
  batchSize?: number;

  /**
   * 已完成卖单总数
   */
  doneSellSize?: number;

  /**
   * 已完成买单总数
   */
  doneBuySize?: number;

  /**
   * 卖出订单类型
   */
  sellOrderType?: string;

  /**
   * 买入订单类型
   */
  buyOrderType?: string;

  /**
   * 卖出杠杆倍数
   */
  sellLeverage?: number;

  /**
   * 买入杠杆倍数
   */
  buyLeverage?: number;

  /**
   * 币对
   */
  symbol?: string;

}

export interface BatchQuery extends PageQuery {

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 买入交易所
   */
  buyEx?: string;

  /**
   * 买入总数量
   */
  buyTotal?: number;

  /**
   * 卖出交易所
   */
  sellEx?: string;

  /**
   * 卖出总数量
   */
  sellTotal?: number;

  /**
   * 总批次数量
   */
  totalSize?: number;

  /**
   * 总批次
   */
  batchTotal?: number;

  /**
   * 已完成批次
   */
  doneBatch?: number;

  /**
   * 已完成数量
   */
  doneSize?: number;

  /**
   * 状态 10-正在执行 20-执行异常 30-已执行完毕  40-已终止
   */
  status?: number;

  /**
   * 异常信息
   */
  msg?: string;

  /**
   * 开始时间
   */
  startTime?: string;

  /**
   * 结束时间
   */
  endTime?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 操作类型，1-加仓，2-平仓
   */
  side?: string | number;

  /**
   * 每批次操作比例
   */
  batchSize?: number;

  /**
   * 已完成卖单总数
   */
  doneSellSize?: number;

  /**
   * 已完成买单总数
   */
  doneBuySize?: number;

  /**
   * 卖出订单类型
   */
  sellOrderType?: string;

  /**
   * 买入订单类型
   */
  buyOrderType?: string;

  /**
   * 卖出杠杆倍数
   */
  sellLeverage?: number;

  /**
   * 买入杠杆倍数
   */
  buyLeverage?: number;

  /**
   * 币对
   */
  symbol?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



