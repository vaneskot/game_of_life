'use strict'

var Universe = require('./game_of_life_universe.js')

var canvas;
var ctx;
var cwidth;
var cheight;

var universe;
var n;
var m;

var intervalHandle;
var interval = 100;

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


function update() {
  universe.nextGeneration();
  draw();
}

function playPause(button) {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = undefined;
    button.innerHTML = 'Play';
  } else {
    intervalHandle = setInterval(update, interval);
    button.innerHTML = 'Pause';
  }
}

function changeSpeed(times) {
  interval *= times;
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = setInterval(update, interval);
  }
}

function goBack() {
  universe.goBackIfPossible();
  draw();
}

function canvasClicked(ev) {
  const x = Math.floor(ev.offsetX / PIXELS_PER_CELL);
  const y = Math.floor(ev.offsetY / PIXELS_PER_CELL);
  universe.toggle(y, x);
  draw();
}


function loadGame() {
  let playButton = document.getElementById('playButton');
  playButton.addEventListener('click', playPause.bind(this, playButton));

  document.getElementById('speedUpButton')
      .addEventListener('click', changeSpeed.bind(this, 0.5));
  document.getElementById('speedDownButton')
      .addEventListener('click', changeSpeed.bind(this, 2));
  document.getElementById('backButton').addEventListener('click', goBack);
  document.getElementById('stepButton').addEventListener('click', update);

  canvas = document.getElementById('canvas');
  canvas.addEventListener('click', canvasClicked);
  ctx = canvas.getContext('2d');
  cwidth = canvas.width;
  cheight = canvas.height;

  n = cheight / PIXELS_PER_CELL;
  m = cwidth / PIXELS_PER_CELL;

  universe = new Universe(n, m, 50);

  draw();
}

function draw() {
  ctx.clearRect(0, 0, cwidth, cheight);

  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < m; ++j) {
      if (universe.get(i, j)) {
        ctx.fillRect(j * PIXELS_PER_CELL, i * PIXELS_PER_CELL,
                     PIXELS_PER_CELL, PIXELS_PER_CELL);
      }
    }
  }

  document.getElementById('generationLabel').innerText = universe.generation;
}

window.addEventListener('load', loadGame);
