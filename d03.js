#!/usr/bin/env -S deno run --allow-read

performance.mark("start");

const input = await Deno.readTextFile("d03.txt");

const bitsets = input
  .trim()
  .split(/\n/g)
  .map((s) => s.split("").map(Number));
const height = bitsets.length;
const width = bitsets[0].length;

// Part 1.
const counts = bitsets.reduce((agg, bitset) => {
  return agg.map((n, i) => n + bitset[i]);
}, Array(width).fill(0));
const gamma = parseInt(
  counts.map((c) => c > height / 2 ? 1 : 0).join(""),
  2,
);

console.log(gamma * (gamma ^ (Math.pow(2, width) - 1)));

// Part 2.
let oxygen = bitsets.slice();
let co2 = bitsets.slice();

for (let i = 0; oxygen.length > 1 && i < width; i++) {
  const ones = [], zeros = [];
  for (let bitset of oxygen) {
    bitset[i] ? ones.push(bitset) : zeros.push(bitset);
  }
  oxygen = ones.length >= zeros.length ? ones : zeros;
}
for (let i = 0; co2.length > 1 && i < width; i++) {
  const ones = [], zeros = [];
  for (let bitset of co2) {
    bitset[i] ? ones.push(bitset) : zeros.push(bitset);
  }
  co2 = zeros.length <= ones.length ? zeros : ones;
}

console.log(
  parseInt(oxygen[0].join(""), 2) *
  parseInt(co2[0].join(""), 2)
);


performance.mark("end");
const duration = performance.measure("duration", "start", "end").duration;
console.log(`duration: ${duration}ms`);
