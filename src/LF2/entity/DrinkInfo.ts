import { IDrinkInfo } from "../defines";
import { Times } from "../ui/utils/Times";

/**
 * 饮料数据类
 *
 * @export
 * @interface DrinkInfo
 */
export class DrinkInfo {
  /**
   * 间隔多少帧触发一次HP恢复
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  readonly hp_h_ticks: Times;

  /**
   * 每次恢复多少HP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_h_value: number = 0;

  /**
   * 最多能恢复多少HP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_h_total: number = 0;

  /**
   * 已消耗多少量（HP）
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_h: number = 0;

  /**
   * 间隔多少帧触发一次暗HP恢复
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  readonly hp_r_ticks: Times;

  /**
   * 该饮料最多能恢复多少暗HP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_r_total: number = 0;

  /**
   * 每次恢复恢复多少暗HP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_r_value: number = 0;

  /**
   * 已消耗多少量（HP_R）
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  hp_r: number = 0;

  /**
   * 间隔多少帧触发一次MP恢复
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  readonly mp_h_ticks: Times;

  /**
   * 每次恢复恢复多少MP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  mp_h_value: number = 0;

  /**
   * 最多能恢复多少MP
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  mp_h_total: number = 0;

  /**
   * 已消耗多少量（MP_R）
   *
   * @type {number}
   * @memberof DrinkInfo
   */
  mp_h: number = 0;

  constructor(info: IDrinkInfo) {
    this.hp_h_ticks = new Times(0, info.hp_h_ticks);
    this.hp_h_value = info.hp_h_value ?? 0
    this.hp_h_total = (info.hp_h_total ?? 9999999);

    this.hp_r_ticks = new Times(0, info.hp_r_ticks);
    this.hp_r_value = info.hp_r_value ?? 0
    this.hp_r_total = (info.hp_r_total ?? 9999999);

    this.mp_h_ticks = new Times(0, info.mp_h_ticks);
    this.mp_h_value = info.mp_h_value ?? 0
    this.mp_h_total = (info.mp_h_total ?? 9999999);
  }

  /**
   * 是否以消耗完毕（HP）
   *
   * @readonly
   * @type {boolean}
   * @memberof DrinkInfo
   */
  get hp_h_empty() {
    return this.hp_h >= this.hp_h_total || !this.hp_h_value
  }

  /**
   * 是否以消耗完毕（HP_R）
   *
   * @readonly
   * @type {boolean}
   * @memberof DrinkInfo
   */
  get hp_r_empty() {
    return this.hp_r >= this.hp_r_total || !this.hp_r_value
  }

  
  /**
   * 是否以消耗完毕（MP）
   *
   * @readonly
   * @type {boolean}
   * @memberof DrinkInfo
   */
  get mp_h_empty() {
    return this.mp_h >= this.mp_h_total || !this.mp_h_value
  }
}
