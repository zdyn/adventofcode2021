#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d10.txt")
const lines = input.trim().split(/\n/g).map((l) => l.split(""));
const starts = "([{<".split("");
const ends = ")]}>".split("");
const startIndices = starts.reduce((agg, c, i) => agg.set(c, i), new Map());
const endIndices = ends.reduce((agg, c, i) => agg.set(c, i), new Map());
const vals = [3, 57, 1197, 25137];
const errors = [0, 0, 0, 0];
const scores = [];
for (let line of lines) {
  let chars = [];
  for (let c of line) {
    if (startIndices.has(c)) {
      chars.push(c);
      continue;
    }
    if (c !== ends[startIndices.get(chars[chars.length - 1])]) {
      errors[endIndices.get(c)]++;
      chars = [];
      break;
    }
    chars.pop();
  }
  if (!chars.length) continue;
  const score = chars
    .reverse()
    .map((c) => startIndices.get(c) + 1)
    .reduce((agg, n) => agg * 5 + n, 0);
  scores.push(score);
}
console.log(errors.map((c, i) => c * vals[i]).reduce((agg, n) => agg + n, 0));
console.log(scores.sort((a, b) => a - b)[~~(scores.length / 2)]);
