import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TaskQuery, TaskVO } from '@/api/system/task/types';
import { AiConfigQuery, AiConfigVO } from '@/api/system/aiConfig/types';
import { ArbitrageItem, CoinFundingInfo } from '@/api/system/analysis/types';

export const getInterestArbitrageV2 = (ex: string): AxiosPromise<CoinFundingInfo[]> => {
  return request({
    url: '/analysis/interestArbitrageV2',
    method: 'get',
    params: {
      ex: ex
    }
  });
};
