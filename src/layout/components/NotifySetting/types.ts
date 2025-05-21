export interface ApiSettingVo {
  exchangeName?: string;
  status?: number;
}

export interface ApiSettingDetail {
  exchangeName?: string;
  status?: number;
}
export interface ApiSettingCheck {
  checkStatus?: string;
}
export interface UpdateApiSettingVo {
  exchange: string;
  apiKey: string;
  apiSecurity: string;
  passphrase: string;
}
/**
 * @author xuehui_li
 * @Version 1.0
 * @date 2025/5/6 10:51
 * @Content
 */
export interface WebsocketStatus {
  exchange?: string;

  wsType?: string;

  status?: string;

  dely?: number;

  apiId?: number;
  apiName?: string;
}

export interface WebsocketExStatus {
  exchangeName: string;
  datas: WebsocketStatus;
}
