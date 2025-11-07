import type { Client } from './Client';
import { ensure_in_room } from './ensure_in_room';
import { ensure_player_info } from './ensure_player_info';
import { IReqGameTick } from './IMsg_GameTick';
import { MsgEnum } from './MsgEnum';


export function handle_req_tick(client: Client, req: IReqGameTick): void {
  const { room } = client;
  if (!ensure_player_info(client, req)) return;
  if (!ensure_in_room(client, req)) return;
  if (!room) return;

  room.tick(client, req)
}
