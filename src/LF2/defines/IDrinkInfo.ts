/**
 * 饮料数据
 *
 * @export
 * @interface IDrinkInfo
 */
export interface IDrinkInfo {
  /**
   * 最多能恢复多少HP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_h_total?: number;

  /**
   * 每次恢复多少HP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_h_value?: number;

  /**
   * 间隔多少帧触发一次HP恢复
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_h_ticks?: number;

  /**
   * 该饮料最多能恢复多少暗HP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_r_total?: number;

  /**
   * 每次恢复恢复多少暗HP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_r_value?: number;

  /**
   * 间隔多少帧触发一次暗HP恢复
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  hp_r_ticks?: number;

  /**
   * 最多能恢复多少MP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  mp_h_total?: number;

  /**
   * 每次恢复恢复多少MP
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  mp_h_value?: number;

  /**
   * 间隔多少帧触发一次MP恢复
   *
   * @type {number}
   * @memberof IDrinkInfo
   */
  mp_h_ticks?: number;
}
