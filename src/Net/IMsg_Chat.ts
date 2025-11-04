import type { IReq, IResp } from "./_Base";
import type { IPlayerInfo } from "./IPlayerInfo";
import type { MsgEnum } from "./MsgEnum";

export interface IReqChat extends IReq<MsgEnum.Chat> {
  /**
   * 聊天目标对象
   *
   * @type {('global' | 'room' | 'private')}
   * @memberof IReqChat
   */
  target?: 'global' | 'room' | 'private';
  
  /**
   * 玩家发送的消息
   *
   * @type {string}
   * @memberof IReqChat
   */
  text?: string;
}

export interface IRespChat extends IResp<MsgEnum.Chat> {
  seq?: number;
  /** 发送人 */
  sender?: IPlayerInfo;
  /** 发送时间 */
  date?: number;
  target?: 'global' | 'room' | 'private';
  text?: string;
}

