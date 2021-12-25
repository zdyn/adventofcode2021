#!/usr/bin/env -S deno run --allow-read

performance.mark("start");

const input = await Deno.readTextFile("d06.txt");

const lives = input
  .trim()
  .split(",")
  .map(Number);

const memo = new Map();
const recurse = (remainder) => {
  if (memo.has(remainder)) return memo.get(remainder);

  let sum = 1;
  remainder -= 9;
  while (remainder > 0) {
    memo.set(remainder, recurse(remainder));
    sum += memo.get(remainder);
    remainder -= 7;
  }
  return sum;
};

// Part 1.
console.log(lives.reduce((agg, l) => {
  return agg + recurse(80 + 9 - l);
}, 0));

// Part 2.
console.log(lives.reduce((agg, l) => {
  return agg + recurse(256 + 9 - l);
}, 0));

performance.mark("end");
const duration = performance.measure("duration", "start", "end").duration;
console.log(`duration: ${duration}ms`);
