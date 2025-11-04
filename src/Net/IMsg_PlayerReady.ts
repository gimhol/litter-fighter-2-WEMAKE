import type { IReq, IResp } from './_Base';
import type { IPlayerInfo } from './IPlayerInfo';
import type { MsgEnum } from './MsgEnum';

export interface IReqPlayerReady extends IReq<MsgEnum.PlayerReady> {
  ready?: boolean;
}

export interface IRespPlayerReady extends IResp<MsgEnum.PlayerReady> {
  ready?: boolean;
  player?: IPlayerInfo;
}

