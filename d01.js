#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d01.txt");
const nums = input
  .split("\n")
  .filter((s) => s)
  .map(Number);
const increasing = (nums, size) => {
  return nums.reduce((agg, n, i) => agg + (i >= size && n > nums[i - size]), 0);
};
console.log(increasing(nums, 1));
console.log(increasing(nums, 3));
