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
