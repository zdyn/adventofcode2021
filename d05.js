#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d05.txt");
const pairs = input
  .split(/\n/g)
  .filter((s) => s)
  .map((l) => l.split(" -> ").map((s) => s.split(",").map(Number)));
const coords = new Set();
const coords2 = new Set();
const intersects = new Set();
const intersects2 = new Set();
pairs.forEach(([[x1, y1], [x2, y2]]) => {
  const xd = (x2 - x1) / Math.abs(x2 - x1) || 0;
  const yd = (y2 - y1) / Math.abs(y2 - y1) || 0;
  for (
    let i = x1, j = y1;
    ((xd >= 0 && i <= x2) || (xd <= 0 && i >= x2)) &&
    ((yd >= 0 && j <= y2) || (yd <= 0 && j >= y2));
    i += xd, j += yd
  ) {
    const key = `${i},${j}`;
    if (!xd || !yd) {
      if (coords.has(key)) intersects.add(key);
      coords.add(key);
    }
    if (coords2.has(key)) intersects2.add(key);
    coords2.add(key);
  }
});
console.log(intersects.size);
console.log(intersects2.size);
