#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d06.txt")
const lives = input
  .trim()
  .split(",")
  .map(Number);

const memo = new Map();
const recurse = (l, rem) => {
  if (l === 9 && memo.has(rem)) return memo.get(rem);
  let sum = 1;
  rem -= l;
  while (rem > 0) {
    const s = recurse(9, rem);
    memo.set(rem, s);
    sum += s;
    rem -= 7;
  }
  return sum;
};
const sum1 = lives.reduce((agg, l) => agg + recurse(l, 80), 0);
const sum2 = lives.reduce((agg, l) => agg + recurse(l, 256), 0);
console.log(sum1);
console.log(sum2);
