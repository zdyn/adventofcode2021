#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d15.txt");
const nums = [9, 1, 2, 3, 4, 5, 6, 7, 8];
const adj = (i, j) => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
};
const cave = input.trim().split(/\n/g).map((l) => l.split("").map(Number));
const cave2 = [...Array(cave.length * 5).keys()].map((i) => {
  return [...Array(cave.length * 5).keys()].map((j) => {
    const diff = ~~(i / cave.length) + ~~(j / cave.length);
    return nums[(cave[i % cave.length][j % cave.length] + diff) % 9];
  });
});
const minSum = (cave) => {
  const agg = cave.map((row) => row.map(() => Infinity));
  agg[0][0] = cave[0][0];
  while (true) {
    let changes = 0;
    for (let i = 0; i < cave.length; i++) {
      for (let j = 0; j < cave.length; j++) {
        for (let [r, c] of adj(i, j)) {
          if (
            r < 0 || c < 0 || r >= cave.length || c >= cave.length ||
            agg[r][c] === Infinity || agg[i][j] <= agg[r][c] + cave[i][j]
          ) continue;
          changes++;
          agg[i][j] = agg[r][c] + cave[i][j];
        }
      }
    }
    if (changes === 0) break;
  }
  return agg[agg.length - 1][agg.length - 1];
};
console.log(minSum(cave) - cave[0][0]);
console.log(minSum(cave2) - cave2[0][0]);
