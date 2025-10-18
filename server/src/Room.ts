import {
  ErrCode,
  IMsgRespMap,
  IReqCloseRoom, IReqCreateRoom,
  IReqExitRoom,
  IReqJoinRoom, IReqKick, IReqPlayerReady, IReqRoomStart, IResp, IRespCloseRoom,
  IRespExitRoom,
  IRespJoinRoom, IRespKick, IRespPlayerReady, IRoomInfo, MsgEnum, TInfo
} from "../../src/Net/index";
import { random_str, type Client } from './Client';
import type { Context } from "./Context";

let room_id = 0;
export class Room {
  static TAG = 'Room';
  readonly id = '' + (++room_id);
  readonly ctx: Context;
  protected _code: string = '';
  owner: Client;
  min_players: number = 2;
  max_players: number = 4;
  title: string = `ROOM_${this.id}`;
  players = new Set<Client>();
  get code() { return this._code; }
  get room_info(): Required<IRoomInfo> {
    return {
      title: this.title,
      code: this._code,
      id: this.id,
      owner: this.owner.player_info!,
      players: Array.from(this.players).map(v => ({
        ...v.player_info!,
        ready: v.ready
      })),
      min_players: this.min_players,
      max_players: this.max_players,
    }
  }
  constructor(owner: Client, req: IReqCreateRoom) {
    const { ctx } = owner
    this.ctx = ctx
    this.owner = owner;

    while (!this._code || ctx.room_mgr.codes.has(this._code)) {
      this._code = random_str();
    }
    ctx.room_mgr.add(this)


    this.title = req.title?.trim() || `${owner.player_info?.name}的房间`
    const { max_players = 4, min_players = 2 } = req
    if (typeof max_players === 'number' && max_players >= 2)
      this.max_players = Math.floor(max_players)

    if (typeof min_players === 'number' && min_players < 2)
      this.min_players = Math.floor(min_players)

    this.players.add(owner);
    owner.room = this;
    owner.resp(req.type, req.pid, { room: this.room_info })

  }

  ready(client: Client, req: IReqPlayerReady = { type: MsgEnum.PlayerReady, pid: '' }) {
    console.log(`[${Room.TAG}::ready]`)
    const { players } = this;
    const { player_info, room } = client;
    if (!players.has(client)) return false;
    if (!player_info) return false;
    if (room !== this) return false;

    client.ready = req.ready ?? client.ready;
    const resp: TInfo<IRespPlayerReady> = { player: player_info, ready: client.ready }
    this.broadcast(req.type, resp, client)
    client.resp(req.type, req.pid, resp)
    return true;
  }
  kick(req: IReqKick = { type: MsgEnum.Kick, pid: '' }) {
    const { players } = this;
    let client: Client | null = null
    for (const p of players) {
      if (p.id === req.playerid) {
        client = p;
        break;
      }
    }
    if (!client) return false;
    const { player_info, room } = client;
    if (room !== this) return false;

    client.ready = false
    delete client.room
    players.delete(client)
    if (this.owner === client && players.size)
      room.owner = players.values().next().value!;
    const { room_info } = this;
    const resp: TInfo<IRespKick> = {
      player: player_info,
      room: room_info
    }
    this.broadcast(req.type, resp, client)
    client.resp(req.type, req.pid, resp).catch(() => void 0)
    if (!this.players.size)
      this.ctx.room_mgr.del(room)
  }
  exit(client: Client, req: IReqExitRoom = { type: MsgEnum.ExitRoom, pid: '' }) {
    console.log(`[${Room.TAG}::exit]`)
    const { players } = this;
    const { player_info, room } = client;
    if (!players.has(client)) return;
    if (!player_info) return;
    if (room !== this) return;

    client.ready = false
    delete client.room
    players.delete(client)
    if (this.owner === client && players.size)
      room.owner = players.values().next().value!;
    const { room_info } = this;
    const resp: TInfo<IRespExitRoom> = {
      player: player_info,
      room: room_info
    }
    this.broadcast(req.type, resp, client)
    client.resp(req.type, req.pid, resp).catch(() => void 0)

    if (!players.size)
      this.ctx.room_mgr.del(room)
  }

  join(client: Client, req: IReqJoinRoom = { type: MsgEnum.JoinRoom, pid: '' }) {
    console.log(`[${Room.TAG}::join]`)
    const { players } = this;
    const { player_info, room } = client;
    if (players.has(client)) return false;
    if (!player_info) return false;
    if (room) return false;

    if (this.players.size >= this.max_players) {
      client.resp(req.type, req.pid, { code: ErrCode.RoomIsFull, error: 'room is full' })
      return false
    }

    players.add(client);
    client.ready = false
    client.room = this;
    const { room_info } = this;
    const resp: TInfo<IRespJoinRoom> = {
      player: player_info,
      room: room_info
    }
    this.broadcast(req.type, resp, client)
    client.resp(req.type, req.pid, resp).catch(() => void 0)


    return true;
  }

  close(client: Client, req: IReqCloseRoom = { type: MsgEnum.CloseRoom, pid: '' }) {
    console.log(`[${Room.TAG}::close]`)
    const { players } = this;
    const { player_info, room } = client;
    if (!players.has(client)) return;
    if (!player_info) return;
    if (room !== this) return;

    const { room_info } = this
    const resp: TInfo<IRespCloseRoom> = {
      room: room_info
    }
    this.broadcast(req.type, resp, client)
    client.resp(req.type, req.pid, resp).catch(() => void 0)
    for (const pl of players) delete pl.room
    players.clear()
    this.ctx.room_mgr.del(this)
  }

  start(client: Client, req: IReqRoomStart = { type: MsgEnum.RoomStart, pid: '' }) {
    const { players } = this;
    if (players.size < this.min_players) {
      client.resp(req.type, req.pid, { code: ErrCode.PlayersTooFew, error: 'players are too few' }).catch(() => void 0)
      return;
    }

    this.broadcast(req.type, {}, client)
    client.resp(req.type, req.pid, {}).catch(() => void 0)
  }

  broadcast<T extends MsgEnum, Resp extends IResp = IMsgRespMap[T]>(type: T, resp: TInfo<Resp>, ...excludes: Client[]) {
    for (const c of this.players)
      if (!excludes.some(v => v === c))
        c.resp(type, '', resp).catch(e => { })
  }
}
