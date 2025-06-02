export interface OrderVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 任务id
   */
  taskId: string | number;

  /**
   * 订单id
   */
  orderId: string | number;

  /**
   * 交易所名称
   */
  ex: string;

  /**
   * 币对
   */
  symbol: string;

  /**
   * 数量
   */
  size: string;

  /**
   * 状态
   */
  status: string;

  /**
   * 手续费
   */
  fee: string;

  /**
   * 平均价格
   */
  avgPrice: string;

  /**
   * 下单价格
   */
  price: string;

  /**
   * 下单方向
   */
  side?: string;
  /**
   * 是否是平仓单 1-是 0-不是
   */
  closePositionOrder?: number;

  cumExecQty: string | number;
  orderEnd: string | number;
  leavesQty: string | number;
  leavesValue: string | number;
  cumExecValue: string | number;
  marketPrice: string;
  createTime: string,
  updateTime: string,
}

export interface OrderForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 订单id
   */
  orderId?: string | number;

  /**
   * 交易所名称
   */
  ex?: string;

  /**
   * 币对
   */
  symbol?: string;

  /**
   * 数量
   */
  size?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 手续费
   */
  fee?: string;

  /**
   * 平均价格
   */
  avgPrice?: string;

  /**
   * 下单价格
   */
  price?: string;
}

export interface OrderQuery extends PageQuery {
  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 订单id
   */
  orderId?: string | number;

  /**
   * 交易所名称
   */
  ex?: string;

  /**
   * 币对
   */
  symbol?: string;

  /**
   * 数量
   */
  size?: string;

  /**
   * 状态
   */
  status?: string;

  /**
   * 手续费
   */
  fee?: string;

  /**
   * 平均价格
   */
  avgPrice?: string;

  /**
   * 下单价格
   */
  price?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
