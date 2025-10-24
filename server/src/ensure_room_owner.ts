import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

export function ensure_room_owner(client: Client, req: TReq) {
  if (client.room?.owner === client) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotRoomOwner,
    error: 'not owner'
  });
  return false;
}
