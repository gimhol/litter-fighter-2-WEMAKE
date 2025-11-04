import type { IConnError } from "./IConnError";
import { ErrCode } from "./ErrCode";
import type { IReq } from "./_Base";

export function req_unknown_error(req: IReq, error: Error): IConnError {
  const code = ErrCode.Unknown;
  const info = `unknown error`;
  return Object.assign(error, {
    type: req.type,
    pid: req.pid,
    code: code,
    error: info
  });
}
