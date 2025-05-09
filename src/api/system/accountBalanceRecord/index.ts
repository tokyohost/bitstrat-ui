import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {
  AccountBalanceRecordVO,
  AccountBalanceRecordForm,
  AccountBalanceRecordQuery,
  AccountBalanceRecordMap
} from '@/api/system/accountBalanceRecord/types';

/**
 * 查询账户余额记录列表
 * @param query
 * @returns {*}
 */

export const listAccountBalanceRecord = (query?: AccountBalanceRecordQuery): AxiosPromise<AccountBalanceRecordVO[]> => {
  return request({
    url: '/system/accountBalanceRecord/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询账户余额记录列表Map，不同交易所
 * @param query
 * @returns {*}
 */
export const queryRecordsInDays = async (query?: AccountBalanceRecordQuery): Promise<AccountBalanceRecordMap> => {
  const response = await request({
    url: '/system/accountBalanceRecord/queryRecordsInDays',
    method: 'get',
    params: query
  });

  // 假设后端返回的数据是一个对象，键为字符串，值为 CoinsAccountBalanceRecordVo 数组
  const data = response.data as { [key: string]: AccountBalanceRecordVO[] };

  // 将对象转换为 Map
  const resultMap = new Map<string, AccountBalanceRecordVO[]>();
  Object.entries(data).forEach(([key, value]) => {
    resultMap.set(key, value);
  });

  return resultMap;
};



/**
 * 查询账户余额记录详细
 * @param id
 */
export const getAccountBalanceRecord = (id: string | number): AxiosPromise<AccountBalanceRecordVO> => {
  return request({
    url: '/system/accountBalanceRecord/' + id,
    method: 'get'
  });
};

/**
 * 新增账户余额记录
 * @param data
 */
export const addAccountBalanceRecord = (data: AccountBalanceRecordForm) => {
  return request({
    url: '/system/accountBalanceRecord',
    method: 'post',
    data: data
  });
};

/**
 * 修改账户余额记录
 * @param data
 */
export const updateAccountBalanceRecord = (data: AccountBalanceRecordForm) => {
  return request({
    url: '/system/accountBalanceRecord',
    method: 'put',
    data: data
  });
};

/**
 * 删除账户余额记录
 * @param id
 */
export const delAccountBalanceRecord = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/accountBalanceRecord/' + id,
    method: 'delete'
  });
};
