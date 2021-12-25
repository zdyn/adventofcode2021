#!/usr/bin/env -S deno run --allow-read

// 155ms
const input = await Deno.readTextFile("d25.txt");

let floor = input
  .trim()
  .split(/\n/g)
  .map((line) => line.split(""));
const height = floor.length;
const width = floor[0].length;
let moves = Infinity;
let step = 0;

while (moves !== 0) {
  moves = 0;

  let clone = floor.map((row) => row.slice());
  for (let i = 0; i < floor.length; i++) {
    for (let j = 0; j < floor[i].length; j++) {
      if (floor[i][j] !== ">") continue;

      const j2 = (j + 1) % width;
      if (floor[i][j2] !== ".") continue;

      moves++;
      clone[i][j] = ".";
      clone[i][j2] = ">";
    }
  }
  floor = clone;

  clone = floor.map((row) => row.slice());
  for (let i = 0; i < floor.length; i++) {
    for (let j = 0; j < floor[i].length; j++) {
      if (floor[i][j] !== "v") continue;

      const i2 = (i + 1) % height;
      if (floor[i2][j] !== ".") continue;

      moves++;
      clone[i][j] = ".";
      clone[i2][j] = "v";
    }
  }
  floor = clone;

  step++;
}

console.log(step);
