import { ApiVO } from '@/api/system/api/types';

export interface AiTaskVO {
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
  symbols: string;

  /**
   * 开始资金USDT
   */
  startBalance: number;

  /**
   * 可用额度
   */
  totalBalance: number;

  /**
   * ai 流水线id
   */
  aiWorkflowId: string | number;

  /**
   * 系统提示词
   */
  systemPrompt: string;

  /**
   * 用户提示词
   */
  userPrompt: string;

  /**
   * 创建人
   */
  createUserId: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status: number;

  /**
   * 时间粒度
   */
  interval: string;

  exchange?: string;
  apiId?: string | number;
}

export interface AiTaskForm extends BaseEntity {
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
  symbols?: string;

  /**
   * 开始资金USDT
   */
  startBalance?: number;

  /**
   * 可用额度
   */
  totalBalance?: number;

  /**
   * ai 流水线id
   */
  aiWorkflowId?: string | number;

  /**
   * 系统提示词
   */
  systemPrompt?: string;

  /**
   * 用户提示词
   */
  userPrompt?: string;

  /**
   * 创建人
   */
  createUserId?: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status?: number;

  /**
   * 时间粒度
   */
  interval?: string;

  exchange?: string;
  apiId?: string | number;
  account?: ApiVO;

  leverage: Array<number>;
  leverageMin: undefined;
  leverageMax: undefined;
}

export interface AiTaskQuery extends PageQuery {
  /**
   * 任务名称
   */
  name?: string;

  /**
   * 币种
   */
  symbols?: string;

  /**
   * 开始资金USDT
   */
  startBalance?: number;

  /**
   * 可用额度
   */
  totalBalance?: number;

  /**
   * ai 流水线id
   */
  aiWorkflowId?: string | number;

  /**
   * 系统提示词
   */
  systemPrompt?: string;

  /**
   * 用户提示词
   */
  userPrompt?: string;

  /**
   * 创建人
   */
  createUserId?: string | number;

  /**
   * 任务状态 1-已创建 2-正在运行 3-已终止
   */
  status?: number;

  /**
   * 时间粒度
   */
  interval?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
