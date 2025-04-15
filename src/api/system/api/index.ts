import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ApiVO, ApiForm, ApiQuery } from '@/api/system/api/types';

/**
 * 查询交易所API列表
 * @param query
 * @returns {*}
 */

export const listApi = (query?: ApiQuery): AxiosPromise<ApiVO[]> => {
  return request({
    url: '/system/api/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询交易所API详细
 * @param id
 */
export const getApi = (id: string | number): AxiosPromise<ApiVO> => {
  return request({
    url: '/system/api/' + id,
    method: 'get'
  });
};

/**
 * 新增交易所API
 * @param data
 */
export const addApi = (data: ApiForm) => {
  return request({
    url: '/system/api',
    method: 'post',
    data: data
  });
};

/**
 * 修改交易所API
 * @param data
 */
export const updateApi = (data: ApiForm) => {
  return request({
    url: '/system/api',
    method: 'put',
    data: data
  });
};

/**
 * 删除交易所API
 * @param id
 */
export const delApi = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/api/' + id,
    method: 'delete'
  });
};
