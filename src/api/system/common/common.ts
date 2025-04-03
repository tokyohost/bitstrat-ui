import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TaskQuery, TaskVO } from '@/api/system/task/types';
import { AiConfigQuery, AiConfigVO } from '@/api/system/aiConfig/types';

export const listTask = (query?: TaskQuery): AxiosPromise<TaskVO[]> => {
  return request({
    url: '/system/task/list',
    method: 'get',
    params: query
  });
};
export function listBybitSupportSymbols(query?: object) {
  return request({
    url: '/common/bybit/symbols',
    method: 'get',
    params: query
  });
}

export const listAiConfig4Select = (query?: object): AxiosPromise<AiConfigVO[]> => {
  return request({
    url: '/system/aiConfig/list4Select',
    method: 'get',
    params: query
  });
};
export const supportNormalStrategy = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/supportNormalStrategy',
    method: 'get'
  });
};
export const supportPositionStrategy = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/supportPositionStrategy',
    method: 'get'
  });
};
export const supportMarketInterval = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/marketInterval',
    method: 'get'
  });
};
