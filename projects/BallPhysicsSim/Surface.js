function Surface(point1, point2, orientation) {
  this.p1 = point1.copy();
  this.p2 = point2.copy();
  this.orient = orientation;
  this.zVector = createVector(0, 0, 1);
  this.lVector = createVector(this.p2.x-this.p1.x, this.p2.y-this.p1.y, 0);
  this.lVectorCopy = this.lVector.copy();
  this.midPoint = createVector(this.p2.x+this.p1.x, this.p2.y+this.p1.y).div(2);
  this.angle;
  if(this.p1.y < this.midPoint.y){
    this.angle = PI - atan( (this.midPoint.y - this.p1.y) / (this.midPoint.x - this.p1.x));
  }
  else if(this.p1.y > this.midPoint.y){
    this.angle = atan( (this.p1.y - this.midPoint.y) / (this.midPoint.x - this.p1.x));
  }
  this.normal = createVector(0,0);
  
  this.show = function() {
    stroke(200);
    strokeWeight(5);
    line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    //draw normal
    stroke(255);
    strokeWeight(2);
    line(this.midPoint.x, this.midPoint.y, this.midPoint.x + this.normal.x * 10, this.midPoint.y + this.normal.y * 10);
  }
  
  this.getNormal = function() {
    this.normal = this.lVector.cross(this.zVector).normalize().mult(this.orient);
    //print("midPoint: " + this.midPoint.x + ", " + this.midPoint.y);
    //print("Normal: " + normal.x + ", " + normal.y + "\n");
    return this.normal;
  }
}
