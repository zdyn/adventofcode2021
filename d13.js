#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d13.txt");
const parts = input.trim().split(/\n\n/g);
const coords = parts[0].split(/\n/g).map((l) => l.split(",").map(Number));
const folds = parts[1].split(/\n/g).map((s) => /(x|y)=(\d+)/.exec(s).slice(1));
const set = new Set();
const key = (x, y) => `${x}x${y}`;
const xy = (key) => key.split("x").map(Number);
for (let [x, y] of coords) set.add(key(x, y));
for (let i = 0; i < folds.length; i++) {
  const [axis, num] = folds[i];
  if (axis === "x") {
    [...set].map((k) => xy(k)).filter(([x]) => x > num).forEach(([x, y]) => {
      set.delete(key(x, y));
      set.add(key(2 * num - x, y));
    });
  } else {
    [...set].map((k) => xy(k)).filter(([_, y]) => y > num).forEach(([x, y]) => {
      set.delete(key(x, y));
      set.add(key(x, 2 * num - y));
    });
  }
  if (i === 0) console.log(set.size);
}
const maxCol = Math.max.apply(null, [...set].map((k) => xy(k)[0]));
const maxRow = Math.max.apply(null, [...set].map((k) => xy(k)[1]));
for (let row = 0; row <= maxRow; row++) {
  let s = "";
  for (let col = 0; col <= maxCol; col++) {
    s += set.has(key(col, row)) ? "#" : " ";
  }
  console.log(s);
}
