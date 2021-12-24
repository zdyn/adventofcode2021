#!/usr/bin/env -S deno run --allow-read

// 67ms
const input = await Deno.readTextFile("d05.txt");

// Shaves ~20ms compared to a set of strings.
class CoordSet {
  constructor() {
    this.map = new Map();
    this.size = 0;
    this.intersects = 0;
  }

  add(x, y) {
    const count = this.map.get(x)?.get(y);
    if (count != null) {
      if (count === 1) this.intersects++;
      this.map.get(x).set(y, count + 1);
      return;
    }

    if (!this.map.has(x)) {
      this.map.set(x, new Map());
    }
    this.map.get(x).set(y, 1);
    this.size++;
  }

  has(x, y) {
    return !!this.map.get(x)?.has(y);
  }
}

const pairs = input
  .trim()
  .split(/\n/g)
  .map((line) => {
    return line
      .split(" -> ")
      .map((s) => s.split(",").map(Number));
  });
const coords = new CoordSet();
const coords2 = new CoordSet();

pairs.forEach(([[x1, y1], [x2, y2]]) => {
  const xd = x1 === x2 ? 0 : (x2 - x1) / Math.abs(x2 - x1);
  const yd = y1 === y2 ? 0 : (y2 - y1) / Math.abs(y2 - y1);

  for (
    let i = x1, j = y1;
    (xd === 0 || i !== x2 + xd) &&
    (yd === 0 || j !== y2 + yd);
    i += xd, j += yd
  ) {
    if (!xd || !yd) coords.add(i, j);
    coords2.add(i, j);
  }
});

// Part 1.
console.log(coords.intersects);

// Part 2.
console.log(coords2.intersects);
