import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TaskQuery, TaskVO } from '@/api/system/task/types';
import { AiConfigQuery, AiConfigVO } from '@/api/system/aiConfig/types';
import { AccountBalance, DeviceInfo, ExchangeData, QueryBalanceBody, SetLeverageBody, SymbolFee } from '@/api/system/common/types';
import { CoinContractInformation, FundingRate } from '@/api/system/analysis/types';
import { SymbolFundingRate } from '@/views/system/analysis/components/type';

export const listTask = (query?: TaskQuery): AxiosPromise<TaskVO[]> => {
  return request({
    url: '/system/task/list',
    method: 'get',
    params: query
  });
};
export function listBybitSupportSymbols(query?: object) {
  return request({
    url: '/common/bybit/symbols',
    method: 'get',
    params: query
  });
}

export const listAiConfig4Select = (query?: object): AxiosPromise<AiConfigVO[]> => {
  return request({
    url: '/system/aiConfig/list4Select',
    method: 'get',
    params: query
  });
};
export const supportNormalStrategy = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/supportNormalStrategy',
    method: 'get'
  });
};
export const supportPositionStrategy = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/supportPositionStrategy',
    method: 'get'
  });
};
export const supportMarketInterval = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/bybit/marketInterval',
    method: 'get'
  });
};
export const getSupportExchange = (): AxiosPromise<any[]> => {
  return request({
    url: '/common/getSupportExchange',
    method: 'get'
  });
};
export const queryNodeStatus = (): AxiosPromise<DeviceInfo[]> => {
  return request({
    url: '/common/queryNodeStatus',
    method: 'get'
  });
};
export const queryExchangeStatus = (): AxiosPromise<ExchangeData[]> => {
  return request({
    url: '/common/queryExchangeStatus',
    method: 'get'
  });
};
export const setLeverageBody = (data: SetLeverageBody): AxiosPromise<ExchangeData[]> => {
  return request({
    url: '/common/setLeverageBody',
    method: 'post',
    data
  });
};

export const queryBalanceByEx = (data: QueryBalanceBody): AxiosPromise<AccountBalance> => {
  return request({
    url: '/common/queryBalanceByEx',
    method: 'post',
    data
  });
};

export const queryFeeByExSymbol = (data: QueryBalanceBody): AxiosPromise<SymbolFee> => {
  return request({
    url: '/common/queryFeeByExSymbol',
    method: 'post',
    data
  });
};

export const querySymbolFundingRate = (exchange: string, symbol: string): AxiosPromise<SymbolFundingRate> => {
  return request({
    url: '/common/querySymbolFundingRate',
    method: 'get',
    params: {
      exchange,
      symbol
    }
  });
};

/**
 * 查指定交易所指定币种合约的详情
 * @param exchange
 * @param symbol
 */
export const querySymbolContractInfo = (exchange: string, symbol: string): AxiosPromise<CoinContractInformation> => {
  return request({
    url: '/common/querySymbolContractInfo',
    method: 'get',
    params: {
      exchange,
      symbol
    }
  });
};

/**
 * 查指定交易所指定币种合约的详情
 * @param exchange
 * @param symbol
 */
export const querySymbolMarketPrice = (exchange: string, symbol: string): AxiosPromise<number> => {
  return request({
    url: '/common/querySymbolMarketPrice',
    method: 'get',
    params: {
      exchange,
      symbol
    }
  });
};
