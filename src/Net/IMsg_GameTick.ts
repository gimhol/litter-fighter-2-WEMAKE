import type { IReq, IResp } from './_Base';
import type { IPlayerInfo } from './IPlayerInfo';
import type { MsgEnum } from './MsgEnum';

export interface IReqGameTick extends IReq<MsgEnum.Tick> {
  seq?: number;
  cmd?: string;
  x?: number;
  y?: number;
  z?: number;
  f?: string;
}
export interface IRespGameTick extends IResp<MsgEnum.Tick> {
  list?: {
    player?: IPlayerInfo;
    req?: IReqGameTick;
  }[]
}
