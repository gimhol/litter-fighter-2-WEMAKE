import type { RawData, WebSocket } from 'ws';
import { ErrCode, IMsgRespMap, IPlayerInfo, IResp, MsgEnum, TInfo, TReq } from "./Net";
import type { Context } from './Context';
import { Room } from './Room';
import { handle_req_chat } from './handle_req_chat';
import { ensure_in_room } from './ensure_in_room';
import { ensure_room_owner } from './ensure_room_owner';
import { ensure_not_in_room } from './ensure_not_in_room';
import { ensure_player_info } from './ensure_player_info';
let client_id = 0;

export class Client {
  static readonly TAG = 'Client'
  readonly id = 'client_' + (++client_id);
  readonly ws: WebSocket;
  readonly ctx: Context;
  player_info?: Required<IPlayerInfo>;
  room?: Room;
  ready: boolean = false;
  constructor(ctx: Context, ws: WebSocket) {
    this.ctx = ctx;
    this.ws = ws;
    ctx.client_mgr.all.add(this);
    ws.on('close', this.handle_ws_close)
    ws.on('error', e => console.error(`客户端 ${this.id} 发生错误:`, e));
    ws.on('message', this.handle_ws_msg)
  }

  resp<T extends MsgEnum, Resp extends IResp = IMsgRespMap[T]>(type: T, pid: string, resp: TInfo<Resp>) {
    return new Promise<void>((resolve, reject) => {
      if (!this.ws)
        return reject(new Error(`ws not open`))
      const _resp: IResp = { pid, type, is_resp: true, ...resp };
      this.ws.send(JSON.stringify(_resp), (err) => {
        err ? reject(err) : resolve()
      });
    })
  }

  private handle_ws_msg = (msg: RawData) => {
    const str = '' + msg;
    console.log(`[${Client.TAG}::handle_ws_msg] ${this.id} msg:`, str);
    try {
      const req: TReq = JSON.parse(str);
      this.handle_req(req)
    } catch (error) {
      console.error(`[${Client.TAG}::handle_ws_msg] 解析消息失败: ${error}`);
      this.resp(MsgEnum.Error, '', { code: ErrCode.ParseFailed, error: '消息格式错误' }).catch(() => void 0);
    }
  }

  private handle_ws_close = (code: number, reason: Buffer) => {
    console.log(`[${Client.TAG}::handle_ws_close] ${this.id} code: ${code}, reason: ${reason}`);
    const { ctx } = this
    this.ctx.client_mgr.all.delete(this);
    const { room } = this
    if (room?.owner === this) {
      room.close(this);
      ctx.room_mgr.del(room)
    } else {
      room?.exit(this);
    }
  }

  private handle_req = (req: TReq) => {
    const { ctx } = this
    switch (req.type) {
      case MsgEnum.PlayerInfo: {
        const player_info = this.player_info = {
          id: this.id,
          name: req.name?.trim() || `玩家${this.id}`
        }
        this.resp(req.type, req.pid, { player: player_info }).catch(() => void 0)
        break;
      }
      case MsgEnum.CreateRoom: {
        if (
          ensure_player_info(this, req) &&
          ensure_not_in_room(this, req)
        ) this.room = new Room(this, req);
        break;
      }
      case MsgEnum.JoinRoom: {
        if (
          ensure_player_info(this, req) &&
          ensure_not_in_room(this, req)
        ) {
          let room: Room | null = null
          for (const r of ctx.room_mgr.all) {
            if (r.id === req.roomid) {
              room = r;
              break;
            }
          }
          if (room) room.join(this, req);
          else this.resp(
            req.type,
            req.pid,
            { code: ErrCode.RoomNotFound, error: 'room not found' }
          ).catch(() => void 0)
        }
        break;
      }
      case MsgEnum.ExitRoom: {
        if (
          ensure_player_info(this, req) &&
          ensure_in_room(this, req)
        ) this.room?.exit(this, req);
        break;
      }
      case MsgEnum.PlayerReady: {
        if (
          ensure_player_info(this, req) &&
          ensure_in_room(this, req)
        ) this.room?.ready(this, req);
        break;
      }
      case MsgEnum.CloseRoom: {
        if (
          ensure_player_info(this, req) &&
          ensure_in_room(this, req) &&
          ensure_room_owner(this, req)
        ) this.room?.close(this, req)
        break;
      }
      case MsgEnum.RoomStart: {
        if (
          ensure_player_info(this, req) &&
          ensure_in_room(this, req) &&
          ensure_room_owner(this, req)
        ) this.room?.start(this, req)
        break;
      }
      case MsgEnum.ListRooms: {
        if (
          ensure_player_info(this, req)
        ) this.resp(req.type, req.pid, { rooms: Array.from(ctx.room_mgr.all).map(v => v.room_info) }).catch(() => void 0)
        break;
      }
      case MsgEnum.Kick: {
        const room = this.room
        if (
          ensure_player_info(this, req) &&
          ensure_in_room(this, req) &&
          ensure_room_owner(this, req) &&
          room
        ) {
          room.kick(req)
        }
        break;
      }
      case MsgEnum.Chat: handle_req_chat(this, req); break;

    }
  }
}