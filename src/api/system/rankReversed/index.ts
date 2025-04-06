import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RankReversedVO, RankReversedForm, RankReversedQuery } from '@/api/system/rankReversed/types';
import { RankVO } from '@/api/system/rank/types';

/**
 * 查询山寨币排行(反向)列表
 * @param query
 * @returns {*}
 */

export const listRankReversed = (query?: RankReversedQuery): AxiosPromise<RankReversedVO[]> => {
  return request({
    url: '/system/rankReversed/list',
    method: 'get',
    params: query
  });
};

export const syncRank = (): AxiosPromise<RankVO> => {
  return request({
    url: '/system/rankReversed/syncRank',
    method: 'get',
    timeout:1000000
  });
};

/**
 * 查询山寨币排行(反向)详细
 * @param id
 */
export const getRankReversed = (id: string | number): AxiosPromise<RankReversedVO> => {
  return request({
    url: '/system/rankReversed/' + id,
    method: 'get'
  });
};

/**
 * 新增山寨币排行(反向)
 * @param data
 */
export const addRankReversed = (data: RankReversedForm) => {
  return request({
    url: '/system/rankReversed',
    method: 'post',
    data: data
  });
};

/**
 * 修改山寨币排行(反向)
 * @param data
 */
export const updateRankReversed = (data: RankReversedForm) => {
  return request({
    url: '/system/rankReversed',
    method: 'put',
    data: data
  });
};

/**
 * 删除山寨币排行(反向)
 * @param id
 */
export const delRankReversed = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/rankReversed/' + id,
    method: 'delete'
  });
};
