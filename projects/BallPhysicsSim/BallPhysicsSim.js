var simPaused = true;
var playButton = new Clickable();
var mouseHovering = false;

var ground;
var rWall;
var lWall;
var queuedSurfaces = [];
var surfaces = [];

var balls = [];

var sectorRowCount;
var sectorSize;
var sectors = [];
var loadedSectors = [];

function setup() {
  //frameRate(1);
  createCanvas(1000,700);
  background(50);
  playButton.width = 50;
  playButton.height = 30;
  playButton.locate(width - playButton.width - 6, 4);
  playButton.strokeWeight = 1.5;
  playButton.color = "#33FF33";
  playButton.cornerRadius = 0;
  playButton.text = "Start";
  playButton.textColor = "#000000";
  
  initSurfaces();
  
  
  const nBalls = 3;

  for(var i = 0; i < nBalls; i++){
    var radius = random(15, 30);
    var startX = random(radius, width - radius);
    var startY = random(0, height/2);
    var startXV = random(-10, 10);
    var startYV = random(-5, 5);
    var b = new ball(radius, startX, startY, startXV, startYV);
    balls.push(b);
  }
  
  sectorRowCount = 4;
  sectorSize = width/sectorRowCount;
  for(var j = 0; j < pow(sectorRowCount,2); j++){
    sectors.push(new Sector(sectorSize, j));
  }
  
  ground.show();
  rWall.show();
  lWall.show();
  simulate();
}

function draw() {
  if(!simPaused){
    background(50);
  }
  for(var s = 0; s < surfaces.length; s++){
    surfaces[s].show();
  }
  playButton.draw();
  
  
  playButton.onHover = function(){
    mouseHovering = true;
    this.stroke = "#FFFFFF";
  };
  playButton.onOutside = function(){
    mouseHovering = false;
    this.stroke = "#000000";
  };
  
  playButton.onRelease = function(){
    if(playButton.text == "Start"){
      playButton.text = "Stop";
      playButton.textColor = "#FFFFFF";
      playButton.color = "#FF3333";
    }
    else { 
      playButton.text = "Start";
      playButton.textColor = "#000000";
      playButton.color = "#03FF03";
    }
    simPaused = !simPaused;
  };
  
  if(!simPaused) {
    simulate();
  }
}

function simulate(){
  //find loaded sectors for each ball
  for(var i = 0; i < balls.length; i++){
    var b = balls[i];
    b.update(surfaces);
    b.drawPath();
    b.show();
    
    var xcomp1 = floor((b.x - b.radius)/sectorSize);
    if(xcomp1 < 0){
      xcomp1 = 0;
    }
    var xcomp2 = floor((b.x + b.radius)/sectorSize);
    if(xcomp2 > sectorRowCount-1){
      xcomp2 = sectorRowCount-1;
    }
    var ycomp1 = floor((b.y - b.radius)/sectorSize);
    if(ycomp1 < 0){
      ycomp1 = 0;
    }
    var ycomp2 = floor((b.y + b.radius)/sectorSize);
    if(ycomp2 > sectorRowCount-1){
      ycomp2 = sectorRowCount-1;
    }
    
    var firstSectorNum = xcomp1 + ycomp1*sectorRowCount;
    if(firstSectorNum > pow(sectorRowCount,2) - 1 || firstSectorNum < 0){
      firstSectorNum = 0;
    }
    if(!loadedSectors.includes(sectors[firstSectorNum])){
      loadedSectors.push(sectors[firstSectorNum]);
    }
    
    
    var secondSectorNum = xcomp1 + ycomp2*sectorRowCount;
    if(secondSectorNum != firstSectorNum){
      if(secondSectorNum > pow(sectorRowCount,2) - 1 || secondSectorNum < 0){
        secondSectorNum = 0;
      }
      if(!loadedSectors.includes(sectors[secondSectorNum])) {
        loadedSectors.push(sectors[secondSectorNum]);
      }
    }
    
    var thirdSectorNum = xcomp2 + ycomp2*sectorRowCount;
    if(thirdSectorNum != firstSectorNum && thirdSectorNum != secondSectorNum){
      if(thirdSectorNum > pow(sectorRowCount,2) - 1 || thirdSectorNum < 0){
        thirdSectorNum = 0;
      }
      if(!loadedSectors.includes(sectors[thirdSectorNum])) {
        loadedSectors.push(sectors[thirdSectorNum]);
      }
    }
    
    var fourthSectorNum = xcomp2 + ycomp1*sectorRowCount;
    if(fourthSectorNum != firstSectorNum && fourthSectorNum != thirdSectorNum){
      if(fourthSectorNum > pow(sectorRowCount,2) - 1 || fourthSectorNum < 0){
        fourthSectorNum = 0;
      }
      if(!loadedSectors.includes(sectors[fourthSectorNum])) {
        loadedSectors.push(sectors[fourthSectorNum]);
      }
    }
    
    for(var j = 0; j < loadedSectors.length; j++){
      loadedSectors[j].addBall(b);
    }
  }
  
  //check for other balls in each loaded sector
  for(var jj = 0; jj < loadedSectors.length; jj++){
    var sect = loadedSectors[jj];
    var k = sect.balls.length;
    if(k > 1){
      //check for ball-on-ball collision
      for(var a = 0; a < k; a++){
        for(var bb = a+1; bb < k; bb++){
          var ball1 = sect.balls[a];
          var ball2 = sect.balls[bb];
          var overlap = ball1.radius + ball2.radius - dist(ball1.x, ball1.y, ball2.x, ball2.y);
          if(overlap >= 0){
            elasticCollide2D(ball1, ball2, overlap);
          }
        }
      }
    }
    
  //unload all sectors
    sect.show();
    sect.reset();
  }
  loadedSectors = [];
}

