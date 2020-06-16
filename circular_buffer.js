'use strict'

class CircularBuffer {
  constructor(n) {
    this.buffer = new Array(n);
    this.n = n;
    this.cur = 0;
    this.size = 0;
  }

  push(x) {
    this.buffer[this.cur] = x;
    this.size = Math.min(this.size + 1, this.n);
    this.cur = (this.cur + 1) % this.n;
  }

  pop() {
    console.assert(this.size > 0);
    this.cur = (this.cur + this.n - 1) % this.n;
    this.size--;
    return this.buffer[this.cur];
  }

  isEmpty() {
    return this.size == 0;
  }
}

module.exports = CircularBuffer;
