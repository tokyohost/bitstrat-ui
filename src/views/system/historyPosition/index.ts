import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HistoryPosition, HistoryPositionQuery, HistoryPositionTpslQuery, PositionCloseParam, TpSlOrder } from '@/views/system/historyPosition/type';

export const queryHistoryPositionByPage = (query?: HistoryPositionQuery): AxiosPromise<HistoryPosition[]> => {
  return request({
    url: '/common/queryHistoryPositionByPage',
    method: 'post',
    data: query
  });
};
export const queryPositionTpslBySymbol = (query?: HistoryPositionTpslQuery): AxiosPromise<TpSlOrder[]> => {
  return request({
    url: '/common/queryPositionTpslBySymbol',
    method: 'post',
    data: query
  });
};
export const closePositionApi = (query?: PositionCloseParam): AxiosPromise<TpSlOrder[]> => {
  return request({
    url: '/common/closePositionApi',
    method: 'post',
    data: query
  });
};
