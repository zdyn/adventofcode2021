#!/usr/bin/env -S deno run --allow-read

const input = await Deno.readTextFile("d16.txt");
const bits = input
  .trim()
  .split("")
  .map((c) => parseInt(c, 16).toString(2).padStart(4, "0"))
  .join("");

class Packet {
  constructor(bits) {
    this.bits = bits;
    this.subPackets = [];
    this.valueBits = "";

    let i = 0;
    this.version = parseInt(bits.slice(i, i + 3), 2);
    this.type = parseInt(bits.slice(i + 3, i + 6), 2);
    i += 6;
    if (this.type === 4) {
      while (true) {
        this.valueBits += bits.slice(i + 1, i + 5);
        i += 5;
        if (bits[i - 5] === "0") break;
      }
    } else {
      if (bits[i] === "0") {
        const target = i + 16 + parseInt(bits.slice(i + 1, i + 16), 2);
        i += 16;
        while (i < target) {
          const p = new Packet(bits.slice(i));
          i += p.bits.length;
          this.subPackets.push(p);
        }
      } else {
        const remaining = parseInt(bits.slice(i + 1, i + 12), 2);
        i += 12;
        while (this.subPackets.length < remaining) {
          const p = new Packet(bits.slice(i));
          i += p.bits.length;
          this.subPackets.push(p);
        }
      }
    }
    this.bits = this.bits.slice(0, i);
  }

  versionSum() {
    return this.version + this.subPackets.reduce((agg, p) => agg + p.versionSum(), 0);
  }

  value() {
    switch (this.type) {
      case 0: return this.subPackets.reduce((agg, n) => agg + n.value(), 0);
      case 1: return this.subPackets.reduce((agg, n) => agg * n.value(), 1);
      case 2: return Math.min.apply(null, this.subPackets.map((n) => n.value()));
      case 3: return Math.max.apply(null, this.subPackets.map((n) => n.value()));
      case 4: return parseInt(this.valueBits, 2);
      case 5: return this.subPackets[0].value() > this.subPackets[1].value() ? 1 : 0;
      case 6: return this.subPackets[0].value() < this.subPackets[1].value() ? 1 : 0;
      case 7: return this.subPackets[0].value() === this.subPackets[1].value() ? 1 : 0;
    }
  }
}

const p = new Packet(bits);
console.log(p.versionSum());
console.log(p.value());
