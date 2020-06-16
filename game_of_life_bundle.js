(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict'

class Game {
  constructor(universe, draw, interval) {
    this.universe = universe;
    this.draw = draw;
    this.interval = interval;

    let playButton = document.getElementById('playButton');
    playButton.addEventListener('click', this.playPause.bind(this));
    this.playButton = playButton;

    document.getElementById('speedUpButton')
        .addEventListener('click', this.changeSpeed.bind(this, 0.5));
    document.getElementById('speedDownButton')
        .addEventListener('click', this.changeSpeed.bind(this, 2));
    document.getElementById('backButton').addEventListener('click', this.goBack.bind(this));
    document.getElementById('stepButton').addEventListener('click', this.update.bind(this));
  }

  update() {
    this.universe.nextGeneration();
    this.draw(this.universe);
  }

  playPause() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = undefined;
      this.playButton.innerHTML = 'Play';
    } else {
      this.intervalHandle = setInterval(this.update.bind(this), this.interval);
      this.playButton.innerHTML = 'Pause';
    }
  }

  changeSpeed(times) {
    this.interval *= times;
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = setInterval(this.update.bind(this), this.interval);
    }
  }

  goBack() {
    this.universe.goBackIfPossible();
    this.draw(this.universe);
  }
}

module.exports = Game;

},{}],3:[function(require,module,exports){
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

},{"./circular_buffer.js":1}],4:[function(require,module,exports){
'use strict'

var Universe = require('./game_of_life_universe.js');
var Game = require('./game.js');

const PIXELS_PER_CELL = 10;

const GLIDER_SE = [
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1]
];

const GLIDER_NW = [
  [1, 1, 1],
  [1, 0, 0],
  [0, 1, 0]
];

const BLOCK = [
  [1, 1],
  [1, 1]
];

const SHIP = [
  [1, 1, 0],
  [1, 0, 1],
  [0, 1, 1]
];

const R_PENTOMINO = [
  [0, 1, 1],
  [1, 1, 0],
  [0, 1, 0],
];

const EATER = [
  [1, 1, 0, 0],
  [1, 0, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 1],
];

const FACES = [
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
];

const SMTH = [
  [0, 0, 1, 1, 0],
  [0, 1, 0, 0, 1],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 1, 0, 0, 1],
  [0, 0, 1, 1, 0],
];

const SMTH_OTHER = [
  [1, 1, 1, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1],
];

const PERIOD = [
[0,0,0,0,0,],
[0,0,1,0,1,],
[0,0,0,1,0,],
[0,0,0,1,0,],
[0,0,1,0,1],
];

const FACE = [
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0]
];

const CTHULHU = [
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 0, 0, 1, 1, 1, 0, 0, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0]
];

const PULSAR_SPAWNER = [
  [1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1]
];

const PULSAR_SPAWNER2 = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
];

const OSCILLATOR_SPAWNER = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function canvasClicked(universe, draw, ev) {
  const x = Math.floor(ev.offsetX / PIXELS_PER_CELL);
  const y = Math.floor(ev.offsetY / PIXELS_PER_CELL);
  universe.toggle(y, x);
  draw(universe);
}

function draw(canvas, universe) {
  let ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < universe.n; ++i) {
    for (let j = 0; j < universe.m; ++j) {
      if (universe.get(i, j)) {
        ctx.fillRect(j * PIXELS_PER_CELL, i * PIXELS_PER_CELL,
                     PIXELS_PER_CELL, PIXELS_PER_CELL);
      }
    }
  }

  document.getElementById('generationLabel').innerText = universe.generation;
}

function loadGame() {
  let canvas = document.getElementById('canvas');
  let drawWithCanvas = draw.bind(this, canvas);

  const n = canvas.height / PIXELS_PER_CELL;
  const m = canvas.width / PIXELS_PER_CELL;
  let universe = new Universe(n, m, 50);

  universe.setPattern(28, 48, FACE);
  universe.toggle(26, 51);
  universe.toggle(26, 52);
  universe.toggle(26, 53);

  let game = new Game(universe, drawWithCanvas, 200);

  canvas.addEventListener('click', canvasClicked.bind(this, universe, drawWithCanvas));

  drawWithCanvas(universe);
}

window.addEventListener('load', loadGame);

},{"./game.js":2,"./game_of_life_universe.js":3}]},{},[2,4,1,3]);
