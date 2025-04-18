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
