function ball(rad, startx, starty, startXV, startYV){
  this.path = [];
  this.sectors = [];
  this.x = startx;
  this.y = starty;
  this.location = createVector(this.x, this.y);
  this.xv = startXV;
  this.yv = startYV;
  this.normal = createVector(0, 0);
  this.radius = rad
  this.gravity = .5;
  this.velocity = createVector(this.xv, this.yv + this.gravity);
  this.airResist = this.radius*this.radius*.00005;
  this.friction = .0002;
  this.distToSurface = 1000;
  this.wasColliding = false;
  
  this.show = function() {
    if(this.velocity.mag() == 0){
      fill(255, 0, 0);
    }
    else if(this.velocity.y == 0){
      fill(0, 255, 0);
    }
    else if(this.velocity.x == 0){
      fill(0, 0, 255);
    }
    else{
      fill(255, 140, 20);
    }
    strokeWeight(1);
    stroke(0);
    ellipseMode(RADIUS);
    ellipse(this.x, this.y, this.radius, this.radius);
    
    strokeWeight(2);
    stroke(255);
    line(this.x, this.y, this.x + this.velocity.x * 3, this.y + this.velocity.y * 3);
      
  }
  
  this.drawPath = function() {
    for(var i = 0; i < this.path.length; i++){
      var v = this.path[i];
      fill(255);
      noStroke();
      ellipse(v.x, v.y, 2, 2);
    }
  }
  
  this.collideWith = function(normal) {
    this.gravity = 0.5;
    this.normal = normal.copy()
    this.velocity.sub(this.normal.mult(2 * this.velocity.dot(this.normal)));
    
    var magnitude = mag(this.velocity.x, this.velocity.y);
    //print("magnitude of velocity: " + magnitude);
    //print("y velocity: " + this.velocity.y);
    var magFactor = map(magnitude, 0, 20, 0.2, 1);
    var radFactor = map(this.radius, 10, 50, 1, 0.15);
    var d = normal.copy().mult((this.radius - this.distToSurface) * (magFactor));
    
    if(this.y+this.radius >= height){
       if(abs(this.velocity.y) <= this.airResist + 0.01){
         this.velocity.y = 0;
         //this.gravity = 0;
       }
       else{
         this.y = height-this.radius;
       }
       
       if(abs(this.velocity.x) <= this.airResist){
          this.velocity.x = 0;
       }
       if(this.velocity.x < 0){
         this.velocity.x += this.friction;
       }
       else if(this.velocity.x > 0){
         this.velocity.x -= this.friction;
       }
    }
    else{
      if(abs(this.velocity.y) > 0.5){
        this.y += d.y
      }
    }
    
    if(abs(this.velocity.x) > 0.05){
      this.x += d.x + 0.1;
    }
    
    this.wasColliding = true;
  }
  
  this.isColliding = function(surface) {
    var b = surface.p2.copy();
    var u = b.sub(createVector(this.x, this.y));
    var v = surface.lVector.copy();
    var utemp = u.copy();
    var proj = v.mult(u.dot(v) / v.dot(v));
    utemp.sub(proj);
    this.distToSurface = sqrt(utemp.x*utemp.x + utemp.y*utemp.y);
    
    var betweenCorners = false;
    var cornerV1 = createVector(this.x-surface.p1.x, this.y-surface.p1.y);
    var surfaceV1 = createVector(surface.p1.x - surface.p2.x, surface.p1.y-surface.p2.y);
    var cornerV2 = createVector(this.x-surface.p2.x, this.y-surface.p2.y);
    var surfaceV2 = createVector(surface.p2.x - surface.p1.x, surface.p2.y-surface.p1.y);
    
    let ang1 = v.angleBetween(u);
    if(abs(ang1) < PI/2 && abs(cornerV2.angleBetween(surfaceV1)) < PI/2){
      betweenCorners = true;
    }
    
    
    if(this.distToSurface <= this.radius && betweenCorners) {
      return true;
    }
    else {
      return false;
    }
  }

  this.update = function(surfaces) {
    this.gravity = 0.5;
    for(var i = 0; i < surfaces.length; i++){
      var surf = surfaces[i];
      if(this.isColliding(surf)){
        this.collideWith(surf.getNormal());
      }
      else{
        this.wasColliding = false;
      }
    }
    
    this.velocity.y += this.gravity;
    
    this.velocity.y -= this.airResist*map(this.velocity.y, -10, 10, -1, 1);
    this.velocity.x -= this.airResist*map(this.velocity.x, -10, 10, -1, 1);
    
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    
    this.location.x = this.x;
    this.location.y = this.y;

    if(this.velocity.mag() != 0){
      this.path.push(createVector(this.x, this.y));
      
      if(this.path.length > 25){
        this.path.splice(0, 1);
      }
    }
  }
}
