#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d09.txt")
const rows = input
  .trim()
  .split(/\n/g)
  .map((s) => [Infinity, ...s.split("").map(Number), Infinity]);
rows.unshift(Array(rows[0].length).fill(Infinity));
rows.push(Array(rows[0].length).fill(Infinity));
let sum = 0;
let basins = [];
const adj = (i, j) => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
};
const size = (i, j) => {
  if (rows[i][j] >= 9) return 0;
  let sum = 1;
  rows[i][j] = Infinity;
  return 1 + adj(i, j).map(([r, c]) => size(r, c)).reduce((agg, n) => agg + n, 0);
};
for (let i = 1; i < rows.length - 1; i++) {
  for (let j = 1; j < rows[i].length - 1; j++) {
    const h = rows[i][j];
    if (h >= 9 || h !== Math.min(h, ...adj(i, j).map(([r, c]) => rows[r][c]))) continue;
    sum += h + 1;
    basins.push(size(i, j));
  }
}
console.log(sum);
console.log(basins.sort((a, b) => b - a).slice(0, 3).reduce((agg, n) => agg * n, 1));
