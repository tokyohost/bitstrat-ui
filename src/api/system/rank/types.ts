export interface RankVO {
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

}

export interface RankForm extends BaseEntity {
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

}

export interface RankQuery extends PageQuery {

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
     * 日期范围参数
     */
    params?: any;


  orderByColumn?: string
  isAsc?: string
}



