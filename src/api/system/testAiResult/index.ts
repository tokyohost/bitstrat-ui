import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TestAiResultVO, TestAiResultForm, TestAiResultQuery } from '@/api/system/testAiResult/types';

/**
 * 查询AI 操作日志列表
 * @param query
 * @returns {*}
 */

export const listTestAiResult = (query?: TestAiResultQuery): AxiosPromise<TestAiResultVO[]> => {
  return request({
    url: '/system/testAiResult/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI 操作日志详细
 * @param id
 */
export const getTestAiResult = (id: string | number): AxiosPromise<TestAiResultVO> => {
  return request({
    url: '/system/testAiResult/' + id,
    method: 'get'
  });
};

/**
 * 新增AI 操作日志
 * @param data
 */
export const addTestAiResult = (data: TestAiResultForm) => {
  return request({
    url: '/system/testAiResult',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI 操作日志
 * @param data
 */
export const updateTestAiResult = (data: TestAiResultForm) => {
  return request({
    url: '/system/testAiResult',
    method: 'put',
    data: data
  });
};

/**
 * 删除AI 操作日志
 * @param id
 */
export const delTestAiResult = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/testAiResult/' + id,
    method: 'delete'
  });
};
