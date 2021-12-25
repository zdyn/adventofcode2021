#!/usr/bin/env -S deno run --allow-read

performance.mark("start");

const input = await Deno.readTextFile("d07.txt");

const positions = input
  .trim()
  .split(",")
  .map(Number);
const max = Math.max(...positions);

let s1 = Infinity, s2 = Infinity;

for (let i = Math.min(...positions); i <= max; i++) {
  s1 = Math.min(s1, positions.reduce((agg, p) => {
    return agg + Math.abs(p - i);
  }, 0));
  s2 = Math.min(s2, positions.reduce((agg, p) => {
    return agg + Math.abs(p - i) * (Math.abs(p - i) + 1) / 2;
  }, 0));
}

// Part 1.
console.log(s1);

// Part 2.
console.log(s2);

performance.mark("end");
const duration = performance.measure("duration", "start", "end").duration;
console.log(`duration: ${duration}ms`);
