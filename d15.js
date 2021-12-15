#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d15.txt");
// Returns an array of [row, column] for cardinally adjacent neighbors.
const adj = (i, j) => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
};
const cave = input.trim().split(/\n/g).map((l) => l.split("").map(Number));
// Used for extending the grid.
const nums = [9, 1, 2, 3, 4, 5, 6, 7, 8];
// The extended cave.
const cave2 = [...Array(cave.length * 5).keys()].map((i) => {
  return [...Array(cave.length * 5).keys()].map((j) => {
    // diff is the "distance" of the duplicated grid from the original.
    const diff = ~~(i / cave.length) + ~~(j / cave.length);
    return nums[(cave[i % cave.length][j % cave.length] + diff) % 9];
  });
});
const minSum = (cave) => {
  // Keeps track of changed cells. Using a set would require transforming the
  // tuples to a valid key, which is much slower.
  let changed = [];
  // agg will eventually represent the minimum distances from 0,0.
  const agg = cave.map((row) => row.map(() => Infinity));
  agg[0][0] = cave[0][0];
  // Do a first pass using just down and right "movements".
  for (let i = 0; i < cave.length; i++) {
    for (let j = 0; j < cave.length; j++) {
      changed.push([i, j]);
      for (let [r, c] of adj(i, j)) {
        // Ignore out-of-bounds neighbors.
        if (r < 0 || c < 0 || r >= cave.length || c >= cave.length) continue;
        // For the first pass, ignore down and right neighbors.
        if (r > i || c > j) continue;
        agg[i][j] = Math.min(agg[i][j], agg[r][c] + cave[i][j]);
      }
    }
  }
  // Repeat passes for changed cells until cells stop changing.
  while (changed.length > 0) {
    const next = [];
    // For each changed cell, check if there is a shorter path from it to a neighbor.
    for (let [i, j] of changed) {
      for (let [r, c] of adj(i, j)) {
        // Ignore out-of-bounds neighbors.
        if (r < 0 || c < 0 || r >= cave.length || c >= cave.length) continue;
        if (agg[i][j] + cave[r][c] < agg[r][c]) {
          agg[r][c] = agg[i][j] + cave[r][c];
          next.push([r, c]);
        }
      }
    }
    changed = next;
  }
  return agg[agg.length - 1][agg.length - 1];
};
console.log(minSum(cave) - cave[0][0]);
console.log(minSum(cave2) - cave2[0][0]);
