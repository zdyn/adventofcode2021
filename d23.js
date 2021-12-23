#!/usr/bin/env -S deno run --allow-read

// Forever.
const inputPart1 = await Deno.readTextFile("d23p1.txt");
const inputPart2 = await Deno.readTextFile("d23p2.txt");

const parseInput = (input) => {
  return input
    .trim()
    .split(/\n/g)
    .slice(2, -1)
    .map((l) => [...l.matchAll(/[ABCD]/g)].map((m) => m[0]))
    .reduce((rooms, line) => {
      line.forEach((c, i) => rooms[i].push(c));
      return rooms;
    }, [[], [], [], []]);
};

const hall = "...........".split("");
const roomsP1 = parseInput(inputPart1);
const roomsP2 = parseInput(inputPart2);

const roomFor = {}, energyFor = {};
"ABCD".split("").forEach((c, i) => {
  roomFor[c] = i;
  energyFor[c] = Math.pow(10, i);
});
const entrances = new Set([2, 4, 6, 8]);

const solve = (hall, rooms) => {
  let count = 0;

  let min = Infinity;
  const recurse = (energy, dones) => {
    if (energy >= min) return;

    if (dones.reduce((agg, d) => agg && d, true)) {
      console.log("DONE:", energy);
      min = energy;
      return;
    }

    // Hall movement to rooms.
    for (let hallIdx = 0; hallIdx < hall.length; hallIdx++) {
      const body = hall[hallIdx];
      if (body === ".") continue;

      let validPath = true;
      let targetSlotIdx = null;

      // Check slots in room.
      const room = rooms[roomFor[body]];
      // console.log(hall.join(""), hallIdx, body, roomFor[body], rooms);
      for (let slotIdx = room.length - 1; slotIdx >= 0; slotIdx--) {
        if (room[slotIdx] === "." && targetSlotIdx == null) targetSlotIdx = slotIdx;
        if (room[slotIdx] === "." || room[slotIdx] === body) continue;
        validPath = false;
        break;
      }
      if (!validPath) continue;

      // Check spaces in hallway.
      const targetHallIdx = (roomFor[body] + 1) * 2;
      let [h, step] = targetHallIdx > hallIdx ? [hallIdx + 1, 1] : [hallIdx - 1, -1];
      while (h !== targetHallIdx) {
        // Something is in the way.
        if (hall[h] !== ".") {
          validPath = false;
          break;
        }
        h += step;
      }
      if (!validPath) continue;

      // Recurse.
      hall[hallIdx] = ".";
      room[targetSlotIdx] = body;
      const add = energyFor[body] * (Math.abs(targetHallIdx - hallIdx) + targetSlotIdx + 1);
      // Mark done.
      const donesClone = dones.slice();
      if (targetSlotIdx === 0) {
        donesClone[roomFor[body]] = true;
      }
      recurse(energy + add, donesClone);
      hall[hallIdx] = body;
      room[targetSlotIdx] = ".";
    }
    // Room movement to halls.
    for (let roomIdx = 0; roomIdx < rooms.length; roomIdx++) {
      if (dones[roomIdx]) continue;

      const room = rooms[roomIdx];
      let done = true;
      for (let slotIdx = room.length - 1; slotIdx >= 0; slotIdx--) {
        const body = room[slotIdx];
        // Can't possibly be any more in this room.
        if (body === ".") break;
        if (roomFor[body] === roomIdx) {
          // In the right place already.
          if (done) continue;
        } else {
          done = false;
        }
        // Something in the way.
        if (slotIdx > 0 && room[slotIdx - 1] !== ".") continue;

        const hallIdx = (roomIdx + 1) * 2; // Hardcoded.
        for (let h = hallIdx - 1; h >= 0; h--) {
          // Can't move anymore.
          if (hall[h] !== ".") break;
          // Can't stop in an entrance.
          if (entrances.has(h)) continue;
          // Recurse.
          hall[h] = body;
          room[slotIdx] = ".";
          const add = energyFor[body] * (Math.abs(h - hallIdx) + slotIdx + 1);
          recurse(energy + add, dones.slice());
          hall[h] = ".";
          room[slotIdx] = body;
        }
        for (let h = hallIdx + 1; h < hall.length; h++) {
          // Can't move anymore.
          if (hall[h] !== ".") break;
          // Can't stop in an entrance.
          if (entrances.has(h)) continue;
          // Recurse.
          hall[h] = body;
          room[slotIdx] = ".";
          const add = energyFor[body] * (Math.abs(h - hallIdx) + slotIdx + 1);
          recurse(energy + add, dones.slice());
          hall[h] = ".";
          room[slotIdx] = body;
        }
      }
    }
  };
  recurse(0, Array(rooms.length).fill(false));
  return min;
}

console.log(solve(hall.slice(), roomsP1));
console.log(solve(hall.slice(), roomsP2));
