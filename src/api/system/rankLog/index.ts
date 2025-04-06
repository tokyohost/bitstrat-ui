import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RankLogVO, RankLogForm, RankLogQuery } from '@/api/system/rankLog/types';

/**
 * 查询山寨币排行日志列表
 * @param query
 * @returns {*}
 */

export const listRankLog = (query?: RankLogQuery): AxiosPromise<RankLogVO[]> => {
  return request({
    url: '/system/rankLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询山寨币排行日志详细
 * @param id
 */
export const getRankLog = (id: string | number): AxiosPromise<RankLogVO> => {
  return request({
    url: '/system/rankLog/' + id,
    method: 'get'
  });
};

/**
 * 新增山寨币排行日志
 * @param data
 */
export const addRankLog = (data: RankLogForm) => {
  return request({
    url: '/system/rankLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改山寨币排行日志
 * @param data
 */
export const updateRankLog = (data: RankLogForm) => {
  return request({
    url: '/system/rankLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除山寨币排行日志
 * @param id
 */
export const delRankLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/rankLog/' + id,
    method: 'delete'
  });
};
