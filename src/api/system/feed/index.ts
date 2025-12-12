import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { FeedVO, FeedForm, FeedQuery } from '@/api/system/feed/types';
import { AiLogsQuery } from '@/api/system/aiLogs/types';

/**
 * 查询策略广场列表
 * @param query
 * @returns {*}
 */

export const listFeed = (query?: FeedQuery): AxiosPromise<FeedVO[]> => {
  return request({
    url: '/system/feed/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询策略广场详细
 * @param id
 */
export const getFeed = (id: string | number): AxiosPromise<FeedVO> => {
  return request({
    url: '/system/feed/' + id,
    method: 'get'
  });
};
/**
 * 停止分享策略广场详细
 * @param id
 */
export const stopFeed = (id: string | number): AxiosPromise<FeedVO> => {
  return request({
    url: '/system/feed/stop/' + id,
    method: 'get'
  });
};
/**
 * 点赞策略广场详细
 * @param id
 */
export const likeFeed = (id: string | number): AxiosPromise<FeedVO> => {
  return request({
    url: '/system/feed/like/' + id,
    method: 'get'
  });
};

/**
 * 新增策略广场
 * @param data
 */
export const addFeed = (data: FeedForm) => {
  return request({
    url: '/system/feed',
    method: 'post',
    data: data
  });
};
export const loadFeedChartDataSimple = (query?: AiLogsQuery): AxiosPromise<any> => {
  return request({
    url: '/system/feed/loadFeedChartDataSimple',
    method: 'get',
    params: query
  });
};

/**
 * 修改策略广场
 * @param data
 */
export const updateFeed = (data: FeedForm) => {
  return request({
    url: '/system/feed',
    method: 'put',
    data: data
  });
};

/**
 * 删除策略广场
 * @param id
 */
export const delFeed = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/feed/' + id,
    method: 'delete'
  });
};
