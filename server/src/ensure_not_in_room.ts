import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';
export function ensure_not_in_room(client: Client, req: TReq) {
  if (!client.room) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.AlreadyInRoom,
    error: 'already in room'
  }).catch(() => void 0);
  return false;
}
