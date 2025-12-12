import { AiLogsQuery } from '@/api/system/aiLogs/types';
import { AxiosPromise } from 'axios';
import request from '@/utils/request';

export const loadChartDataSimple = (query?: AiLogsQuery): AxiosPromise<any> => {
  return request({
    url: '/system/aiTask/loadChartDataSimple',
    method: 'get',
    params: query
  });
};
