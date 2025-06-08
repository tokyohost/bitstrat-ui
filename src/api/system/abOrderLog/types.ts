export interface AbOrderLogVO {
  /**
   * id
   */
  id: string | number;

  /**
   * account a
   */
  accountA: number;

  /**
   * account b
   */
  accountB: number;

  /**
   * exchangea
   */
  exchangeA: string;

  /**
   * exchangeb
   */
  exchangeB: string;

  /**
   * TaskId
   */
  taskId: string | number;

  /**
   * 日志
   */
  log: string;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface AbOrderLogForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * account a
   */
  accountA?: number;

  /**
   * account b
   */
  accountB?: number;

  /**
   * exchangea
   */
  exchangeA?: string;

  /**
   * exchangeb
   */
  exchangeB?: string;

  /**
   * TaskId
   */
  taskId?: string | number;

  /**
   * 日志
   */
  log?: string;

}

export interface AbOrderLogQuery extends PageQuery {

  /**
   * account a
   */
  accountA?: number;

  /**
   * account b
   */
  accountB?: number;

  /**
   * exchangea
   */
  exchangeA?: string;

  /**
   * exchangeb
   */
  exchangeB?: string;

  /**
   * TaskId
   */
  taskId?: string | number;

  /**
   * 日志
   */
  log?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



