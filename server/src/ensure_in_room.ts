import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

/**
 * 检查客户端是否在房间内，若客户端不在任何房间，将向客户端回应：错误码ErrCode.NotInRoom
 * 
 * @export
 * @see {ErrCode.NotInRoom}
 * @param {Client} client 客户端实例
 * @param {TReq} req 任意请求
 * @return {boolean} 客户端在房间内时，返回true，否则返回false
 */
export function ensure_in_room(client: Client, req: TReq): boolean {
  if (client.room) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotInRoom,
    error: 'not in room'
  }).catch(() => void 0);
  return false;
}
