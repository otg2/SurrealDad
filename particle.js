
function Particle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 1;
  this.fadeScale = 1;


  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function(xpos,ypos, scale, volScale) {    
    strokeWeight((5 + scale)*this.fadeScale*volScale);
    line(this.pos.x, this.pos.y, xpos, ypos);
  }


  this.edges = function() {
	  
	let ann = Math.min(Math.abs(this.pos.x - width),Math.abs(this.pos.x - 0),Math.abs(this.pos.y - height), Math.abs(this.pos.y - 0))
	  
	this.fadeScale = Math.min(ann,50)/50;
	
	  
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
}
