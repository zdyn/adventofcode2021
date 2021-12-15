#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d15.txt");
const cave = input.trim().split(/\n/g).map((l) => l.split("").map(Number));
const adj = (i, j) => {
  return [
    [i + 1, j],
    [i - 1, j],
    [i, j + 1],
    [i, j - 1],
  ];
};
const key = (x, y) => `${x}x${y}`;
const minSum = (cave) => {
  const size = cave.length;
  const aggCave = cave.map((r) => r.slice());
  const minPath = {"0x0": cave[0][0]};
  const aggPath = cave.map((r) => r.map(() => []));
  aggPath[0][0] = ["0x0"];
  for (let i = 1; i < size * 2 - 1; i++) {
    let x = Math.min(i, size - 1);
    let y = i - x;
    while (x >= 0 && y < size) {
      const k = key(x, y);
      const n1 = x > 0 ? aggCave[x - 1][y] : Infinity;
      const n2 = y > 0 ? aggCave[x][y - 1] : Infinity;
      if (n1 < n2) {
        aggPath[x][y] = aggPath[x - 1][y].slice().concat(k);
      } else {
        aggPath[x][y] = aggPath[x][y - 1].slice().concat(k);
      }
      aggCave[x][y] += Math.min(n1, n2);
      minPath[k] = aggCave[x][y];
      x--;
      y++;
    }
  }
  const path = aggPath[size - 1][size - 1]
    .map((s) => s.split("x").map(Number))
    .slice(1);
  let min = aggCave[size - 1][size - 1];
  const visited = new Set(["0x0"]);
  const traverse = (i, j, sum) => {
    sum += cave[i][j];
    if (path.length > 0) {
      const [r, c] = path.shift();
      const k = key(r, c);
      visited.add(k);
      traverse(r, c, sum);
      visited.delete(k);
    } else {
      if (sum > min) return;
      const k = key(i, j);
      if (minPath[k] <= sum) return;
      minPath[k] = sum;
      if (i === size - 1 && j === size - 1) {
        min = Math.min(min, sum);
        return;
      }
    }
    for (let [r, c] of adj(i, j)) {
      const k2 = key(r, c);
      if (
        r < 0 || c < 0 ||
        r >= cave.length || c >= cave[r].length ||
        visited.has(k2)
      ) continue;
      visited.add(k2);
      traverse(r, c, sum);
      visited.delete(k2);
    }
  };
  traverse(0, 0, 0);
  return min - cave[0][0];
};
console.log(minSum(cave));
const size = cave.length;
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < size; j++) {
    cave.push(cave[cave.length - size].map((n) => (n + 1) % 10 || 1));
  }
}
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < size; j++) {
    for (let k = 0; k < cave.length; k++) {
      let n = cave[k][cave[k].length - size];
      cave[k].push((n + 1) % 10 || 1);
    }
  }
}
console.log(minSum(cave));
