var Boid = function() {
  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();

  this.move = function(boids) {
    this.acceleration.add(this.cohesion(boids));
    this.acceleration.add(this.separation(boids));
    this.acceleration.add(this.alignment(boids));
    this.acceleration.add(this.avoidWalls());
    this.velocity.add(this.acceleration);
    this.acceleration.set(0, 0, 0);
    this.limitVelocity();
    this.position.add(this.velocity);
  }

  this.limitVelocity = function() {
    if (this.velocity.length() > Boid.MAX_VELOCITY) {
      this.velocity.normalize().multiplyScalar(Boid.MAX_VELOCITY);
    }
  }

  this.cohesion = function(boids) {
    var count = 0;
    var positionSum = new THREE.Vector3();

    for (var i = 0; i < boids.length; i++) {
      var distance = boids[i].position.distanceTo(this.position);

  		if (distance > 0 && distance <= Boid.NEIGHBOR_RADIUS) {
  			positionSum.add(boids[i].position);
  			count++;
  		}
    }
    if (count > 0) {
      var averagePosition = positionSum.divideScalar(count);
      return averagePosition.sub(this.position).multiplyScalar(Boid.COHESION_MULTIPLIER);
    }
    return new THREE.Vector3();
  }


  this.separation = function(boids) {
    var count = 0;
    var separationSum = new THREE.Vector3();
    var separation = new THREE.Vector3();

    for (var i = 0; i < boids.length; i++) {
      var distance = boids[i].position.distanceTo(this.position);

      if (distance > 0 && distance <= Boid.SEPARATION_RADIUS) {
        separation.subVectors(this.position, boids[i].position);
        separation.normalize();
        separation.divideScalar(distance);
        separationSum.add(separation);
        count++;
      }
    }
    return separationSum.multiplyScalar(Boid.SEPARATION_MULTIPLIER);
  }

  this.alignment = function(boids) {
    var count = 0;
    var velocitySum = new THREE.Vector3();

    for (var i = 0; i < boids.length; i++) {
      var distance = boids[i].position.distanceTo(this.position);

  		if (distance > 0 && distance <= Boid.NEIGHBOR_RADIUS) {
  			velocitySum.add(boids[i].velocity);
  			count++;
  		}
    }
    if (count > 0) {
      var averageVelocity = velocitySum.divideScalar(count);
      return averageVelocity.multiplyScalar(Boid.ALIGNMENT_MULTIPLIER);
    }
    return new THREE.Vector3();
  }

  this.avoid = function(obstacle) {
    var v = new THREE.Vector3();
    v.subVectors(this.position, obstacle);
    v.multiplyScalar(1 / (4*this.position.distanceToSquared(obstacle)));
    return v;
  }

  this.avoidWalls = function() {
    var v = new THREE.Vector3();

    v.add(this.avoid(new THREE.Vector3(-Boid.X_RANGE, this.position.y, this.position.z)));
    v.add(this.avoid(new THREE.Vector3( Boid.X_RANGE, this.position.y, this.position.z)));

    v.add(this.avoid(new THREE.Vector3(this.position.x, -Boid.Y_RANGE, this.position.z)));
    v.add(this.avoid(new THREE.Vector3(this.position.x,  Boid.Y_RANGE, this.position.z)));

    v.add(this.avoid(new THREE.Vector3(this.position.x, this.position.y, -Boid.Z_RANGE)));
    v.add(this.avoid(new THREE.Vector3(this.position.x, this.position.y,  Boid.Z_RANGE)));

    return v.multiplyScalar(Boid.WALLS_MULTIPLIER);
  }
}


// Static props & functions
Boid.NEIGHBOR_RADIUS;
Boid.SEPARATION_RADIUS;
Boid.MAX_VELOCITY = 0.5;
Boid.X_RANGE;
Boid.Y_RANGE;
Boid.Z_RANGE;
Boid.COHESION_MULTIPLIER;
Boid.SEPARATION_MULTIPLIER;
Boid.ALIGNMENT_MULTIPLIER;
Boid.WALLS_MULTIPLIER;



Boid.update = function(props) {
  Boid.NEIGHBOR_RADIUS = props.neighborRadius;
  Boid.SEPARATION_RADIUS = props.separationRadius;
  Boid.COHESION_MULTIPLIER = props.cohesion;
  Boid.SEPARATION_MULTIPLIER = props.separation;
  Boid.ALIGNMENT_MULTIPLIER = props.alignment;
  Boid.WALLS_MULTIPLIER = props.avoidWalls;

  Boid.X_RANGE = props.xRange;
  Boid.Y_RANGE = props.yRange;
  Boid.Z_RANGE = props.zRange;
}
