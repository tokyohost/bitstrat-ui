import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BatchVO, BatchForm, BatchQuery } from '@/api/system/batch/types';

/**
 * 查询分批订单任务列表
 * @param query
 * @returns {*}
 */

export const listBatch = (query?: BatchQuery): AxiosPromise<BatchVO[]> => {
  return request({
    url: '/system/batch/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询分批订单任务详细
 * @param id
 */
export const getBatch = (id: string | number): AxiosPromise<BatchVO> => {
  return request({
    url: '/system/batch/' + id,
    method: 'get'
  });
};

/**
 * 新增分批订单任务
 * @param data
 */
export const addBatch = (data: BatchForm) => {
  return request({
    url: '/system/batch',
    method: 'post',
    data: data
  });
};

/**
 * 修改分批订单任务
 * @param data
 */
export const updateBatch = (data: BatchForm) => {
  return request({
    url: '/system/batch',
    method: 'put',
    data: data
  });
};

/**
 * 删除分批订单任务
 * @param id
 */
export const delBatch = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/batch/' + id,
    method: 'delete'
  });
};
/**
 * 停止任务
 * @param id
 */
export const stopBatch = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/batch/stop',
    method: 'put',
    data: {
      id:id
    }
  });
};
