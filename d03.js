#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d03.txt");
const nums = input
  .split("\n")
  .filter((s) => s)
  .map((s) => s.split("").map(Number));
const h = nums.length;
const w = nums[0].length;
// Part 1.
const counts = nums.reduce((agg, a) => agg.map((n, i) => n + a[i]), Array(w).fill(0));
const gam = parseInt(counts.map((c) => c > h / 2 ? 1 : 0).join(""), 2);
console.log(gam * (gam ^ (Math.pow(2, w) - 1)));
// Part 2.
let ogr = nums.slice();
for (let i = 0; ogr.length > 1 && i < w; i++) {
  const o = [], z = [];
  for (let num of ogr) {
    num[i] ? o.push(num) : z.push(num);
  }
  ogr = o.length >= z.length ? o : z;
}
let csr = nums.slice();
for (let i = 0; csr.length > 1 && i < w; i++) {
  const o = [], z = [];
  for (let num of csr) {
    num[i] ? o.push(num) : z.push(num);
  }
  csr = z.length <= o.length ? z : o;
}
console.log(
  parseInt(ogr[0].join(""), 2) *
  parseInt(csr[0].join(""), 2)
);
