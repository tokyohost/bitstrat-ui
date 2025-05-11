import { AxiosPromise } from 'axios';
import { WebsocketStatus } from '@/layout/components/NotifySetting/types';
import request from '@/utils/request';
import { LinerSymbol } from '@/views/system/analysis/components/type';

export function queryLinerSymbolsByEx(ex: string): AxiosPromise<LinerSymbol[]> {
  return request({
    url: '/common/queryLinerSymbolsByEx',
    method: 'get',
    params: {
      exchange: ex
    }
  });
}
export function queryLinerSymbolsFundingTimeInterval(ex: string, symbol: string): AxiosPromise<LinerSymbol[]> {
  return request({
    url: '/common/queryLinerSymbolsFundingTimeInterval',
    method: 'get',
    params: {
      exchange: ex,
      symbol: symbol
    }
  });
}
