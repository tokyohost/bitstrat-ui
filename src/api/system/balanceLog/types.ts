export interface BalanceLogVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 变动前余额
   */
  beforeBalance: number;

  /**
   * 变动金额（正为增加，负为扣减）
   */
  changeAmount: number;

  /**
   * 变动后余额
   */
  afterBalance: number;

  /**
   * 变动类型：1=充值，2=消费，3=退款，4=赠送
   */
  type: number;

  /**
   * 备注信息，例如订单号/充值方式
   */
  remark: string;
}

export interface BalanceLogForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 变动前余额
   */
  beforeBalance?: number;

  /**
   * 变动金额（正为增加，负为扣减）
   */
  changeAmount?: number;

  /**
   * 变动后余额
   */
  afterBalance?: number;

  /**
   * 变动类型：1=充值，2=消费，3=退款，4=赠送
   */
  type?: number;

  /**
   * 备注信息，例如订单号/充值方式
   */
  remark?: string;
}

export interface BalanceLogQuery extends PageQuery {
  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 变动前余额
   */
  beforeBalance?: number;

  /**
   * 变动金额（正为增加，负为扣减）
   */
  changeAmount?: number;

  /**
   * 变动后余额
   */
  afterBalance?: number;

  /**
   * 变动类型：1=充值，2=消费，3=退款，4=赠送
   */
  type?: number | string;

  /**
   * 日期范围参数
   */
  params?: any;
}
