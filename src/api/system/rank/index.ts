import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RankVO, RankForm, RankQuery } from '@/api/system/rank/types';

/**
 * 查询山寨币排行列表
 * @param query
 * @returns {*}
 */

export const listRank = (query?: RankQuery): AxiosPromise<RankVO[]> => {
  return request({
    url: '/system/rank/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询山寨币排行详细
 * @param id
 */
export const getRank = (id: string | number): AxiosPromise<RankVO> => {
  return request({
    url: '/system/rank/' + id,
    method: 'get'
  });
};

export const syncRank = (): AxiosPromise<RankVO> => {
  return request({
    url: '/system/rank/syncRank',
    method: 'get',
    timeout:1000000
  });
};

/**
 * 新增山寨币排行
 * @param data
 */
export const addRank = (data: RankForm) => {
  return request({
    url: '/system/rank',
    method: 'post',
    data: data
  });
};

/**
 * 修改山寨币排行
 * @param data
 */
export const updateRank = (data: RankForm) => {
  return request({
    url: '/system/rank',
    method: 'put',
    data: data
  });
};

/**
 * 删除山寨币排行
 * @param id
 */
export const delRank = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/rank/' + id,
    method: 'delete'
  });
};
