import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

export function ensure_in_room(client: Client, req: TReq) {
  if (client.room) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotInRoom,
    error: 'not in room'
  }).catch(() => void 0);
  return false;
}
