export enum EntityGroup {
  /**
   * 隐藏角色
   */
  Hidden = "hidden",

  /**
   * 常规角色
   * 属于此组的角色才可被随机到
   */
  Regular = "1000",

  /**
   * 最杂的杂鱼
   * 默认只有30和31的角色
   */
  _3000 = "3000",

  /**
   * 对战模式常规武器
   * 对战模式应当掉落属于这组的武器
   */
  VsRegularWeapon = "VsRegularWeapon",

  /**
   * 闯关常规武器
   * 闯关模式应当掉落属于这组的武器
   */
  StageRegularWeapon = "StageRegularWeapon",

  /**
   * 可被反弹为冰ball的ball
   */
  FreezableBall = "FreezableBall"
}
