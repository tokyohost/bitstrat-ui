export interface LossPointVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 交易所名称
   */
  exchangeName: string;

  /**
   * 币种
   */
  symbol: string;
  nodeClientId: string;

  /**
   * 价格
   */
  price: number;

  /**
   * 回撤率
   */
  retread: number;

  /**
   * 下单数量
   */
  quantity: number;
}

export interface LossPointForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 交易所名称
   */
  exchangeName?: string;

  /**
   * 币种
   */
  symbol?: string;
  nodeClientId?: string;

  /**
   * 价格
   */
  price?: number;
  triggerPrice1?: number;
  triggerPrice2?: number;

  /**
   * 回撤率
   */
  retread?: number;

  /**
   * 下单数量
   */
  quantity?: number;
}

export interface LossPointQuery extends PageQuery {
  /**
   * 交易所名称
   */
  exchangeName?: string;

  /**
   * 币种
   */
  symbol?: string;
  nodeClientId?: string;

  /**
   * 价格
   */
  price?: number;

  /**
   * 回撤率
   */
  retread?: number;

  /**
   * 下单数量
   */
  quantity?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
