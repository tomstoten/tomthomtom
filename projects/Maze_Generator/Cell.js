function Cell(i, j) {
  this.i = i;
  this.j = j;
             // top, right, bottom, left
  this.walls = [true, true, true, true];
  this.visited = false;


  this.highlight = function() {
    var x = this.i*s;
    var y = this.j*s;
    noStroke();
    fill(255, 0, 200, 100);
    rect(x, y, s, s);
  }


  this.checkNeighbors = function() {
    var neighbors = [];
    var top = grid[index(i, j-1)];
    var right = grid[index(i+1, j)];
    var bottom = grid[index(i, j+1)];
    var left = grid[index(i-1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = random(neighbors);
      return r;
    } else {
      return undefined;
    }
  }


  this.show = function() {
    var x = this.i*s;
    var y = this.j*s;
    stroke(255);
    if (this.walls[0])
      line(x, y, x + s, y);
    if (this.walls[1])
      line(x + s, y, x + s, y + s);
    if (this.walls[2])
      line(x + s, y + s, x, y + s);
    if (this.walls[3])
      line(x, y + s, x, y);

    if (this.visited) {
      noStroke();
      fill(255, 0, 255, 100);
      rect(x, y, s, s);
    }
  }
}



function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x == 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x == -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y == 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y == -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}
