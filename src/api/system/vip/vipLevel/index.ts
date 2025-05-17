import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { VipLevelVO, VipLevelForm, VipLevelQuery } from '@/api/system/vipLevel/types';

/**
 * 查询VIP 权限列表
 * @param query
 * @returns {*}
 */

export const listVipLevel = (query?: VipLevelQuery): AxiosPromise<VipLevelVO[]> => {
  return request({
    url: '/system/vipLevel/list',
    method: 'get',
    params: query
  });
};
export const getAvailableVipLevelList = (query?: VipLevelQuery): AxiosPromise<VipLevelVO[]> => {
  return request({
    url: '/system/vipLevel/getAvailableVipLevelList',
    method: 'get',
    params: query
  });
};

/**
 * 查询VIP 权限详细
 * @param id
 */
export const getVipLevel = (id: string | number): AxiosPromise<VipLevelVO> => {
  return request({
    url: '/system/vipLevel/' + id,
    method: 'get'
  });
};

/**
 * 新增VIP 权限
 * @param data
 */
export const addVipLevel = (data: VipLevelForm) => {
  return request({
    url: '/system/vipLevel',
    method: 'post',
    data: data
  });
};

/**
 * 修改VIP 权限
 * @param data
 */
export const updateVipLevel = (data: VipLevelForm) => {
  return request({
    url: '/system/vipLevel',
    method: 'put',
    data: data
  });
};

/**
 * 删除VIP 权限
 * @param id
 */
export const delVipLevel = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/vipLevel/' + id,
    method: 'delete'
  });
};
