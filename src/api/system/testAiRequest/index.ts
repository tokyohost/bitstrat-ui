import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TestAiRequestVO, TestAiRequestForm, TestAiRequestQuery } from '@/api/system/testAiRequest/types';

/**
 * 查询AI 用户请求提示词列表
 * @param query
 * @returns {*}
 */

export const listTestAiRequest = (query?: TestAiRequestQuery): AxiosPromise<TestAiRequestVO[]> => {
  return request({
    url: '/system/testAiRequest/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询AI 用户请求提示词详细
 * @param id
 */
export const getTestAiRequest = (id: string | number): AxiosPromise<TestAiRequestVO> => {
  return request({
    url: '/system/testAiRequest/' + id,
    method: 'get'
  });
};
/**
 * 查询AI 用户请求提示词详细
 * @param id
 */
export const getTestAiRequestByKey = (id: string | number): AxiosPromise<TestAiRequestVO> => {
  return request({
    url: '/system/testAiRequest/requestKey/' + id,
    method: 'get'
  });
};

/**
 * 新增AI 用户请求提示词
 * @param data
 */
export const addTestAiRequest = (data: TestAiRequestForm) => {
  return request({
    url: '/system/testAiRequest',
    method: 'post',
    data: data
  });
};

/**
 * 修改AI 用户请求提示词
 * @param data
 */
export const updateTestAiRequest = (data: TestAiRequestForm) => {
  return request({
    url: '/system/testAiRequest',
    method: 'put',
    data: data
  });
};

/**
 * 删除AI 用户请求提示词
 * @param id
 */
export const delTestAiRequest = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/testAiRequest/' + id,
    method: 'delete'
  });
};
