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
}




export type AccountBalanceRecordMap = Map<string, AccountBalanceRecordVO[]>;
