export interface UserVipVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 用户id
   */
  userId: string | number;

  /**
   * VIP ID
   */
  vipId: string | number;

  /**
   * 购买时间
   */
  buyTime: string;

  /**
   * 过期时间
   */
  expireTime: string;

  /**
   * 会员状态 1-正常 2-禁用 3-过期
   */
  status: number;

}

export interface UserVipForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * VIP ID
   */
  vipId?: string | number;

  /**
   * 购买时间
   */
  buyTime?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 会员状态 1-正常 2-禁用 3-过期
   */
  status?: number;

}

export interface UserVipQuery extends PageQuery {

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * VIP ID
   */
  vipId?: string | number;

  /**
   * 购买时间
   */
  buyTime?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 会员状态 1-正常 2-禁用 3-过期
   */
  status?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



