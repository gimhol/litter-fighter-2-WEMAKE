import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

/**
 * 客户端是否为房主，若客户端不为房主，将向客户端回应：错误码ErrCode.NotRoomOwner
 * 
 * @export
 * @see {ErrCode.NotRegister}
 * @param {Client} client 客户端实例
 * @param {TReq} req 任意请求
 * @return {boolean} 客户端为房主时，返回true，否则返回false
 */
export function ensure_room_owner(client: Client, req: TReq): boolean {
  if (client.room?.owner === client) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotRoomOwner,
    error: 'not owner'
  });
  return false;
}
