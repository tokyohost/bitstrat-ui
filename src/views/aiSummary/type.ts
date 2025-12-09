import { ApiVO } from '@/api/system/api/types';

/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/12/8 19:59
 * @Content
 */
export interface AiStreamQuery {
  exchange?: string;

  symbol?: string;

  accountId?: string;

  apiId?: number;

  content?: string;

  positionFlag?: string;

  shortTermInterval: string;

  longTermInterval: string;

  account?: ApiVO;
}
