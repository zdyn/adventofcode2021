#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d14.txt");
const segments = input
  .trim()
  .split(/\n\n/g);
let polymer = segments[0];
let transforms = segments[1]
  .split(/\n/g)
  .map((l) => l.split(" -> "))
  .reduce((agg, [from, to]) => ({...agg, [from]: to}), {});
const letterCounts = polymer
  .split("")
  .reduce((agg, n) => ({...agg, [n]: agg[n] ? agg[n] + 1 : 1}), {});
let pairCounts = [...Array(polymer.length - 1).keys()]
  .map((i) => polymer.slice(i, i + 2))
  .reduce((agg, n) => ({...agg, [n]: agg[n] ? agg[n] + 1 : 1}), {});
for (let i = 0; i < 40; i++) {
  const next = {};
  for (let pair in pairCounts) {
    if (!transforms.hasOwnProperty(pair)) continue;
    const left = pair[0] + transforms[pair];
    const right = transforms[pair] + pair[1];
    next[left] = (next[left] || 0) + pairCounts[pair];
    next[right] = (next[right] || 0) + pairCounts[pair];
    letterCounts[transforms[pair]] = (letterCounts[transforms[pair]] || 0) + pairCounts[pair];
  }
  pairCounts = next;
  if (i === 9) {
    console.log(
      Math.max.apply(null, Object.values(letterCounts)) -
      Math.min.apply(null, Object.values(letterCounts))
    );
  }
}
console.log(
  Math.max.apply(null, Object.values(letterCounts)) -
  Math.min.apply(null, Object.values(letterCounts))
);
