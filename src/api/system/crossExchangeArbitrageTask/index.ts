import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CrossExchangeArbitrageTaskVO, CrossExchangeArbitrageTaskForm, CrossExchangeArbitrageTaskQuery } from '@/api/system/crossExchangeArbitrageTask/types';

/**
 * 查询跨交易所套利任务列表
 * @param query
 * @returns {*}
 */

export const listCrossExchangeArbitrageTask = (query?: CrossExchangeArbitrageTaskQuery): AxiosPromise<CrossExchangeArbitrageTaskVO[]> => {
  return request({
    url: '/system/crossExchangeArbitrageTask/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询跨交易所套利任务详细
 * @param id
 */
export const getCrossExchangeArbitrageTask = (id: string | number): AxiosPromise<CrossExchangeArbitrageTaskVO> => {
  return request({
    url: '/system/crossExchangeArbitrageTask/' + id,
    method: 'get'
  });
};

/**
 * 新增跨交易所套利任务
 * @param data
 */
export const addCrossExchangeArbitrageTask = (data: CrossExchangeArbitrageTaskForm) => {
  return request({
    url: '/system/crossExchangeArbitrageTask',
    method: 'post',
    data: data
  });
};
/**
 * 创建跨交易所套利任务
 * @param data
 */
export const createTask = (data: any) => {
  return request({
    url: '/system/crossExchangeArbitrageTask/createTask',
    method: 'post',
    data: data
  });
};

/**
 * 修改跨交易所套利任务
 * @param data
 */
export const updateCrossExchangeArbitrageTask = (data: CrossExchangeArbitrageTaskForm) => {
  return request({
    url: '/system/crossExchangeArbitrageTask',
    method: 'put',
    data: data
  });
};

/**
 * 删除跨交易所套利任务
 * @param id
 */
export const delCrossExchangeArbitrageTask = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/crossExchangeArbitrageTask/' + id,
    method: 'delete'
  });
};
