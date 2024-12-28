const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');

// Grid properties
const WIDTH = 800;
const ROWS = 50;
const CELL_SIZE = WIDTH / ROWS;

// Colors
const COLORS = {
  white: '#ffffff',
  black: '#000000',
  red: '#ff0000',
  green: '#00ff00',
  orange: '#ffa500',
  turquoise: '#40e0d0',
  purple: '#800080',
  grey: '#808080'
};

canvas.width = WIDTH;
canvas.height = WIDTH;

let grid = [];
let start = null;
let end = null;
let running = false;
let speed = 1;

// Update speed display
function updateSpeedDisplay() {
  document.getElementById('speed-value').textContent = `${speed}x`;
}

// Create the grid
function createGrid() {
  grid = [];
  for (let row = 0; row < ROWS; row++) {
    grid.push([]);
    for (let col = 0; col < ROWS; col++) {
      grid[row].push({
        row,
        col,
        color: COLORS.white,
        neighbors: [],
      });
    }
  }
}

// Draw the grid
function drawGrid() {
  ctx.clearRect(0, 0, WIDTH, WIDTH);

  // Draw cells
  for (let row of grid) {
    for (let cell of row) {
      ctx.fillStyle = cell.color;
      ctx.fillRect(cell.col * CELL_SIZE, cell.row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }

  // Draw grid lines
  ctx.strokeStyle = COLORS.grey;
  for (let i = 0; i <= ROWS; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * CELL_SIZE);
    ctx.lineTo(WIDTH, i * CELL_SIZE);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i * CELL_SIZE, 0);
    ctx.lineTo(i * CELL_SIZE, WIDTH);
    ctx.stroke();
  }
}

// Update neighbors for all cells
function updateNeighbors() {
  for (let row of grid) {
    for (let cell of row) {
      cell.neighbors = [];
      const { row: r, col: c } = cell;

      if (r > 0 && grid[r - 1][c].color !== COLORS.black) cell.neighbors.push(grid[r - 1][c]); // Up
      if (r < ROWS - 1 && grid[r + 1][c].color !== COLORS.black) cell.neighbors.push(grid[r + 1][c]); // Down
      if (c > 0 && grid[r][c - 1].color !== COLORS.black) cell.neighbors.push(grid[r][c - 1]); // Left
      if (c < ROWS - 1 && grid[r][c + 1].color !== COLORS.black) cell.neighbors.push(grid[r][c + 1]); // Right
    }
  }
}

// DFS Algorithm
async function dfs() {
  if (!start || !end) return;

  const stack = [start];
  const visited = new Set();

  while (stack.length > 0) {
    if (!running) return;

    const current = stack.pop();

    if (current === end) {
      reconstructPath(current);
      return;
    }

    visited.add(current);
    for (let neighbor of current.neighbors) {
      if (!visited.has(neighbor) && neighbor.color !== COLORS.black) {
        stack.push(neighbor);
        neighbor.parent = current;
        neighbor.color = COLORS.green;
      }
    }

    if (current !== start) current.color = COLORS.red;

    drawGrid();
    await new Promise((resolve) => setTimeout(resolve, 50 / speed)); // Animation delay
  }
}

// Reconstruct path
function reconstructPath(current) {
  while (current.parent) {
    current = current.parent;
    if (current !== start) current.color = COLORS.purple;
    drawGrid();
  }
}

// Event listeners
canvas.addEventListener('mousedown', (e) => {
  const x = Math.floor(e.offsetX / CELL_SIZE);
  const y = Math.floor(e.offsetY / CELL_SIZE);
  const cell = grid[y][x];

  if (!start && cell !== end) {
    start = cell;
    start.color = COLORS.orange;
  } else if (!end && cell !== start) {
    end = cell;
    end.color = COLORS.turquoise;
  } else if (cell !== start && cell !== end) {
    cell.color = COLORS.black;
  }

  drawGrid();
});

canvas.addEventListener('mousemove', (e) => {
  if (e.buttons === 1) {
    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    const cell = grid[y][x];
    if (cell !== start && cell !== end) cell.color = COLORS.black;
    drawGrid();
  } else if (e.buttons === 2) {
    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    const cell = grid[y][x];
    if (cell !== start && cell !== end) cell.color = COLORS.white;
    drawGrid();
  }
});

// Button handlers
document.getElementById('run-btn').addEventListener('click', () => {
  if (running) return;
  running = true;
  updateNeighbors();
  dfs();
});

document.getElementById('reset-btn').addEventListener('click', () => {
  running = false;
  start = null;
  end = null;
  createGrid();
  drawGrid();
});

document.getElementById('speed-up-btn').addEventListener('click', () => {
  if (speed < 10) {
    speed += 1;
    updateSpeedDisplay();
  }
});

document.getElementById('slow-down-btn').addEventListener('click', () => {
  if (speed > 1) {
    speed -= 1;
    updateSpeedDisplay();
  }
});

document.getElementById('back-btn').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Initialize grid and speed display
createGrid();
drawGrid();
updateSpeedDisplay();
