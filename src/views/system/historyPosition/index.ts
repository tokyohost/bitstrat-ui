import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HistoryPosition, HistoryPositionQuery } from '@/views/system/historyPosition/type';

export const queryHistoryPositionByPage = (query?: HistoryPositionQuery): AxiosPromise<HistoryPosition[]> => {
  return request({
    url: '/common/queryHistoryPositionByPage',
    method: 'post',
    data: query
  });
};
