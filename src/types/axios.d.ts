export {};
declare module 'axios' {
  interface AxiosResponse<T = any> {
    code: number;
    msg: string;
    rows: T;
    total: number;
    extCode?:number;
    extInfo?:string;
  }
}
