var cols, rows; 
var s = 20;
var grid = [];

var current;

var stack = [];

function setup() {
  createCanvas(500, 500);
  //frameRate(5);
  cols = width/s;
  rows = height/s;
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  //current = grid[floor(cols*rows/2)];
  current = grid[0];
}

function draw() {
  background(100);
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();

  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0){
    current = stack.pop();
  }
}


function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols
}
