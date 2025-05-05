export interface ArbitrageWarningConfigVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 跨交易所套利任务ID
   */
  taskid: string | number;

  /**
   * 套利类型：1:跨交易所套利，2:。。。详见枚举类
   */
  arbitrageType: number;

  /**
   * 警告阈值
   */
  warningthreshold: number;

  /**
   * 告警配置名称
   */
  configname: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 用户id
   */
  userId: string | number;

}

export interface ArbitrageWarningConfigForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 跨交易所套利任务ID
   */
  taskid?: string | number;

  /**
   * 套利类型：1:跨交易所套利，2:。。。详见枚举类
   */
  arbitrageType?: number;

  /**
   * 警告阈值
   */
  warningthreshold?: number;

  /**
   * 告警配置名称
   */
  configname?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 用户id
   */
  userId?: string | number;

}

export interface ArbitrageWarningConfigQuery extends PageQuery {

  /**
   * 跨交易所套利任务ID
   */
  taskid?: string | number;

  /**
   * 套利类型：1:跨交易所套利，2:。。。详见枚举类
   */
  arbitrageType?: number;

  /**
   * 警告阈值
   */
  warningthreshold?: number;

  /**
   * 告警配置名称
   */
  configname?: string;

  /**
   * 用户id
   */
  userId?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



