import type { IBdyInfo } from "./IBdyInfo";
import type { IBpointInfo } from "./IBpointInfo";
import type { ICpointInfo } from "./ICpointInfo";
import type { IFramePictureInfo } from "./IFramePictureInfo";
import type { IHitKeyCollection } from "./IHitKeyCollection";
import type { IHoldKeyCollection } from "./IHoldKeyCollection";
import type { IItrInfo } from "./IItrInfo";
import type { TNextFrame } from "./INextFrame";
import type { IOpointInfo } from "./IOpointInfo";
import type { IQubePair } from "./IQubePair";
import type { IWpointInfo } from "./IWpointInfo";
import type { SpeedMode } from "./SpeedMode";
import type { StateEnum } from "./StateEnum";

export interface IFrameInfo {

  /**
   * 帧ID
   * 
   * 每个实体的帧ID不允许重复
   *
   * @type {string}
   * @memberof IFrameInfo
   */
  id: string;

  /**
   * 帧名
   *
   * @type {string}
   * @memberof IFrameInfo
   */
  name: string;

  pic?: IFramePictureInfo;

  /**
   *
   * @see {StateEnum}
   * @type {number}
   * @memberof IFrameInfo
   */
  state: number | StateEnum;

  /**
   * 帧等待数
   * 
   * 本帧持续多长时间
   * 
   * @type {number}
   * @memberof IFrameInfo
   */
  wait: number;

  /**
   * wait end, what next?
   *
   * @type {TNextFrame}
   */
  next: TNextFrame;
  dvx?: number;
  dvy?: number;
  dvz?: number;

  acc_x?: number;
  acc_y?: number;
  acc_z?: number;

  /** @see {SpeedMode} */
  vxm?: number | SpeedMode;
  /** @see {SpeedMode} */
  vym?: number | SpeedMode;
  /** @see {SpeedMode} */
  vzm?: number | SpeedMode;

  centerx: number;
  centery: number;
  sound?: string;

  /**
   * 此frame消耗的血量，每帧都会扣
   *
   * 原版的角色消耗mp与hp见INextFrame
   *
   * @see {INextFrame}
   */
  hp?: number;

  hold?: IHoldKeyCollection;
  hit?: IHitKeyCollection;
  bdy?: IBdyInfo[];
  itr?: IItrInfo[];
  wpoint?: IWpointInfo;
  bpoint?: IBpointInfo;
  opoint?: IOpointInfo[];
  cpoint?: ICpointInfo;
  indicator_info?: IQubePair;
  invisible?: number;
  no_shadow?: number;

  /**
   * x轴速度，当按着左或右，此值生效
   */
  ctrl_spd_x?: number;

  /** 
   * @see {SpeedMode} 
   */
  ctrl_spd_x_m?: number | SpeedMode;
  ctrl_acc_x?: number;

  /**
   * z轴速度，当按着上或下，此值生效
   */
  ctrl_spd_z?: number;
  ctrl_acc_z?: number;
  /** 
   * @see {SpeedMode} 
   */
  ctrl_spd_z_m?: number | SpeedMode;

  ctrl_spd_y?: number;
  ctrl_spd_y_m?: number | SpeedMode;
  ctrl_acc_y?: number;

  /**
   * 起跳标志（角色专用）
   *
   * 从state为```StateEnum.Jump```的frame，
   * 跳至state为```StateEnum.Jump```的frame时，
   * 若前（frame.jump_flag == 1）且后（frame.jump_flag == 0）或空。
   * 此时将会计算跳跃速度，让角色跳起来。
   *
   * @see {StateEnum.Jump}
   * @type {?number}
   */
  jump_flag?: number;

  /**
   * 死亡后跳转
   *
   * hp从正数降至小于等于0时，跳转至on_dead中符合条件的帧
   *
   * @type {?TNextFrame}
   */
  on_dead?: TNextFrame;

  on_exhaustion?: TNextFrame;

  /**
   * Description placeholder
   *
   * @type {?TNextFrame}
   */
  on_landing?: TNextFrame;

  /**
   * 原ball的hit_Fa
   *
   * @type {?number}
   * @see {FrameBehavior}
   */
  behavior?: number;

  on_hit_ground?: TNextFrame;
}
