'use strict'

var CircularBuffer = require('./circular_buffer.js')

function createArray2D(n, m) {
  let a = new Array(n);
  for (let i = 0; i < n; ++i) {
    a[i] = new Array(m).fill(0);
  }
  return a;
}

function copyArray2D(a) {
  let newA = new Array(a.length);
  for (let i = 0; i < newA.length; ++i) {
    newA[i] = a[i].slice();
  }
  return newA;
}

class Universe {
  constructor(n, m, keepLastN) {
    this.n = n;
    this.m = m;
    this.storage = keepLastN && keepLastN > 0 ? new CircularBuffer(keepLastN) : undefined;
    // There is an element in front of every row and after every row
    // to simplify computation.
    this.universe = createArray2D(n, m + 2);
    this.emptyLine = new Array(m + 2).fill(0);
    this.generation = 0;
  }

  setPattern(i, j, pattern) {
    const pN = pattern.length;
    const pM = pattern[0].length;

    // Account for the additional element.
    j += 1;

    for (let a = 0; a < pN; ++a) {
      for (let b = 0; b < pM; ++b) {
        this.universe[i + a][j + b] = pattern[a][b];
      }
    }
  }

  get(i, j) {
    if (i < 0 || i >= this.n || j < 0 || j >= this.m)
      return 0;

    // Account for the additional element.
    j += 1;
    return this.universe[i][j];
  }

  toggle(i, j) {
    if (i < 0 || i >= this.n || j < 0 || j >= this.m)
      return;

    j += 1;
    this.universe[i][j] ^= 1;
  }

  nextGeneration() {
    if (this.storage) {
      this.storage.push(copyArray2D(this.universe));
    }
    let curLineCopy = this.emptyLine;
    for (let i = 0; i < this.n; ++i) {
      const prevLine = curLineCopy;
      let curLine = this.universe[i];
      curLineCopy = curLine.slice();
      const nextLine = i < this.n - 1 ? this.universe[i + 1] : this.emptyLine;
      for (let j = 1; j <= this.m; ++j) {
        const neighbours = prevLine[j - 1] + prevLine[j] + prevLine[j + 1]
            + curLineCopy[j - 1] + curLineCopy[j + 1]
            + nextLine[j - 1] + nextLine[j] + nextLine[j + 1];
        curLine[j] = (neighbours == 3 || (neighbours == 2 && curLine[j]));
      }
    }
    this.generation++;
  }

  goBackIfPossible() {
    if (!this.storage || this.storage.isEmpty())
      return;
    this.universe = this.storage.pop();
    this.generation--;
  }
}

module.exports = Universe;
