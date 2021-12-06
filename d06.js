#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d06.txt");
const lives = input.trim().split(",").map(Number);
const memo = new Map();
const recurse = (rem) => {
  if (memo.has(rem)) return memo.get(rem);
  let sum = 1;
  rem -= 9;
  while (rem > 0) {
    memo.set(rem, recurse(rem));
    sum += memo.get(rem);
    rem -= 7;
  }
  return sum;
};
const sum1 = lives.reduce((agg, l) => agg + recurse(80 + 9 - l), 0);
const sum2 = lives.reduce((agg, l) => agg + recurse(256 + 9 - l), 0);
console.log(sum1);
console.log(sum2);
