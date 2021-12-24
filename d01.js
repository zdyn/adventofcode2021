#!/usr/bin/env -S deno run --allow-read

// 35ms
const input = await Deno.readTextFile("d01.txt");

const increasing = (nums, size) => {
  return nums.filter((n, i) => i >= size && n > nums[i - size]).length;
};

const nums = input
  .trim()
  .split(/\n/g)
  .map(Number);

// Part 1.
console.log(increasing(nums, 1));

// Part 2.
console.log(increasing(nums, 3));
