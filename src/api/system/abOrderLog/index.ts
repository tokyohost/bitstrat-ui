import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AbOrderLogVO, AbOrderLogForm, AbOrderLogQuery } from '@/api/system/abOrderLog/types';

/**
 * 查询价差套利日志列表
 * @param query
 * @returns {*}
 */

export const listAbOrderLog = (query?: AbOrderLogQuery): AxiosPromise<AbOrderLogVO[]> => {
  return request({
    url: '/system/abOrderLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询价差套利日志详细
 * @param id
 */
export const getAbOrderLog = (id: string | number): AxiosPromise<AbOrderLogVO> => {
  return request({
    url: '/system/abOrderLog/' + id,
    method: 'get'
  });
};

/**
 * 新增价差套利日志
 * @param data
 */
export const addAbOrderLog = (data: AbOrderLogForm) => {
  return request({
    url: '/system/abOrderLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改价差套利日志
 * @param data
 */
export const updateAbOrderLog = (data: AbOrderLogForm) => {
  return request({
    url: '/system/abOrderLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除价差套利日志
 * @param id
 */
export const delAbOrderLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/abOrderLog/' + id,
    method: 'delete'
  });
};
