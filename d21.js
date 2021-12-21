#!/usr/bin/env -S deno run --allow-read

// 16.465s
const input = await Deno.readTextFile("d21.txt");

const track = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const counts = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];
const positions = input
  .trim()
  .split(/\n/g)
  .map((s) => Number(/\d+$/.exec(s)[0]));

// Part 1.
const players = [
  {pos: ((positions[0] - 1) + 10) % 10, score: 0},
  {pos: ((positions[1] - 1) + 10) % 10, score: 0},
];
let die = 0;
while (players[0].score < 1000 && players[1].score < 1000) {
  const player = players[die % 2];
  const sum = die * 3 + 6;
  player.pos = (player.pos + sum) % 10;
  player.score += track[player.pos];
  die += 3;
}
console.log(Math.min(...players.map((p) => p.score)) * die);

// Part 2.
const wins = [0, 0];
let worlds = [
  {
    turn: 0,
    times: 1,
    players: [
      {pos: ((positions[0] - 1) + 10) % 10, score: 0},
      {pos: ((positions[1] - 1) + 10) % 10, score: 0},
    ],
  },
];
while (worlds.length > 0) {
  let next = [];
  for (let world of worlds) {
    for (let [sum, times] of counts) {
      const nextWorld = {
        turn: (world.turn + 1) % 2,
        times: world.times * times,
        // Deep copy.
        players: world.players.map((p) => Object.assign({}, p)),
      };
      const player = nextWorld.players[world.turn];
      player.pos = (player.pos + sum) % 10;
      player.score += track[player.pos];
      if (player.score >= 21) {
        wins[world.turn] += nextWorld.times;
      } else {
        next.push(nextWorld);
      }
    }
  }
  worlds = next;
}
console.log(Math.max(...wins));
