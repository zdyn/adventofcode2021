#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d19.txt");

const key = ([x, y, z]) => `${x},${y},${z}`;
const coords = (key) => key.split(",").map(Number);
const orientation = ([x, y, z], i) => {
  return [
    [x, y, z],
    [-x, y, -z],
    [z, y, -x],
    [-z, y, x],
    [x, -y, -z],
    [-x, -y, z],
    [-z, -y, -x],
    [z, -y, x],
    [-x, z, y],
    [x, z, -y],
    [y, z, x],
    [-y, z, -x],
    [-x, -z, -y],
    [x, -z, y],
    [-y, -z, x],
    [y, -z, -x],
    [y, x, -z],
    [-y, x, z],
    [-z, x, -y],
    [z, x, y],
    [y, -x, z],
    [-y, -x, -z],
    [z, -x, -y],
    [-z, -x, y],
  ][i];
}
const translation = (beacons1, beacons2) => {
  const b1Keys = new Set(beacons1.map(key));
  for (let b1 of beacons1) {
    for (let b2 of beacons2) {
      const xD = b1[0] - b2[0];
      const yD = b1[1] - b2[1];
      const zD = b1[2] - b2[2];
      let count = 0;
      for (let bComp of beacons2) {
        const b2Key = key([bComp[0] + xD, bComp[1] + yD, bComp[2] + zD]);
        if (b1Keys.has(b2Key)) count++;
        if (count >= 12) break;
      }
      if (count >= 12) return [xD, yD, zD];
    }
  }
};
const distance = ([x1, y1, z1], [x2, y2, z2]) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
};

const scanners = input
  .trim()
  .split(/\n\n/g)
  .map((text) => {
    return text
      .trim()
      .split(/\n/g)
      .slice(1)
      .map(coords);
  });

const scannerInfo = new Map();
scannerInfo.set(0, {orientation: 0, translation: [0, 0, 0]});
let queue = [0];
while (queue.length > 0) {
  console.log(queue);
  let next = [];
  for (let idx of queue) {
    for (let i = 0; i < scanners.length; i++) {
      if (scannerInfo.has(i)) continue;
      for (let j = 0; j < 24; j++) {
        const tmp = scanners[i].map((coord) => orientation(coord, j));
        const tr = translation(scanners[idx], tmp);
        if (tr == null) continue;
        scannerInfo.set(i, {orientation: j, translation: tr});
        scanners[i] = tmp.map(([x, y, z]) => [x + tr[0], y + tr[1], z + tr[2]]);
        next.push(i);
        break;
      }
    }
  }
  queue = next;
}

// Part 1.
const coordSet = new Set(
  scanners.reduce((agg, sc) => [...agg, ...sc.map(key)], [])
);
console.log(coordSet.size);

// Part 2.
let maxDistance = 0;
for (let i = 0; i < scanners.length - 1; i++) {
  for (let j = i + 1; j < scanners.length; j++) {
    maxDistance = Math.max(
      maxDistance,
      distance(scannerInfo.get(i).translation, scannerInfo.get(j).translation),
    );
  }
}
console.log(maxDistance);
