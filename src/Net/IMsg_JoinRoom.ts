import type { IReq, IResp } from './_Base';
import type { IPlayerInfo } from './IPlayerInfo';
import type { IRoomInfo } from './IRoomInfo';
import type { MsgEnum } from './MsgEnum';

export interface IReqJoinRoom extends IReq<MsgEnum.JoinRoom> {
  roomid?: string;
}
export interface IRespJoinRoom extends IResp<MsgEnum.JoinRoom> {
  room?: IRoomInfo;
  player?: IPlayerInfo;
}
