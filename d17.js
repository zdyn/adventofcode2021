#!/usr/bin/env -S deno run --allow-read

const sign = (n) => n / Math.abs(n) || 0;

const input = await Deno.readTextFile("d17.txt");
const re = /=([^.]+)\.\.([^,]+)/g;
const [xLow, xHigh] = re.exec(input).slice(1).map(Number);
const [yLow, yHigh] = re.exec(input).slice(1).map(Number);

let globalMaxY = 0;
let count = 0;

for (let i = 0; i <= xHigh; i++) {
  for (let j = yLow; j < 1000; j++) {
    let xVel = i;
    let yVel = j;
    let maxY = 0;
    let xPos = 0;
    let yPos = 0;
    while (xPos <= xHigh && yPos >= yLow) {
      xPos += xVel;
      yPos += yVel;
      if (yPos > maxY) maxY = yPos;
      if (xPos >= xLow && xPos <= xHigh && yPos >= yLow && yPos <= yHigh) {
        if (maxY > globalMaxY) globalMaxY = maxY;
        count++;
        break;
      }
      xVel += (xVel / xVel * -1) || 0;
      yVel--;
    }
  }
}

console.log(globalMaxY);
console.log(count);
