export interface AiLogsVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 金额
   */
  equity: number;

  /**
   * 可用
   */
  freeBalance: number;

  /**
   * 时间戳
   */
  time: string;
}

export interface AiLogsForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 金额
   */
  equity?: number;

  /**
   * 可用
   */
  freeBalance?: number;

  /**
   * 时间戳
   */
  time?: string;
}

export interface AiLogsQuery extends PageQuery {
  /**
   * 金额
   */
  equity?: number;

  /**
   * 可用
   */
  freeBalance?: number;

  /**
   * 时间戳
   */
  time?: string;

  /**
   * 日期范围参数
   */
  params?: any;

  taskId?: string;

  startDate?: string;
  endDate?: string;
}
