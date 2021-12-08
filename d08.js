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
Set.prototype.intersection = function(s) {
  return new Set([...this.values()].filter((n) => s.has(n)));
};
sum = 0;
// All credit to Katherine Threlkeld.
for (let [signals, output] of entries) {
  let one = null, four = null, seven = null;
  for (let signal of signals) {
    let s = new Set(signal.split(""));
    if (signal.length === 2) one = s;
    else if (signal.length === 3) seven = s;
    else if (signal.length === 4) four = s;
  }
  let n = output
    .map((o) => {
      o = new Set(o.split(""));
      switch (o.size) {
        case 2: return 1;
        case 3: return 7;
        case 4: return 4;
        case 5:
          if (o.intersection(one).size === 2) return 3;
          else if (o.intersection(four).size === 2) return 2;
          else return 5;
        case 6:
          if (o.intersection(seven).size === 3) {
            if (o.intersection(four).size === 4) return 9;
            else return 0;
          } else {
            return 6;
          }
        case 7: return 8;
      }
    })
    .join("");
  sum += Number(n);
}
console.log(sum);
