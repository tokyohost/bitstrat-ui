import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AiTaskVO, AiTaskForm, AiTaskQuery } from '@/api/system/aiTask/types';

/**
 * 查询AI任务列表
 * @param query
 * @returns {*}
 */

export const listAiTask = (query?: AiTaskQuery): AxiosPromise<AiTaskVO[]> => {
  return request({
    url: '/system/aiTask/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI任务详细
 * @param id
 */
export const getAiTask = (id: string | number): AxiosPromise<AiTaskVO> => {
  return request({
    url: '/system/aiTask/' + id,
    method: 'get'
  });
};
export const stopTask = (id: string | number): AxiosPromise<AiTaskVO> => {
  return request({
    url: '/system/aiTask/stop/' + id,
    method: 'get'
  });
};
export const startTask = (id: string | number): AxiosPromise<AiTaskVO> => {
  return request({
    url: '/system/aiTask/start/' + id,
    method: 'get'
  });
};

/**
 * 新增AI任务
 * @param data
 */
export const addAiTask = (data: AiTaskForm) => {
  return request({
    url: '/system/aiTask',
    method: 'post',
    data: data
  });
};

export const invokeAiTask = (data: AiTaskForm) => {
  return request({
    url: '/system/aiTask/invokeAiTask',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI任务
 * @param data
 */
export const updateAiTask = (data: AiTaskForm) => {
  return request({
    url: '/system/aiTask',
    method: 'put',
    data: data
  });
};

/**
 * 删除AI任务
 * @param id
 */
export const delAiTask = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/aiTask/' + id,
    method: 'delete'
  });
};
export const getModifyConfig = (): AxiosPromise<string> => {
  return request({
    url: '/common/modifyConfig',
    method: 'get'
  });
};
