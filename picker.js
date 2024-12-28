const patternData = require('./patterns.json')
var Universe = require('./game_of_life_universe.js');
var Game = require('./game.js');

const patternList = document.getElementById("pattern-list");
const preview = document.getElementById("preview");
const searchInput = document.getElementById("search");
let currentPattern = null;

function renderPatternList() {
  patternList.innerHTML = ""; // Clear the list

  for (const filename in patternData) {
    const pattern = patternData[filename];
    const listItem = document.createElement("li");
    listItem.textContent = pattern.name;
    listItem.dataset.filename = filename; // Store filename for later use

    listItem.addEventListener("click", () => {
      renderPreview(pattern);
    });

    patternList.appendChild(listItem);
  }
}

function renderPreview(pattern) {
  preview.innerHTML = "";
  let max_length = 0;
  for (const row in pattern.pattern) {
    max_length = Math.max(max_length, pattern.pattern[row].length);
  }

  const patternGrid = document.createElement("div");
  patternGrid.style.display = "grid";
  patternGrid.style.gridTemplateColumns = `repeat(${max_length}, 15px)`;
  patternGrid.style.gridTemplateRows = `repeat(${pattern.pattern.length}, 15px)`;

  for (let row = 0; row < pattern.pattern.length; row++) {
    for (let col = 0; col < pattern.pattern[row].length; col++) {
      const cell = document.createElement("div");
      cell.style.width = "15px";
      cell.style.height = "15px";
      cell.style.backgroundColor = pattern.pattern[row][col] === 1 ? "black" : "white";
      cell.style.border = "1px solid #ccc";
      patternGrid.appendChild(cell);
    }
    for (let col = pattern.pattern[row].length; col < max_length; col++) {
      const cell = document.createElement("div");
      cell.style.width = "15px";
      cell.style.height = "15px";
      cell.style.backgroundColor = "white";
      cell.style.border = "1px solid #ccc";
      patternGrid.appendChild(cell);
    }
  }

  preview.appendChild(patternGrid);
  currentPattern = pattern;
}

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredPatterns = Object.entries(patternData).filter(([filename, pattern]) => {
    return pattern.name.toLowerCase().includes(searchTerm);
  });

  patternList.innerHTML = "";
  for (const [filename, pattern] of filteredPatterns) {
    const listItem = document.createElement("li");
    listItem.textContent = pattern.name;
    listItem.dataset.filename = filename;

    listItem.addEventListener("click", () => {
      renderPreview(pattern);
    });

    patternList.appendChild(listItem);
  }
});

renderPatternList();

// Modal Logic
const modal = document.getElementById("patternModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementsByClassName("close")[0];
const confirmBtn = document.getElementById("confirmButton");

openModalBtn.onclick = function() {
  modal.style.display = "block";
}

closeModalBtn.onclick = function() {
  modal.style.display = "none";
}

confirmBtn.onclick = function() {
  if (currentPattern) {
    Game.getInstance().reset();
    Universe.getInstance().setCenteredPattern(currentPattern.pattern);
    modal.style.display = "none";
    Game.getInstance().redraw();
  }
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
