import type { IReq, IResp } from './_Base';
import type { IPlayerInfo } from "./IPlayerInfo";
import type { IRoomInfo } from './IRoomInfo';
import type { MsgEnum } from "./MsgEnum";

export interface IReqExitRoom extends IReq<MsgEnum.ExitRoom> {

}
export interface IRespExitRoom extends IResp<MsgEnum.ExitRoom> {
  player?: IPlayerInfo;
  room?: IRoomInfo;
}

export interface IReqKick extends IReq<MsgEnum.Kick> {
  playerid?: IPlayerInfo['id'];
}
export interface IRespKick extends IResp<MsgEnum.Kick> {
  player?: IPlayerInfo;
  room?: IRoomInfo;
}
