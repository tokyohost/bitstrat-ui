import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TaskVO, TaskForm, TaskQuery } from '@/api/system/task/types';

/**
 * 查询任务管理列表
 * @param query
 * @returns {*}
 */

export const listTask = (query?: TaskQuery): AxiosPromise<TaskVO[]> => {
  return request({
    url: '/system/task/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询任务管理详细
 * @param id
 */
export const getTask = (id: string | number): AxiosPromise<TaskVO> => {
  return request({
    url: '/system/task/' + id,
    method: 'get'
  });
};

/**
 * 新增任务管理
 * @param data
 */
export const addTask = (data: TaskForm) => {
  return request({
    url: '/system/task',
    method: 'post',
    data: data
  });
};

/**
 * 修改任务管理
 * @param data
 */
export const updateTask = (data: TaskForm) => {
  return request({
    url: '/system/task',
    method: 'put',
    data: data
  });
};

/**
 * 删除任务管理
 * @param id
 */
export const delTask = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/task/' + id,
    method: 'delete'
  });
};
