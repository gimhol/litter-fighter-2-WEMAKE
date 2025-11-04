import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

/**
 * 检查客户端是否不在房间内，若客户端在任何房间，将向客户端回应：错误码ErrCode.AlreadyInRoom
 * 
 * @export
 * @see {ErrCode.AlreadyInRoom}
 * @param {Client} client 客户端实例
 * @param {TReq} req 任意请求
 * @return {boolean} 客户端不在房间内时，返回true，否则返回false
 */
export function ensure_not_in_room(client: Client, req: TReq): boolean {
  if (!client.room) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.AlreadyInRoom,
    error: 'already in room'
  }).catch(() => void 0);
  return false;
}
