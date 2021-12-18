#!/usr/bin/env -S deno run --allow-read

const nums = new Set("0123456789".split(""));
const numRE = /[0-9]+/;
const lastNumRE = /[0-9]+$/;
const pairRE = /\[(\d+),(\d+)\]/;
const splitRE = /[0-9]{2,}/;

const reduce = (fish) => {
  let changed = true;
  while (changed) {
    changed = false;
    // Check for explosion.
    let leftBrackets = 0;
    for (let i = 0; i < fish.length; i++) {
      if (fish[i] === "[") leftBrackets++;
      if (fish[i] === "]") leftBrackets--;
      if (leftBrackets < 5 || !nums.has(fish[i + 1])) continue;

      changed = true;
      const pair = pairRE.exec(fish.slice(i));
      const [left, right] = pair.slice(1).map(Number);
      fish = fish.slice(0, i) + "0" + fish.slice(i + pair[0].length);
      let leftIdx = i - 1, rightIdx = i + 1;
      while (rightIdx < fish.length) {
        if (nums.has(fish[rightIdx])) {
          const num = numRE.exec(fish.slice(rightIdx))[0];
          fish =
            fish.slice(0, rightIdx) +
            (Number(num) + right) +
            fish.slice(rightIdx + num.length);
          break;
        }
        rightIdx++;
      }
      while (leftIdx >= 0) {
        if (nums.has(fish[leftIdx])) {
          const num = lastNumRE.exec(fish.slice(0, leftIdx + 1))[0];
          fish =
            fish.slice(0, leftIdx - num.length + 1) +
            (Number(num) + left) +
            fish.slice(leftIdx + 1);
          break;
        }
        leftIdx--;
      }
      break;
    }
    if (changed) continue;
    // Check for split.
    const split = splitRE.exec(fish);
    if (split != null) {
      changed = true;
      const num = Number(split[0]);
      fish = fish.replace(split[0], `[${Math.floor(num / 2)},${Math.ceil(num / 2)}]`);
    }
  }
  return fish;
};

const magnitude = (fish) => {
  let changed = true;
  while (changed) {
    changed = false;
    const pair = pairRE.exec(fish);
    if (pair != null) {
      changed = true;
      const [left, right] = pair.slice(1).map(Number);
      fish = fish.replace(pair[0], left * 3 + right * 2);
    }
  }
  return Number(fish);
};

const input = await Deno.readTextFile("d18.txt");
let fishes = input.trim().split(/\n/g);
let fish = fishes.shift();
while (fishes.length > 0) {
  fish = `[${fish},${fishes.shift()}]`;
  fish = reduce(fish);
}
console.log(magnitude(fish));

fishes = input.trim().split(/\n/g);
let max = 0;
for (let i = 0; i < fishes.length - 1; i++) {
  for (let j = i + 1; j < fishes.length; j++){
    max = Math.max(
      max,
      magnitude(reduce(`[${fishes[i]},${fishes[j]}]`)),
      magnitude(reduce(`[${fishes[j]},${fishes[i]}]`)),
    );
  }
}
console.log(max);
