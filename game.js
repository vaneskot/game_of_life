'use strict'

class Game {
  constructor(universe, draw, interval) {
    this.universe = universe;
    this.draw = draw;
    this.originalInterval = interval;
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

  redraw() {
    this.draw(this.universe.getInstance());
  }

  update() {
    this.universe.getInstance().nextGeneration();
    this.redraw();
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
    this.universe.getInstance().goBackIfPossible();
    this.redraw();
  }

  reset() {
    this.universe.getInstance().reset();
    clearInterval(this.intervalHandle);
    this.intervalHandle = undefined;
    this.playButton.innerHTML = 'Play';
    this.interval = this.originalInterval;
    this.redraw();
  }
}

let instance = null;

module.exports = {
  createInstance: function(universe, draw, interval) {
    instance = new Game(universe, draw, interval);
    return instance;
  },
  getInstance: function() {
    return instance;
  }
};
