
export function random_str(len = 8): string {
  const n: number[] = [];
  for (let index = 0; index < len; index++)
    n.push(65 + Math.floor(Math.random() * 24));
  return String.fromCharCode(...n);
}
