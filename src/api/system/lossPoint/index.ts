import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { LossPointVO, LossPointForm, LossPointQuery } from '@/api/system/lossPoint/types';
import { EnableLossPointBody, SyncLossPoint } from '@/api/system/common/types';

/**
 * 查询滑点管理列表
 * @param query
 * @returns {*}
 */

export const listLossPoint = (query?: LossPointQuery): AxiosPromise<LossPointVO[]> => {
  return request({
    url: '/system/lossPoint/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询滑点管理详细
 * @param id
 */
export const getLossPoint = (id: string | number): AxiosPromise<LossPointVO> => {
  return request({
    url: '/system/lossPoint/' + id,
    method: 'get'
  });
};

/**
 * 新增滑点管理
 * @param data
 */
export const addLossPoint = (data: LossPointForm) => {
  return request({
    url: '/system/lossPoint',
    method: 'post',
    data: data
  });
};

/**
 * 修改滑点管理
 * @param data
 */
export const updateLossPoint = (data: LossPointForm) => {
  return request({
    url: '/system/lossPoint',
    method: 'put',
    data: data
  });
};

/**
 * 删除滑点管理
 * @param id
 */
export const delLossPoint = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/lossPoint/' + id,
    method: 'delete'
  });
};

/**
 * 下发任务
 * @param id
 */
export const syncLossPoint = (data: SyncLossPoint) => {
  return request({
    url: '/system/lossPoint/sync',
    method: 'post',
    data: data
  });
};
/**
 * 下发所有
 * @param id
 */
export const syncAllLossPoint = (data: SyncLossPoint) => {
  return request({
    url: '/system/lossPoint/syncAll',
    method: 'post',
    data: data
  });
};
/**
 * 启用禁用
 * @param id
 */
export const enableLossPoint = (data: EnableLossPointBody) => {
  return request({
    url: '/system/lossPoint/enable',
    method: 'post',
    data: data
  });
};

/**
 * stop任务
 * @param id
 */
export const stopLossPoint = (data: SyncLossPoint) => {
  return request({
    url: '/system/lossPoint/stop',
    method: 'post',
    data: data
  });
};
