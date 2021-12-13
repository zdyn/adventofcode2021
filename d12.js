#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d12.txt");
const map = input
  .trim()
  .split(/\n/g)
  .map((l) => l.split("-"))
  .reduce((agg, [from, to]) => {
    agg[from] ??= new Set();
    agg[from].add(to);
    agg[to] ??= new Set();
    agg[to].add(from);
    return agg;
  }, {});
const visited = {};
const traverse = (cave, start = false) => {
  if (!start && cave === "start") return 0;
  if (cave === "end") return 1;
  if (cave === cave.toLowerCase() && visited[cave] >= 2) return 0;
  let sum = 0;
  for (let n of map[cave]) {
    visited[n] ??= 0;
    visited[n]++;
    sum += traverse(n);
    visited[n]--;
  }
  return sum;
};
console.log(traverse("start", true));
const traverse2 = (cave, two = false, start = false) => {
  if (!start && cave === "start") return 0;
  if (cave === "end") return 1;
  if (cave === cave.toLowerCase() && visited[cave] >= 2 && two) return 0;
  let sum = 0;
  for (let n of map[cave]) {
    visited[n] ??= 0;
    visited[n]++;
    sum += traverse2(n, two || (cave === cave.toLowerCase() && visited[cave] >= 2));
    visited[n]--;
  }
  return sum;
};
console.log(traverse2("start", false, true));
