import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NotifyConfigVO, NotifyConfigForm, NotifyConfigQuery } from '@/api/system/notifyConfig/types';

/**
 * 查询用户通知设置列表
 * @param query
 * @returns {*}
 */

export const listNotifyConfig = (query?: NotifyConfigQuery): AxiosPromise<NotifyConfigVO[]> => {
  return request({
    url: '/system/notifyConfig/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户通知设置详细
 * @param id
 */
export const getNotifyConfig = (id: string | number): AxiosPromise<NotifyConfigVO> => {
  return request({
    url: '/system/notifyConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增用户通知设置
 * @param data
 */
export const addNotifyConfig = (data: NotifyConfigForm) => {
  return request({
    url: '/system/notifyConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户通知设置
 * @param data
 */
export const updateNotifyConfig = (data: NotifyConfigForm) => {
  return request({
    url: '/system/notifyConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户通知设置
 * @param id
 */
export const delNotifyConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/notifyConfig/' + id,
    method: 'delete'
  });
};
