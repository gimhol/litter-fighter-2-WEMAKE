import type { IConnError } from "./IConnError";
import { ErrCode } from "./ErrCode";
import type { IReq } from "./_Base";

export function req_timeout_error(req: IReq, timeout: number): IConnError {
  const code = ErrCode.Timeout;
  const info = `timeout! over ${timeout}ms`;
  return Object.assign(new Error(`[${code}]${info}`), {
    type: req.type,
    pid: req.pid,
    code: code,
    error: info
  });
}
