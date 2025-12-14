import { AxiosPromise } from 'axios';
import request from '@/utils/request';
import { ApiSettingCheck, ApiSettingDetail, ApiSettingVo, UpdateApiSettingVo } from '@/layout/components/ApiSetting/types';
import { PayParams, QrPayCallBack, QrPayResponse, QueryPayParams } from '@/layout/components/Recharge/types';

export function qrPay(data: PayParams): AxiosPromise<QrPayResponse> {
  return request({
    url: '/pay/payByQrCode',
    method: 'post',
    data: data
    // headers: {
    //   isEncrypt: true
    // }
  });
}
export function payByredict(data: PayParams): AxiosPromise<QrPayResponse> {
  return request({
    url: 'pay/payByRedict',
    method: 'get',
    params: data
    // headers: {
    //   isEncrypt: true
    // }
  });
}
export function checkPayStatus(data: QueryPayParams): AxiosPromise<QrPayCallBack> {
  return request({
    url: '/pay/checkPayStatus',
    method: 'post',
    data: data
    // headers: {
    //   isEncrypt: true
    // }
  });
}
