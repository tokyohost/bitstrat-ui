import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserVipVO, UserVipForm, UserVipQuery } from '@/api/system/userVip/types';

/**
 * 查询用户VIP 状态列表
 * @param query
 * @returns {*}
 */

export const listUserVip = (query?: UserVipQuery): AxiosPromise<UserVipVO[]> => {
  return request({
    url: '/system/userVip/list',
    method: 'get',
    params: query
  });
};

/**
 * 购买VIP
 */
export const purchaseVip = (data: UserVipForm) => {
  return request({
    url: '/system/userVip/purchaseVip',
    method: 'post',
    data: data
  });
};

/**
 * 查询用户VIP 状态详细
 * @param id
 */
export const getUserVip = (id: string | number): AxiosPromise<UserVipVO> => {
  return request({
    url: '/system/userVip/' + id,
    method: 'get'
  });
};

/**
 * 新增用户VIP 状态
 * @param data
 */
export const addUserVip = (data: UserVipForm) => {
  return request({
    url: '/system/userVip',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户VIP 状态
 * @param data
 */
export const updateUserVip = (data: UserVipForm) => {
  return request({
    url: '/system/userVip',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户VIP 状态
 * @param id
 */
export const delUserVip = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/userVip/' + id,
    method: 'delete'
  });
};
