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
