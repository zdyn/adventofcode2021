#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d16.txt");
const bits = input
  .trim()
  .split("")
  .map((c) => ("0000" + parseInt(c, 16).toString(2)).slice(-4))
  .join("");

const parse = () => {
  versionSum += parseInt(bits.slice(i, i + 3), 2);
  const type = parseInt(bits.slice(i + 3, i + 6), 2);
  i += 6;

  // Logical.
  if (type === 4) {
    let groups = [];
    while (true) {
      groups.push(bits.slice(i + 1, i + 5));
      i += 5;
      if (bits[i - 5] === "0") break;
    }
    return parseInt(groups.join(""), 2);
  }

  // Operator.
  const vals = [];
  if (bits[i] === "0") {
    const target = i + 16 + parseInt(bits.slice(i + 1, i + 16), 2);
    i += 16;
    while (i < target) {
      vals.push(parse());
    }
  } else {
    let remaining = parseInt(bits.slice(i + 1, i + 12), 2);
    i += 12;
    while (remaining > 0) {
      vals.push(parse());
      remaining--;
    }
  }
  switch (type) {
    case 0: return vals.reduce((agg, n) => agg + n, 0);
    case 1: return vals.reduce((agg, n) => agg * n, 1);
    case 2: return Math.min.apply(null, vals);
    case 3: return Math.max.apply(null, vals);
    case 5: return vals[0] > vals[1] ? 1 : 0;
    case 6: return vals[0] < vals[1] ? 1 : 0;
    case 7: return vals[0] === vals[1] ? 1 : 0;
  }
};

// Index pointer into bits.
let i = 0;
let versionSum = 0;
const outer = parse();
console.log(versionSum);
console.log(outer);
