#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d04.txt");
const parts = input.split(/\n\n/g);
const nums = parts[0].split(",").map(Number);
const boards = parts
  .slice(1)
  .map((p) => {
    const board = {
      filled: Array(10).fill(0),
      nums: new Map(),
      done: false,
    };
    p.split(/\n/g).map((line, r) => {
      line
        .split(/\s+/g)
        .filter((s) => s)
        .forEach((n, c) => board.nums.set(Number(n), [r, 5 + c]));
    });
    return board;
  });
let done = 0;
for (let num of nums) {
  for (let board of boards) {
    if (board.done) continue;
    board.nums.get(num)?.forEach((i) => board.filled[i]++);
    board.nums.delete(num);
    if (board.filled.some((f) => f === 5)) {
      board.done = true;
      done++;
      if (done === 1 || done === boards.length) {
        console.log(num * [...board.nums.keys()].reduce((agg, n) => agg + n, 0));
      }
    }
  }
  if (done === boards.length) break;
}
