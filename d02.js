#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d02.txt");
const cmds = input
  .trim()
  .split(/\n/g)
  .map((l) => l.split(" "));
let pos = 0, dep1 = 0, dep2 = 0;
for (let [cmd, n] of cmds) {
  n = Number(n);
  switch (cmd) {
    case "forward":
      pos += n;
      dep2 += dep1 * n;
      break;
    case "down":
      dep1 += n;
      break;
    case "up":
      dep1 -= n;
      break;
  }
}
console.log(pos * dep1);
console.log(pos * dep2);
