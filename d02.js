const input = await Deno.readTextFile("d02.txt");
const cmds = input.split("\n").map((l) => {
  const p = l.split(" ");
  return {cmd: p[0], n: Number(p[1])};
});
let pos = 0, dep1 = 0, dep2 = 0;
for (let {cmd, n} of cmds) {
  switch (cmd) {
    case "forward":
      pos += n;
      dep2 += dep1 * n;
      break;
    case "down":
      dep1 += n;
      break
    case "up":
      dep1 -= n;
      break;
  }
}
console.log(pos * dep1);
console.log(pos * dep2);
