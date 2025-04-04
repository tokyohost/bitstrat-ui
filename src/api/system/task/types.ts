export interface TaskVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 任务名称
   */
  name: string;

  /**
   * 币种
   */
  symbol: string;

  /**
   * 持仓
   */
  balance: number;

  /**
   * 单次下单数量
   */
  singleOrder: number;

  /**
   * 每次下单冷却时间
   */
  coldSec: number;

  /**
   * 可用额度
   */
  totalBalance: number;

  /**
   * 上次下单时间
   */
  lastOrderTime: string;

  /**
   * 使用策略类型  AI/normal
   */
  taskType: string;

  /**
   * ai 流水线id
   */
  aiWorkflowId: string | number;

  /**
   * 普通策略id
   */
  roleId: string | number;

  /**
   * 创建人
   */
  createUserId: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status: number;
}

export interface SymbolVO {
  name: string;
}

export interface TaskForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 任务名称
   */
  name?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 持仓
   */
  balance?: number;

  /**
   * 单次下单数量
   */
  singleOrder?: number;

  /**
   * 每次下单冷却时间
   */
  coldSec?: number;

  /**
   * 可用额度
   */
  totalBalance?: number;

  /**
   * 上次下单时间
   */
  lastOrderTime?: string;

  /**
   * 使用策略类型  AI/normal
   */
  taskType?: string;

  strategyConfig?: string;
  interval?: string;
  strategyConfigJSON?: object;
  scale?: number;
  sellRoleId?: number;
  buyRoleId?: number;
  buyRoleParams?: any;
  sellRoleParams?: any;
  /**
   * ai 流水线id
   */
  aiWorkflowId?: string | number;

  /**
   * 普通策略id
   */
  roleId?: string | number;

  /**
   * 创建人
   */
  createUserId?: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status?: number;
}

export interface TaskQuery extends PageQuery {
  /**
   * 任务名称
   */
  name?: string;

  /**
   * 币种
   */
  symbol?: string;

  /**
   * 持仓
   */
  balance?: number;

  /**
   * 单次下单数量
   */
  singleOrder?: number;

  /**
   * 每次下单冷却时间
   */
  coldSec?: number;

  /**
   * 可用额度
   */
  totalBalance?: number;

  /**
   * 上次下单时间
   */
  lastOrderTime?: string;

  /**
   * 使用策略类型  AI/normal
   */
  taskType?: string;

  /**
   * ai 流水线id
   */
  aiWorkflowId?: string | number;

  /**
   * 普通策略id
   */
  roleId?: string | number;

  /**
   * 创建人
   */
  createUserId?: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
