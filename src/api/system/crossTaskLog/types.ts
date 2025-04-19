export interface CrossTaskLogVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 任务id
   */
  taskId: string | number;

  /**
   * 日志
   */
  msg: string;

}

export interface CrossTaskLogForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 日志
   */
  msg?: string;

}

export interface CrossTaskLogQuery extends PageQuery {

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 日志
   */
  msg?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



