function Sector(size, number){
  this.size = size;
  this.number = number;
  this.SPR = width/size;
  this.topLeftx = (this.number%this.SPR) * this.size;
  this.topLefty = floor(this.number/this.SPR) * this.size;
  this.p1 = createVector(this.topLeftx, this.topLefty);
  this.p2 = createVector(this.size, 0).add(this.p1);
  this.p3 = createVector(this.size, this.size).add(this.p1);
  this.p4 = createVector(0, this.size).add(this.p1);
  this.balls = [];
  
  //print("p1: " + this.p1.toString());
  
  
  this.show = function() {
    stroke(0);
    strokeWeight(1);
    fill(0, 255, 0, 50);
    quad(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y, this.p4.x, this.p4.y);
  }
  
  this.addBall = function(b) {
    this.balls.push(b);
  }
  
  this.reset = function() {
    this.balls = [];
  }
}
