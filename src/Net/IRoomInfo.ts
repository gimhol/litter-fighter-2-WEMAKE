import type { IPlayerInfo } from "./IPlayerInfo";
import type { IRoomPlayerInfo } from "./IRoomPlayerInfo";

/**
 * 房间信息
 *
 * @export
 * @interface IRoomInfo
 */
export interface IRoomInfo {
  /**
   * 房间编号
   *
   * @type {string}
   * @memberof IRoomInfo
   */
  title?: string;

  /**
   * 房间ID
   *
   * @type {string}
   * @memberof IRoomInfo
   */
  id?: string;

  /**
   * 房间编号
   *
   * @type {string}
   * @memberof IRoomInfo
   */
  code?: string;

  /**
   * 房主
   *
   * @type {Required<IPlayerInfo>}
   * @memberof IRoomInfo
   */
  owner?: Required<IPlayerInfo>;

  /**
   * 房间内玩家
   *
   * @type {Required<IRoomPlayerInfo>[]}
   * @memberof IRoomInfo
   */
  players?: Required<IRoomPlayerInfo>[];

  /**
   * 最小玩家数
   *
   * @type {number}
   * @memberof IRoomInfo
   */
  min_players?: number;

  /**
   * 最大玩家数
   *
   * @type {number}
   * @memberof IRoomInfo
   */
  max_players?: number;
}
