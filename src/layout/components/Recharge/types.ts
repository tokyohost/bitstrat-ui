export interface PayParams {
  payAmount?: number;
  payType?: string;
  priceId?: string;
}
export interface QueryPayParams {
  outTradeNo?: number | string;
}

/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/12/3 19:29
 * @Content
 */
export interface QrPayResponse {
  payType?: string;

  payAmount?: number;

  userId?: number;

  qrCodeBase64?: string;
  redirectUrl?: string;

  outTradeNo?: number | string;
}

/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/12/3 19:29
 * @Content
 */
export interface QrPayCallBack {
  tradeStatus?: string;

  tradeNo?: string;

  errorMsg?: string;

  isSuccess?: boolean;
}
