/**
 * 生成指定长度随机字符串
 *
 * @export
 * @param {number} [len=8] 字符串长度，默认长度为8
 * @return {string} 随机字符串
 */
export function random_str(len: number = 8): string {
  const n: number[] = [];
  for (let index = 0; index < len; index++)
    n.push(65 + Math.floor(Math.random() * 24));
  return String.fromCharCode(...n);
}
