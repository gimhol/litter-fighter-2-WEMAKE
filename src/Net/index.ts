import type { IMsgReqMap, IMsgRespMap } from "./IMsgMap";

export type TReq = IMsgReqMap[keyof IMsgReqMap]
export type TResp = IMsgRespMap[keyof IMsgRespMap]
export type TInfo<T> = Omit<T, 'pid' | 'type' | 'is_resp' | 'is_req'>
export * from "./_Base";
export * from "./ErrCode";
export * from "./IMsg_Chat";
export * from "./IMsg_CloseRoom";
export * from "./IMsg_CreateRoom";
export * from "./IMsg_ExitRoom";
export * from "./IMsg_JoinRoom";
export * from "./IMsg_ListRooms";
export * from "./IMsg_PlayerInfo";
export * from "./IMsg_PlayerReady";
export * from "./IMsg_RoomStart";
export * from "./IMsgMap";
export * from "./IPlayerInfo";
export * from "./IRoomInfo";
export * from "./MsgEnum";
