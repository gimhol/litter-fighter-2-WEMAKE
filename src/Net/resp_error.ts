import type { IConnError } from "./IConnError";
import { ErrCode } from "./ErrCode";
import type { IResp } from "./_Base";

export function resp_error(resp: IResp): IConnError {
  const code = resp.code ?? ErrCode.Unknown;
  const info = resp.error ?? 'unknown error';
  return Object.assign(new Error(`[${code}]${info}`), {
    type: resp.type ?? 'unknown',
    code: code,
    error: info
  });
}
