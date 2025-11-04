export interface TestAiResultVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 操作
   */
  action: string;

  /**
   * 杠杆
   */
  leverage: number;

  /**
   * 数量
   */
  size: string;

  /**
   * 币对
   */
  symbol: string;

  /**
   * 止盈
   */
  takeProfit: string;

  /**
   * 止损
   */
  stopLoss: string;

  /**
   * 分析EN
   */
  reasoningEn: string;

  /**
   * 分析zh
   */
  reasoningZh: string;

}

export interface TestAiResultForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 操作
   */
  action?: string;

  /**
   * 杠杆
   */
  leverage?: number;

  /**
   * 数量
   */
  size?: string;

  /**
   * 币对
   */
  symbol?: string;

  /**
   * 止盈
   */
  takeProfit?: string;

  /**
   * 止损
   */
  stopLoss?: string;

  /**
   * 分析EN
   */
  reasoningEn?: string;

  /**
   * 分析zh
   */
  reasoningZh?: string;

}

export interface TestAiResultQuery extends PageQuery {

  /**
   * 操作
   */
  action?: string;

  /**
   * 杠杆
   */
  leverage?: number;

  /**
   * 数量
   */
  size?: string;

  /**
   * 币对
   */
  symbol?: string;

  /**
   * 止盈
   */
  takeProfit?: string;

  /**
   * 止损
   */
  stopLoss?: string;

  /**
   * 分析EN
   */
  reasoningEn?: string;

  /**
   * 分析zh
   */
  reasoningZh?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



