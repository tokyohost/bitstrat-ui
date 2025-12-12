export interface FeedVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 策略ID
   */
  strategyId: string | number;

  /**
   * 标题
   */
  title: string;

  /**
   * 标签（JSON数组）
   */
  tags: string;

  /**
   * 最近三个月收益
   */
  profit3m: number;

  /**
   * 点赞次数
   */
  likeCount: number;

  /**
   * 浏览次数
   */
  viewCount: number;

  /**
   * 状态（1发布 0草稿 2隐藏）
   */
  status: number;

  /**
   * 排序（越大越靠前）
   */
  sort: number;

  /**
   * 分享时间
   */
  shareTime: string;

  /**
   * 用户id
   */
  userId: string | number;
}

export interface FeedForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 策略ID
   */
  strategyId?: string | number;

  /**
   * 标题
   */
  title?: string;

  /**
   * 标签（JSON数组）
   */
  tags?: string;
  content?: string;

  /**
   * 最近三个月收益
   */
  profit3m?: number;

  /**
   * 点赞次数
   */
  likeCount?: number;

  /**
   * 浏览次数
   */
  viewCount?: number;

  /**
   * 状态（1发布 0草稿 2隐藏）
   */
  status?: number;

  /**
   * 排序（越大越靠前）
   */
  sort?: number;

  /**
   * 分享时间
   */
  shareTime?: string;

  /**
   * 用户id
   */
  userId?: string | number;
  tempTags?: string[];
}

export interface FeedQuery extends PageQuery {
  /**
   * 策略ID
   */
  strategyId?: string | number;

  /**
   * 标题
   */
  title?: string;

  /**
   * 标签（JSON数组）
   */
  tags?: string;

  /**
   * 最近三个月收益
   */
  profit3m?: number;

  /**
   * 点赞次数
   */
  likeCount?: number;

  /**
   * 浏览次数
   */
  viewCount?: number;

  /**
   * 状态（1发布 0草稿 2隐藏）
   */
  status?: number;

  /**
   * 排序（越大越靠前）
   */
  sort?: number;

  /**
   * 分享时间
   */
  shareTime?: string;

  /**
   * 用户id
   */
  userId?: string | number;

  /**
   * 日期范围参数
   */
  params?: any;
}
