import type { IPlayerInfo } from "./IPlayerInfo";

/**
 * 房间内玩家信息
 *
 * @export
 * @interface IRoomPlayerInfo
 * @extends {IPlayerInfo}
 */
export interface IRoomPlayerInfo extends IPlayerInfo {
  /**
   * 玩家是否“已准备就绪”
   *
   * @type {boolean}
   * @memberof IRoomPlayerInfo
   */
  ready?: boolean;
}
