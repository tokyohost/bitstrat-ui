import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ArbitrageWarningConfigVO, ArbitrageWarningConfigForm, ArbitrageWarningConfigQuery } from '@/api/system/arbitrageWarningConfig/types';

/**
 * 查询用户配置套利警告列表
 * @param query
 * @returns {*}
 */

export const listArbitrageWarningConfig = (query?: ArbitrageWarningConfigQuery): AxiosPromise<ArbitrageWarningConfigVO[]> => {
  return request({
    url: '/system/arbitrageWarningConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户配置套利警告详细
 * @param id
 */
export const getArbitrageWarningConfig = (id: string | number): AxiosPromise<ArbitrageWarningConfigVO> => {
  return request({
    url: '/system/arbitrageWarningConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增用户配置套利警告
 * @param data
 */
export const addArbitrageWarningConfig = (data: ArbitrageWarningConfigForm) => {
  return request({
    url: '/system/arbitrageWarningConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户配置套利警告
 * @param data
 */
export const updateArbitrageWarningConfig = (data: ArbitrageWarningConfigForm) => {
  return request({
    url: '/system/arbitrageWarningConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户配置套利警告
 * @param id
 */
export const delArbitrageWarningConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/arbitrageWarningConfig/' + id,
    method: 'delete'
  });
};
