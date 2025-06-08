export interface ApiVO {
  /**
   * id
   */
  id: string | number;

  name: string;

  /**
   * api key
   */
  apiKey: string;

  /**
   * api security
   */
  apiSecurity: string;
  balance: string|number;
  freeBalance: string|number;

  /**
   * 交易所
   */
  exchangeName: string;

  /**
   * 用户id
   */
  userId: string | number;
}

export interface ApiForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * api key
   */
  apiKey?: string;

  /**
   * api security
   */
  apiSecurity?: string;

  /**
   * 交易所
   */
  exchangeName?: string;

  /**
   * 用户id
   */
  userId?: string | number;
}

export interface ApiQuery extends PageQuery {
  /**
   * api key
   */
  apiKey?: string;

  /**
   * api security
   */
  apiSecurity?: string;

  /**
   * 交易所
   */
  exchangeName?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}
