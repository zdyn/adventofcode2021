#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d07.txt")
const positions = input.trim().split(",").map(Number);
let sum1 = Infinity, sum2 = Infinity;
let max = Math.max(...positions);
for (let i = Math.min(...positions); i < max; i++) {
  let s1 = 0, s2 = 0;
  for (let p of positions) {
    s1 += Math.abs(p - i);
    s2 += Math.abs(p - i) * (Math.abs(p - i) + 1) / 2;
  }
  sum1 = Math.min(sum1, s1);
  sum2 = Math.min(sum2, s2);
}
console.log(sum1);
console.log(sum2);
