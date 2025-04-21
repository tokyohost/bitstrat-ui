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

  cumExecQty: string | number;
  orderEnd: string | number;
  leavesQty: string | number;
  leavesValue: string | number;
  cumExecValue: string | number;
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
