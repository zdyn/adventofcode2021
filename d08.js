#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d08.txt")
const entries = input
  .trim()
  .split(/\n/g)
  .map((l) => l.split(" | ").map((s) => s.split(" ")));
let sum = entries
  .map((e) => e[1].filter((s) => [2, 3, 4, 7].includes(s.length)).length)
  .reduce((agg, n) => agg + n, 0)
console.log(sum);
const segments = "abcdefg".split("");
const nums = {
  "abcefg": 0,
  "cf": 1,
  "acdeg": 2,
  "acdfg": 3,
  "bcdf": 4,
  "abdfg": 5,
  "abdefg": 6,
  "acf": 7,
  "abcdefg": 8,
  "abcdfg": 9,
};
Set.prototype.intersection = function(s) {
  [...this.values()]
    .filter((n) => !s.has(n))
    .forEach((n) => this.delete(n));
  return this;
};
Set.prototype.difference = function(s) {
  [...s.values()].forEach((n) => this.delete(n));
  return this;
};
sum = 0;
for (let [signals, output] of entries) {
  const possible = {};
  for (let s of segments) {
    possible[s] = new Set(segments);
  }
  signals.sort((a, b) => a.length - b.length);
  for (let signal of signals) {
    const set = new Set(signal.split(""));
    switch (signal.length) {
      case 2:
        "cf".split("").forEach((c) => possible[c] = set);
        break;
      case 3:
        "acf".split("").forEach((c) => possible[c].intersection(set));
        possible["a"].difference(possible["c"]);
        break;
      case 4:
        "bcdf".split("").forEach((c) => possible[c].intersection(set));
        "bd".split("").forEach((c) => possible[c].difference(possible["c"]));
        break;
      case 6:
        const diff = new Set(segments).difference(set);
        if (possible["c"].has([...diff.values()][0])) possible["c"] = diff;
        else if (possible["d"].has([...diff.values()][0])) possible["d"] = diff;
        else possible["e"] = diff;
        break;
    }
  }
  possible["b"].difference(possible["d"]);
  possible["f"].difference(possible["c"]);
  "abcdef".split("").forEach((c) => possible["g"].difference(possible[c]));
  const reverse = {};
  for (let k in possible) {
    reverse[[...possible[k].values()][0]] = k;
  }
  sum += Number(
    output.map((o) => nums[o.split("").map((c) => reverse[c]).sort().join("")]).join("")
  );
}
console.log(sum);
