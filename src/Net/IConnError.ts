import type { ErrCode } from "./ErrCode";
import type { MsgEnum } from "./MsgEnum";

export interface IConnError extends Error {
  type: MsgEnum | string;
  code: ErrCode | number;
  error: string;
};
