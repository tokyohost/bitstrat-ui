import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AiLogsVO, AiLogsForm, AiLogsQuery } from '@/api/system/aiLogs/types';

/**
 * 查询AI 测试趋势列表
 * @param query
 * @returns {*}
 */

export const listAiLogs = (query?: AiLogsQuery): AxiosPromise<AiLogsVO[]> => {
  return request({
    url: '/system/aiLogs/list',
    method: 'get',
    params: query
  });
};
export const loadChartData = (query?: AiLogsQuery): AxiosPromise<any> => {
  return request({
    url: '/system/aiLogs/loadChartData',
    method: 'get',
    params: query
  });
};
export const loadChartDataFreeBalance = (query?: AiLogsQuery): AxiosPromise<any> => {
  return request({
    url: '/system/aiLogs/loadChartDataFreeBalance',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI 测试趋势详细
 * @param id
 */
export const getAiLogs = (id: string | number): AxiosPromise<AiLogsVO> => {
  return request({
    url: '/system/aiLogs/' + id,
    method: 'get'
  });
};

/**
 * 新增AI 测试趋势
 * @param data
 */
export const addAiLogs = (data: AiLogsForm) => {
  return request({
    url: '/system/aiLogs',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI 测试趋势
 * @param data
 */
export const updateAiLogs = (data: AiLogsForm) => {
  return request({
    url: '/system/aiLogs',
    method: 'put',
    data: data
  });
};

/**
 * 删除AI 测试趋势
 * @param id
 */
export const delAiLogs = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/aiLogs/' + id,
    method: 'delete'
  });
};
