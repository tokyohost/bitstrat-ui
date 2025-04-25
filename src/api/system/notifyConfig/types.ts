export interface NotifyConfigVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 配置类型 1-钉钉机器人通知 2-TG通知
   */
  type: string;

  /**
   * 钉钉 token
   */
  dingToken: string;

  /**
   * 钉钉 secret
   */
  dingSecret: string;

  /**
   * tg chart id
   */
  telegramChatId: string | number;

  /**
   * 用户id
   */
  userId: string | number;

}

export interface NotifyConfigForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 配置类型 1-钉钉机器人通知 2-TG通知
   */
  type?: string;

  /**
   * 钉钉 token
   */
  dingToken?: string;

  /**
   * 钉钉 secret
   */
  dingSecret?: string;

  /**
   * tg chart id
   */
  telegramChatId?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

}

export interface NotifyConfigQuery extends PageQuery {

  /**
   * 配置类型 1-钉钉机器人通知 2-TG通知
   */
  type?: string;

  /**
   * 钉钉 token
   */
  dingToken?: string;

  /**
   * 钉钉 secret
   */
  dingSecret?: string;

  /**
   * tg chart id
   */
  telegramChatId?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



