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

  imgUrl: string;
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
  price?: string | number;

  imgUrl?: string;
  callback?: string;
  interval?: string;
  type?: string;
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
  type?: string | number;

  /**
   * token
   */
  token?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
