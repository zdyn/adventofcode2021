#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d11.txt")
const oct = input
  .trim()
  .split(/\n/g)
  .map((l) => l.split("").map(Number));
const idxs = [...Array(oct.length * oct[0].length).keys()]
  .reduce((agg, n) => [...agg, [~~(n / oct[0].length), n % oct[0].length]], []);
const adj = (i, j) => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
    [i + 1, j + 1],
    [i - 1, j - 1],
    [i - 1, j + 1],
    [i + 1, j - 1],
  ];
};
const flash = (i, j, set) => {
  if (oct[i][j] < 10 || set.has(`${i}x${j}`)) return;
  set.add(`${i}x${j}`);
  for (let [r, c] of adj(i, j)) {
    if (r < 0 || r >= oct.length || c < 0 || c >= oct[r].length) continue;
    oct[r][c]++;
    flash(r, c, set);
  }
};
let count = 0, temp = 0, sum = 0;
while (temp !== idxs.length) {
  temp = 0;
  const set = new Set();
  for (let [i, j] of idxs) oct[i][j]++;
  for (let [i, j] of idxs) flash(i, j, set);
  for (let [i, j] of idxs) {
    if (oct[i][j] < 10) continue;
    oct[i][j] = 0;
    temp++;
  }
  sum += temp;
  count++;
  if (count === 100) console.log(sum);
}
console.log(count);
