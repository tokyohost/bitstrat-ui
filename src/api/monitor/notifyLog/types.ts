export interface NotifyLogVO {
  /**
   * 日志ID
   */
  id: string | number;

  /**
   * 通知类型 1-钉钉机器人通知 2-TG通知
   */
  notifyType: string;

  /**
   * 通知内容
   */
  notifyContent: string;

  /**
   * 通知状态 1-成功 2-失败
   */
  notifyStatus: string;

  /**
   * 错误信息
   */
  errorMessage: string;

  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface NotifyLogForm extends BaseEntity {
  /**
   * 日志ID
   */
  id?: string | number;

  /**
   * 通知类型 1-钉钉机器人通知 2-TG通知
   */
  notifyType?: string;

  /**
   * 通知内容
   */
  notifyContent?: string;

  /**
   * 通知状态 1-成功 2-失败
   */
  notifyStatus?: string;

  /**
   * 错误信息
   */
  errorMessage?: string;

  /**
   * 用户ID
   */
  userId?: string | number;

}

export interface NotifyLogQuery extends PageQuery {

  /**
   * 通知类型 1-钉钉机器人通知 2-TG通知
   */
  notifyType?: string;

  /**
   * 通知内容
   */
  notifyContent?: string;

  /**
   * 通知状态 1-成功 2-失败
   */
  notifyStatus?: string;

  /**
   * 错误信息
   */
  errorMessage?: string;

  /**
   * 用户ID
   */
  userId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



