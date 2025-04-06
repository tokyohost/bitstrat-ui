export interface RankLogVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 币种id
   */
  rankId: string | number;

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

export interface RankLogForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 币种id
   */
  rankId?: string | number;

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

export interface RankLogQuery extends PageQuery {

  /**
   * 币种id
   */
  rankId?: string | number;

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
}



