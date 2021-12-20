#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d20.txt");

const neighbors = (i, j) => {
  return [
    [i - 1, j - 1],
    [i - 1, j],
    [i - 1, j + 1],
    [i, j - 1],
    [i, j],
    [i, j + 1],
    [i + 1, j - 1],
    [i + 1, j],
    [i + 1, j + 1],
  ];
};
const outputPixel = (mat, algo, i, j) => {
  return algo[parseInt(
    neighbors(i, j)
      .map(([x, y]) => mat[x][y])
      .map((c) => Number(c === "#"))
      .join(""),
    2,
  )];
}
const lit = (img) => [].concat.apply([], img).filter((c) => c === "#").length;
const prep = (img, iterations) => {
  const output = img.map((l) => l.slice());
  const pad = new Array(iterations * 2).fill(".");
  for (let i = 0; i < output.length; i++) {
    output[i].unshift(...pad);
    output[i].push(...pad);
  }
  for (let i = 0; i < iterations * 2; i++) {
    output.unshift(new Array(output[0].length).fill("."));
    output.push(new Array(output[0].length).fill("."));
  }
  return output;
};
const enhance = (img, algo) => {
  const output = img.slice(1, -1).map(() => new Array(img[0].length - 2));
  for (let i = 1; i < img.length - 1; i++) {
    for (let j = 1; j < img[i].length - 1; j++) {
      output[i - 1][j - 1] = outputPixel(img, algo, i, j);
    }
  }
  return output;
};

const parts = input.trim().split(/\n\n/g);
const algo = parts[0].trim().split("");
const img = parts[1].trim().split(/\n/g).map((s) => s.split(""));

for (let count of [2, 50]) {
  let output = prep(img, count);
  for (let i = 0; i < count; i++) {
    output = enhance(output, algo);
  }
  console.log(lit(output));
}
