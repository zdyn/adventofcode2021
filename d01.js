#!/usr/bin/env -S deno run --allow-read

performance.mark("start");

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

performance.mark("end");
const duration = performance.measure("duration", "start", "end").duration;
console.log(`duration: ${duration}ms`);
