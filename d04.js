#!/usr/bin/env -S deno run --allow-read

// 41ms
const input = await Deno.readTextFile("d04.txt");

const parts = input
  .trim()
  .split(/\n\n/g);
const nums = parts[0].split(",").map(Number);
const boards = parts
  .slice(1)
  .map((part) => {
    const board = {
      // First 5 reference rows, second 5 reference columns.
      filled: Array(10).fill(0),
      // Map of nums to [row, column] index tuple into filled.
      nums: new Map(),
      done: false,
    };
    part.split(/\n/g).forEach((line, rowIdx) => {
      line.trim().split(/\s+/g).forEach((num, colIdx) => {
        board.nums.set(Number(num), [rowIdx, 5 + colIdx]);
      });
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
      // Part 1: done === 1
      // Part 2: done === boards.length
      if (done === 1 || done === boards.length) {
        console.log(
          num *
          [...board.nums.keys()].reduce((agg, n) => agg + n, 0),
        );
      }
    }
  }
  if (done === boards.length) break;
}
