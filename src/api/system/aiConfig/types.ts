export interface AiConfigVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 流水线名称
   */
  flowName: string;

  /**
   * api地址
   */
  url: string;

  /**
   * token
   */
  token: string;

}

export interface AiConfigForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 流水线名称
   */
  flowName?: string;

  /**
   * api地址
   */
  url?: string;

  /**
   * token
   */
  token?: string;

}

export interface AiConfigQuery extends PageQuery {

  /**
   * 流水线名称
   */
  flowName?: string;

  /**
   * api地址
   */
  url?: string;

  /**
   * token
   */
  token?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



