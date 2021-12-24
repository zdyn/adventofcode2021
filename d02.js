#!/usr/bin/env -S deno run --allow-read

// 34ms
const input = await Deno.readTextFile("d02.txt");

const cmds = input
  .trim()
  .split(/\n/g)
  .map((l) => l.split(" "));

// depth1 is equivalent to aim.
let position = 0, depth1 = 0, depth2 = 0;

for (let [cmd, n] of cmds) {
  n = Number(n);
  switch (cmd) {
    case "forward":
      position += n;
      depth2 += depth1 * n;
      break;
    case "down":
      depth1 += n;
      break;
    case "up":
      depth1 -= n;
      break;
  }
}

// Part 1.
console.log(position * depth1);

// Part 2.
console.log(position * depth2);
