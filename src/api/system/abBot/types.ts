export interface AbBotVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 机器人名称
   */
  botName: string;

  /**
   * 套利币对百分比阈值(高于此阈值触发建仓)
   */
  abPercentThreshold: number;

  /**
   * 距离资金费结算时间触发阈值(满足此时间内允许建仓/平仓)
   */
  triggerMinutes: number;

  /**
   * 币对最低要求持仓量(高于此阈值触发建仓)（单位万美元）
   */
  minVolume: number;

  /**
   * 杠杆倍数
   */
  leverage: number;

  /**
   * 开仓最低USDT
   */
  minSize: number;

  /**
   * 开仓最高USDT
   */
  maxSize: number;

  /**
   * 分批每批最低下单USDT
   */
  batchSize: number;

  /**
   * 状态  1-已创建 2-正在运行 3-已持仓
   */
  status: number;

  /**
   * 用户id
   */
  userId: string | number;

}

export interface AbBotForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 机器人名称
   */
  botName?: string;

  /**
   * 套利币对百分比阈值(高于此阈值触发建仓)
   */
  abPercentThreshold?: number;

  /**
   * 距离资金费结算时间触发阈值(满足此时间内允许建仓/平仓)
   */
  triggerMinutes?: number;

  /**
   * 币对最低要求持仓量(高于此阈值触发建仓)（单位万美元）
   */
  minVolume?: number;

  /**
   * 杠杆倍数
   */
  leverage?: number;

  /**
   * 开仓最低USDT
   */
  minSize?: number;

  /**
   * 开仓最高USDT
   */
  maxSize?: number;

  /**
   * 分批每批最低下单USDT
   */
  batchSize?: number;

  /**
   * 状态  1-已创建 2-正在运行 3-已持仓
   */
  status?: number;

  /**
   * 用户id
   */
  userId?: string | number;

}

export interface AbBotQuery extends PageQuery {

  /**
   * 机器人名称
   */
  botName?: string;

  /**
   * 套利币对百分比阈值(高于此阈值触发建仓)
   */
  abPercentThreshold?: number;

  /**
   * 距离资金费结算时间触发阈值(满足此时间内允许建仓/平仓)
   */
  triggerMinutes?: number;

  /**
   * 币对最低要求持仓量(高于此阈值触发建仓)（单位万美元）
   */
  minVolume?: number;

  /**
   * 杠杆倍数
   */
  leverage?: number;

  /**
   * 开仓最低USDT
   */
  minSize?: number;

  /**
   * 开仓最高USDT
   */
  maxSize?: number;

  /**
   * 分批每批最低下单USDT
   */
  batchSize?: number;

  /**
   * 状态  1-已创建 2-正在运行 3-已持仓
   */
  status?: number;

  /**
   * 用户id
   */
  userId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



