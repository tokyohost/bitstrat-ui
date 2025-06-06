import request from '@/utils/request';
import { ABOrderData } from '@/views/components/type/type';

export const syncAbOrderTask = (data: ABOrderData) => {
  return request({
    url: '/system/abOrder/sync',
    method: 'post',
    data: data
  });
};

export const syncPosition = () => {
  return request({
    url: '/system/abOrder/syncPosition',
    method: 'get'
  });
};
