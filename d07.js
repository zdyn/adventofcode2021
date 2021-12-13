#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d07.txt");
const positions = input.trim().split(",").map(Number);
let s1 = Infinity, s2 = Infinity;
let max = Math.max(...positions);
for (let i = Math.min(...positions); i < max; i++) {
  s1 = Math.min(s1, positions.reduce((agg, p) => agg + Math.abs(p - i), 0));
  s2 = Math.min(s2, positions.reduce((agg, p) => agg + Math.abs(p - i) * (Math.abs(p - i) + 1) / 2, 0));
}
console.log(s1);
console.log(s2);
