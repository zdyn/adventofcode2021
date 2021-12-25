#!/usr/bin/env -S deno run --allow-read

performance.mark("start");

const input = await Deno.readTextFile("d08.txt");

const entries = input
  .trim()
  .split(/\n/g)
  .map((l) => {
    return l.split(" | ").map((s) => s.split(" "));
  });

// Part 1.
let sum = entries
  .map((entry) => {
    return entry[1].filter((s) => [2, 3, 4, 7].includes(s.length)).length;
  })
  .reduce((agg, n) => agg + n, 0)

console.log(sum);

// Part 2.
Set.prototype.intersection = function(s) {
  return new Set([...this.values()].filter((n) => s.has(n)));
};

// All credit to Katherine Threlkeld.
sum = entries
  .map(([signals, output]) => {
    let one = null, four = null, seven = null;

    for (let signal of signals) {
      const s = new Set(signal.split(""));
      if (s.size === 3) seven = s;
      else if (s.size === 4) four = s;
    }

    return output.map((digit) => {
      const s = new Set(digit.split(""));
      switch (s.size) {
        case 2: return 1;
        case 3: return 7;
        case 4: return 4;
        case 5:
          if (s.intersection(four).size === 2) return 2;
          if (s.intersection(seven).size === 3) return 3;
          return 5;
        case 6:
          if (s.intersection(seven).size !== 3) return 6;
          if (s.intersection(four).size === 4) return 9;
          return 0;
        case 7: return 8;
      }
    }).join("");
  })
  .reduce((agg, n) => agg + Number(n), 0);

console.log(sum);

performance.mark("end");
const duration = performance.measure("duration", "start", "end").duration;
console.log(`duration: ${duration}ms`);