function elasticCollide2D(ball1, ball2, overlap){
  var bv1 = ball1.velocity.copy();
  var bv2 = ball2.velocity.copy();
  var v1 = mag(bv1.x, bv1.y);
  var v2 = mag(bv2.x, bv2.y);
  var m1 = pow(ball1.radius, 2)/200;
  var m2 = pow(ball2.radius, 2)/200;
  var theta1 = -1 * ball1.velocity.heading();
  var theta2 = -1 * ball2.velocity.heading();
  var d1 = createVector(ball2.x - ball1.x, ball2.y - ball1.y).normalize().mult(overlap*0.6);
  var phi1 = -1 * d1.heading();
  stroke(255, 50);
  line(ball1.x, ball1.y, ball1.x + d1.x, ball1.y + d1.y);
  var d2 = createVector(ball1.x - ball2.x, ball1.y - ball2.y).normalize().mult(overlap*0.6);
  var phi2 = -1 * d2.heading();
  
  ball1.x -= d1.x;
  ball1.y -= d1.y;
  ball2.x -= d2.x;
  ball2.y -= d2.y;
  
  var coeff1 = (v1*cos(theta1-phi1)*(m1-m2) + 2*m2*v2*cos(theta2-phi1))/(m1+m2);
  var coeff2 = (v2*cos(theta2-phi2)*(m2-m1) + 2*m1*v1*cos(theta1-phi2))/(m2+m1);
  ball1.velocity.x = coeff1*cos(phi1) + v1*sin(theta1-phi1)*cos(phi1+HALF_PI);
  ball1.velocity.y = coeff1*sin(phi1) + v1*sin(theta1-phi1)*cos(phi1+HALF_PI);
  ball2.velocity.x = coeff2*cos(phi2) + v2*sin(theta2-phi2)*cos(phi2+HALF_PI);
  ball2.velocity.y = coeff2*sin(phi2) + v2*sin(theta2-phi2)*cos(phi2+HALF_PI);
}

function initSurfaces(){
  var grP1 = createVector(0, height);
  var grP2 = createVector(width, height);
  ground = new Surface(grP1, grP2, 1);
  surfaces.push(ground);
  
  var rwP1 = createVector(width, 0);
  var rwP2 = createVector(width, height);
  rWall = new Surface(rwP1, rwP2, -1);
  surfaces.push(rWall);
  
  var lwP1 = createVector(0, height);
  var lwP2 = createVector(0, 0);
  lWall = new Surface(lwP1, lwP2, -1);
  surfaces.push(lWall); 
  
  newSurface(100, 500, 200, 550, 1);
}

function newSurface(x1, y1, x2, y2, orientation){
  surfaces.push(new Surface(createVector(x1, y1), createVector(x2, y2), orientation));
}

function deleteSurface(index){
  surfaces.pop(index);
}
