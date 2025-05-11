export interface AccountBalanceRecordVO {
  /**
   *
   */
  id: string | number;

  /**
   *
   */
  userId: string | number;

  /**
   *
   */
  exchange: string;

  /**
   *
   */
  balance: number;

  /**
   *
   */
  cashBalance: number;

  /**
   *
   */
  usdtBalance: number;

  /**
   *
   */
  freeBalance: number;

  /**
   *
   */
  recordTime: string;

  /**
   *
   */
  recordDate: string;

  /**
   * 涨幅
   */
  growth:  number;

  /**
   * 涨幅百分比
   */
  growthPercentage: number;
}

export interface AccountBalanceRecordForm extends BaseEntity {
  /**
   *
   */
  id?: string | number;

  /**
   *
   */
  userId?: string | number;

  /**
   *
   */
  exchange?: string;

  /**
   *
   */
  balance?: number;

  /**
   *
   */
  cashBalance?: number;

  /**
   *
   */
  usdtBalance?: number;

  /**
   *
   */
  freeBalance?: number;

  /**
   *
   */
  recordTime?: string;

  /**
   *
   */
  recordDate?: string;

}

export interface AccountBalanceRecordQuery extends PageQuery {

  /**
   *
   */
  userId?: string | number;

  /**
   *
   */
  exchange?: string;

  /**
   *
   */
  balance?: number;

  /**
   *
   */
  cashBalance?: number;

  /**
   *
   */
  usdtBalance?: number;

  /**
   *
   */
  freeBalance?: number;

  /**
   *
   */
  recordTime?: string;

  /**
   *
   */
  recordDate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
    /**
     * 查询最近N天
     */
    days?: number;
}




export type AccountBalanceRecordMap = Map<string, AccountBalanceRecordVO[]>;
