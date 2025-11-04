import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

/**
 * 客户端是否已Register，若客户端未Register，将向客户端回应：错误码ErrCode.NotRegister
 * 
 * @export
 * @see {ErrCode.NotRegister}
 * @param {Client} client 客户端实例
 * @param {TReq} req 任意请求
 * @return {boolean} 客户端不在房间内时，返回true，否则返回false
 */
export function ensure_player_info(client: Client, req: TReq): boolean {
  if (client.player_info) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotRegister,
    error: 'player info not set!'
  }).catch(() => void 0);
  return false;
}
