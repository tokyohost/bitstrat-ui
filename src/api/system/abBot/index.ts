import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AbBotVO, AbBotForm, AbBotQuery } from '@/api/system/abBot/types';

/**
 * 查询套利机器人列表
 * @param query
 * @returns {*}
 */

export const listAbBot = (query?: AbBotQuery): AxiosPromise<AbBotVO[]> => {
  return request({
    url: '/system/abBot/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询套利机器人详细
 * @param id
 */
export const getAbBot = (id: string | number): AxiosPromise<AbBotVO> => {
  return request({
    url: '/system/abBot/' + id,
    method: 'get'
  });
};

/**
 * 新增套利机器人
 * @param data
 */
export const addAbBot = (data: AbBotForm) => {
  return request({
    url: '/system/abBot',
    method: 'post',
    data: data
  });
};

/**
 * 修改套利机器人
 * @param data
 */
export const updateAbBot = (data: AbBotForm) => {
  return request({
    url: '/system/abBot',
    method: 'put',
    data: data
  });
};

/**
 * 删除套利机器人
 * @param id
 */
export const delAbBot = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/abBot/' + id,
    method: 'delete'
  });
};
