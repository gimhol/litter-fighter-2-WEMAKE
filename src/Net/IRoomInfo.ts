import { IPlayerInfo } from "./IPlayerInfo";
export interface IRoomPlayerInfo extends IPlayerInfo {
  ready?: boolean;
}
export interface IRoomInfo {
  title?: string;
  id?: string;
  code?: string;
  owner?: Required<IPlayerInfo>;
  players?: Required<IRoomPlayerInfo>[];
  min_players?: number;
  max_players?: number;
}
