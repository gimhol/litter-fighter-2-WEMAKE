import { Client } from './Client';
import { ErrCode } from './ErrCode';
import { TReq } from './Net';

export function ensure_player_info(client: Client, req: TReq) {
  if (client.player_info) return true;
  client.resp(req.type, req.pid, {
    code: ErrCode.NotRegister,
    error: 'player info not set!'
  }).catch(() => void 0);
  return false;
}
