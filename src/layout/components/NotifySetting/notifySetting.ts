import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import { ApiSettingCheck, ApiSettingDetail, ApiSettingVo, UpdateApiSettingVo } from '@/layout/components/ApiSetting/types';
import { WebsocketStatus } from '@/layout/components/NotifySetting/types';

export function getNotifySettingStatus(): AxiosPromise<ApiSettingVo[]> {
  return request({
    url: '/coinsUser/getNotifySettingStatus',
    method: 'get'
  });
}
export function getWebsocketStatus(): AxiosPromise<WebsocketStatus[]> {
  return request({
    url: '/coinsUser/getWebsocketStatus',
    method: 'get'
  });
}
export function getApiSettingDetail(params: any): AxiosPromise<ApiSettingDetail[]> {
  return request({
    url: '/coinsUser/getApiSettingDetail',
    method: 'get',
    params: params
  });
}

export function setApi(data: UpdateApiSettingVo): AxiosPromise<ApiSettingDetail[]> {
  return request({
    url: '/coinsUser/setApi',
    method: 'post',
    data: data
  });
}

export function checkApi(data: UpdateApiSettingVo): AxiosPromise<ApiSettingCheck> {
  return request({
    url: '/coinsUser/chekApi',
    method: 'post',
    data: data
  });
}
