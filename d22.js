#!/usr/bin/env -S deno run --allow-read

// 114ms
const input = await Deno.readTextFile("d22.txt");

// Returns a 3-bit integer to represent 5 states.
const state = (min, max, cmpMin, cmpMax) => {
  if (max < cmpMin || min > cmpMax) return 0; // Separate.
  if (min >= cmpMin && max <= cmpMax) return 1; // Inside.
  let bit = 0;
  if (min < cmpMin) bit |= 2; // Extruding on min side.
  if (max > cmpMax) bit |= 4; // Extruding on max side.
  return bit;
};
// Return a new set of blocks from intersecting block with cmp.
const newBlocks = (xS, yS, zS, block, cmp) => {
  // If any states are separate, the whole block is separate.
  if ([xS, yS, zS].includes(0)) return [block];
  // Otherwise, start intersecting.
  let blocks = [];
  if (xS & 2) {
    blocks.push(Object.assign({}, block, {xMax: cmp.xMin - 1}));
    block.xMin = cmp.xMin;
  }
  if (xS & 4) {
    blocks.push(Object.assign({}, block, {xMin: cmp.xMax + 1}));
    block.xMax = cmp.xMax;
  }
  if (yS & 2) {
    blocks.push(Object.assign({}, block, {yMax: cmp.yMin - 1}));
    block.yMin = cmp.yMin;
  }
  if (yS & 4) {
    blocks.push(Object.assign({}, block, {yMin: cmp.yMax + 1}));
    block.yMax = cmp.yMax;
  }
  if (zS & 2) {
    blocks.push(Object.assign({}, block, {zMax: cmp.zMin - 1}));
    block.zMin = cmp.zMin;
  }
  if (zS & 4) {
    blocks.push(Object.assign({}, block, {zMin: cmp.zMax + 1}));
    block.zMax = cmp.zMax;
  }
  return blocks;
};
// Returns the block broken down by intersecting against the cmps.
const breakDown = (block, cmps) => {
  let blocks = [block];
  for (let cmp of cmps) {
    let next = [];
    for (let block of blocks) {
      const xS = state(block.xMin, block.xMax, cmp.xMin, cmp.xMax);
      if (xS === 0) {
        next.push(block);
        continue;
      }
      const yS = state(block.yMin, block.yMax, cmp.yMin, cmp.yMax);
      if (yS === 0) {
        next.push(block);
        continue;
      }
      const zS = state(block.zMin, block.zMax, cmp.zMin, cmp.zMax);
      if (zS === 0) {
        next.push(block);
        continue;
      }
      next.push(...newBlocks(xS, yS, zS, block, cmp));
    }
    blocks = next;
  }
  return blocks;
};

const ranges = input
  .trim()
  .split(/\n/g)
  .map((line) => {
    const parts = line.split(" ");
    const limits = [...parts[1].matchAll(/-?\d+/g)].map((m) => Number(m[0]));
    return {
      on: parts[0] === "on",
      xMin: limits[0],
      xMax: limits[1],
      yMin: limits[2],
      yMax: limits[3],
      zMin: limits[4],
      zMax: limits[5],
    };
  });

let ons = [];
for (let range of ranges) {
  if (range.on) {
    ons.push(...breakDown(range, ons));
  } else {
    let next = [];
    for (let on of ons) {
      next.push(...breakDown(on, [range]));
    }
    ons = next;
  }
}

// Part 1.
const offs = breakDown(
  {xMin: -50, xMax: 50, yMin: -50, yMax: 50, zMin: -50, zMax: 50},
  ons,
);
let sum = Math.pow(101, 3) - offs.reduce((agg, b) => {
  return agg + (b.xMax - b.xMin + 1) * (b.yMax - b.yMin + 1) * (b.zMax - b.zMin + 1);
}, 0);
console.log(sum);

// Part 2.
sum = ons.reduce((agg, b) => {
  return agg + (b.xMax - b.xMin + 1) * (b.yMax - b.yMin + 1) * (b.zMax - b.zMin + 1);
}, 0);
console.log(sum);
