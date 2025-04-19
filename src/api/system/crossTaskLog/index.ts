import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CrossTaskLogVO, CrossTaskLogForm, CrossTaskLogQuery } from '@/api/system/crossTaskLog/types';

/**
 * 查询跨交易所任务日志列表
 * @param query
 * @returns {*}
 */

export const listCrossTaskLog = (query?: CrossTaskLogQuery): AxiosPromise<CrossTaskLogVO[]> => {
  return request({
    url: '/system/crossTaskLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询跨交易所任务日志详细
 * @param id
 */
export const getCrossTaskLog = (id: string | number): AxiosPromise<CrossTaskLogVO> => {
  return request({
    url: '/system/crossTaskLog/' + id,
    method: 'get'
  });
};

/**
 * 新增跨交易所任务日志
 * @param data
 */
export const addCrossTaskLog = (data: CrossTaskLogForm) => {
  return request({
    url: '/system/crossTaskLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改跨交易所任务日志
 * @param data
 */
export const updateCrossTaskLog = (data: CrossTaskLogForm) => {
  return request({
    url: '/system/crossTaskLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除跨交易所任务日志
 * @param id
 */
export const delCrossTaskLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/crossTaskLog/' + id,
    method: 'delete'
  });
};
