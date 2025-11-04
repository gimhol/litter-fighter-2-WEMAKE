import type { IReq, IResp } from "./_Base";
import type { IRoomInfo } from "./IRoomInfo";
import type { MsgEnum } from "./MsgEnum";

export interface IReqListRooms extends IReq<MsgEnum.ListRooms> {
  offset?: number;
  limit?: number;
}

export interface IRespListRooms extends IResp<MsgEnum.ListRooms> {
  offset?: number;
  limit?: number;
  rooms?: IRoomInfo[];
  total?: number;
}