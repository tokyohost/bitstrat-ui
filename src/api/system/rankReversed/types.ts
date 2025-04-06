export interface RankReversedVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 得分
   */
  score: number;

  /**
   * 当前市价
   */
  marketPrice: string;

  /**
   * 涨跌百分比
   */
  percentage: number;

  /**
   * 排名
   */
  rank: number;

}

export interface RankReversedForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 得分
   */
  score?: number;

  /**
   * 当前市价
   */
  marketPrice?: string;

  /**
   * 涨跌百分比
   */
  percentage?: number;

  /**
   * 排名
   */
  rank?: number;

}

export interface RankReversedQuery extends PageQuery {

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 得分
   */
  score?: number;

  /**
   * 当前市价
   */
  marketPrice?: string;

  /**
   * 涨跌百分比
   */
  percentage?: number;

  /**
   * 排名
   */
  rank?: number;

    /**
     * 日期范围参数
     */
    params?: any;
  orderByColumn?: string
  isAsc?: string
}



