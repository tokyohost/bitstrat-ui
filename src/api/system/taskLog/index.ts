import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TaskLogVO, TaskLogForm, TaskLogQuery } from '@/api/system/taskLog/types';

/**
 * 查询任务买入卖出日志列表
 * @param query
 * @returns {*}
 */

export const listTaskLog = (query?: TaskLogQuery): AxiosPromise<TaskLogVO[]> => {
  return request({
    url: '/system/taskLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询任务买入卖出日志详细
 * @param id
 */
export const getTaskLog = (id: string | number): AxiosPromise<TaskLogVO> => {
  return request({
    url: '/system/taskLog/' + id,
    method: 'get'
  });
};

/**
 * 新增任务买入卖出日志
 * @param data
 */
export const addTaskLog = (data: TaskLogForm) => {
  return request({
    url: '/system/taskLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改任务买入卖出日志
 * @param data
 */
export const updateTaskLog = (data: TaskLogForm) => {
  return request({
    url: '/system/taskLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除任务买入卖出日志
 * @param id
 */
export const delTaskLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/taskLog/' + id,
    method: 'delete'
  });
};
