const input = await Deno.readTextFile("d02.txt");
let pos = 0, dep1 = 0, dep2 = 0;
for (let [cmd, n] of input.split("\n").map((l) => l.split(" "))) {
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
