export interface TaskLogVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 任务id
   */
  taskId: string | number;

  /**
   * 价格
   */
  price: number;

  /**
   * 数量
   */
  count: number;

  /**
   * 类型 1-买入  2-卖出
   */
  type: number;

  /**
   * 总金额
   */
  total: number;
}

export interface TaskLogForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 价格
   */
  price?: number;

  /**
   * 数量
   */
  count?: number;

  /**
   * 类型 1-买入  2-卖出
   */
  type?: number;

  /**
   * 总金额
   */
  total?: number;
}

export interface TaskLogQuery extends PageQuery {
  /**
   * 任务id
   */
  taskId?: string | number;

  /**
   * 价格
   */
  price?: number;

  /**
   * 数量
   */
  count?: number;

  /**
   * 类型 1-买入  2-卖出
   */
  type?: number;

  /**
   * 总金额
   */
  total?: number;

  /**
   * 日期范围参数
   */
  params?: any;
  orderByColumn?: string;
  isAsc: string;
}
