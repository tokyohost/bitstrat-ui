export interface TestAiRequestVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 请求key
   */
  requestKey: string;

  /**
   * userPrompt
   */
  content: string;

}

export interface TestAiRequestForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 请求key
   */
  requestKey?: string;

  /**
   * userPrompt
   */
  content?: string;

}

export interface TestAiRequestQuery extends PageQuery {

  /**
   * 请求key
   */
  requestKey?: string;

  /**
   * userPrompt
   */
  content?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



