import { ErrCode, IReqChat, IRespChat, TInfo } from './Net';
import type { Client } from './Client';
import { ensure_in_room } from './ensure_in_room';
import { ensure_player_info } from './ensure_player_info';

let msg_seq = Date.now();
export function handle_req_chat(client: Client, req: IReqChat) {
  if (!ensure_player_info(client, req)) return;
  const { target, text, type, pid } = req;
  if (!target)
    return client.resp(type, pid, { code: ErrCode.ChatTargetEmpty, error: 'target can\'t be empty' });
  if (!text)
    return client.resp(type, pid, { code: ErrCode.ChatMsgEmpty, error: 'text can\'t be empty' });
  const { ctx, room } = client;
  const { player_info: sender } = client;
  const date = Date.now();
  const resp: TInfo<IRespChat> = { sender, date, text, target, seq: msg_seq++ };
  switch (target) {
    case 'global': {
      ctx.broadcast(type, resp, client);
      client.resp(type, pid, resp);
      break;
    }
    case 'room': {
      if (!ensure_in_room(client, req))
        break;
      if (!room) break;
      room?.broadcast(type, resp, client);
      client.resp(type, pid, resp);
      break;
    }
    default: {
      return client.resp(type, pid, { code: ErrCode.ChatTargetIncorrect, error: 'target is incorrect' });
    }
  }
}
