import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { NotifyLogVO, NotifyLogForm, NotifyLogQuery } from '@/api/monitor/notifyLog/types';

/**
 * 查询通知日志列表
 * @param query
 * @returns {*}
 */

export const listNotifyLog = (query?: NotifyLogQuery): AxiosPromise<NotifyLogVO[]> => {
  return request({
    url: '/monitor/notifyLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询通知日志详细
 * @param id
 */
export const getNotifyLog = (id: string | number): AxiosPromise<NotifyLogVO> => {
  return request({
    url: '/monitor/notifyLog/' + id,
    method: 'get'
  });
};

/**
 * 新增通知日志
 * @param data
 */
export const addNotifyLog = (data: NotifyLogForm) => {
  return request({
    url: '/monitor/notifyLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改通知日志
 * @param data
 */
export const updateNotifyLog = (data: NotifyLogForm) => {
  return request({
    url: '/monitor/notifyLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除通知日志
 * @param id
 */
export const delNotifyLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/monitor/notifyLog/' + id,
    method: 'delete'
  });
};
