import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BalanceLogVO, BalanceLogForm, BalanceLogQuery } from '@/api/system/balanceLog/types';

/**
 * 查询账户余额变动日志列表
 * @param query
 * @returns {*}
 */

export const listBalanceLog = (query?: BalanceLogQuery): AxiosPromise<BalanceLogVO[]> => {
  return request({
    url: '/system/balanceLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询账户余额变动日志详细
 * @param id
 */
export const getBalanceLog = (id: string | number): AxiosPromise<BalanceLogVO> => {
  return request({
    url: '/system/balanceLog/' + id,
    method: 'get'
  });
};

/**
 * 新增账户余额变动日志
 * @param data
 */
export const addBalanceLog = (data: BalanceLogForm) => {
  return request({
    url: '/system/balanceLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改账户余额变动日志
 * @param data
 */
export const updateBalanceLog = (data: BalanceLogForm) => {
  return request({
    url: '/system/balanceLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除账户余额变动日志
 * @param id
 */
export const delBalanceLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/balanceLog/' + id,
    method: 'delete'
  });
};
