export interface VipLevelVO {
  /**
   * id
   */
  id: string | number;

  /**
   * VIP名称
   */
  name: string;

  /**
   * VIP等级
   */
  level: number;

  /**
   * 最大套利金额 USDT
   */
  maxAbAmount: number;

  /**
   * 最大同时允许运行中状态的任务数量
   */
  maxActiveTask: number;

  /**
   * VIP状态，1-正常 2-禁用 3-不可购买
   */
  status: number;

  /**
   * VIP 开通金额 单位USDT
   */
  price: number;

  /**
   * 可用时长 单位-天
   */
  avaliableDay: number;

}

export interface VipLevelForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * VIP名称
   */
  name?: string;

  /**
   * VIP等级
   */
  level?: number;

  /**
   * 最大套利金额 USDT
   */
  maxAbAmount?: number;

  /**
   * 最大同时允许运行中状态的任务数量
   */
  maxActiveTask?: number;

  /**
   * VIP状态，1-正常 2-禁用 3-不可购买
   */
  status?: number;

  /**
   * VIP 开通金额 单位USDT
   */
  price?: number;

  /**
   * 可用时长 单位-天
   */
  avaliableDay?: number;

}

export interface VipLevelQuery extends PageQuery {

  /**
   * VIP名称
   */
  name?: string;

  /**
   * VIP等级
   */
  level?: number;

  /**
   * 最大套利金额 USDT
   */
  maxAbAmount?: number;

  /**
   * 最大同时允许运行中状态的任务数量
   */
  maxActiveTask?: number;

  /**
   * VIP状态，1-正常 2-禁用 3-不可购买
   */
  status?: number;

  /**
   * VIP 开通金额 单位USDT
   */
  price?: number;

  /**
   * 可用时长 单位-天
   */
  avaliableDay?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



