import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { AiConfigVO, AiConfigForm, AiConfigQuery } from '@/api/system/aiConfig/types';

/**
 * 查询ai 流水线配置列表
 * @param query
 * @returns {*}
 */

export const listAiConfig = (query?: AiConfigQuery): AxiosPromise<AiConfigVO[]> => {
  return request({
    url: '/system/aiConfig/list',
    method: 'get',
    params: query
  });
};


/**
 * 查询ai 流水线配置详细
 * @param id
 */
export const getAiConfig = (id: string | number): AxiosPromise<AiConfigVO> => {
  return request({
    url: '/system/aiConfig/' + id,
    method: 'get'
  });
};

/**
 * 新增ai 流水线配置
 * @param data
 */
export const addAiConfig = (data: AiConfigForm) => {
  return request({
    url: '/system/aiConfig',
    method: 'post',
    data: data
  });
};

/**
 * 修改ai 流水线配置
 * @param data
 */
export const updateAiConfig = (data: AiConfigForm) => {
  return request({
    url: '/system/aiConfig',
    method: 'put',
    data: data
  });
};

/**
 * 删除ai 流水线配置
 * @param id
 */
export const delAiConfig = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/aiConfig/' + id,
    method: 'delete'
  });
};
