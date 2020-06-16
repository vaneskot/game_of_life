'use strict'

var Universe = require('./game_of_life_universe.js');
var Game = require('./game.js');

var canvas;
var ctx;
var cwidth;
var cheight;

var universe;
var game;

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

function canvasClicked(ev) {
  const x = Math.floor(ev.offsetX / PIXELS_PER_CELL);
  const y = Math.floor(ev.offsetY / PIXELS_PER_CELL);
  universe.toggle(y, x);
  draw();
}

function draw() {
  ctx.clearRect(0, 0, cwidth, cheight);

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
  canvas = document.getElementById('canvas');
  canvas.addEventListener('click', canvasClicked);
  ctx = canvas.getContext('2d');
  cwidth = canvas.width;
  cheight = canvas.height;

  const n = cheight / PIXELS_PER_CELL;
  const m = cwidth / PIXELS_PER_CELL;

  universe = new Universe(n, m, 50);
  game = new Game(universe, draw, 200);

  draw();
}

window.addEventListener('load', loadGame);
