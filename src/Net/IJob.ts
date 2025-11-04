import type { IResp } from "./_Base";
import type { ISendOpts } from "./ISendOpts";

export interface IJob extends ISendOpts {
  resolve(r: IResp): void;
  reject(e: any): void;
  timerId?: any;
}
