var Population = function() {
  this.pool = [];
}

Population.prototype.add = function(dna) {
  append(this.pool, dna);
}

//Population.prototype.evaluate = function() {
//  this.selectionPool = [];
//  for (var i = 0; i < this.pool.length; i++) {
//    //console.log('evaluated');
//    var j = floor(map(this.pool[i].fit, 0, target_phrase.length, 0, 1) * 100);
//    //console.log(j);
//    while (j > 0) {
//      append(this.selectionPool, this.pool[i]);
//      j--;
//    }
//  }
//  console.log(this.selectionPool);
//}

Population.prototype.evaluate = function() {
  var sum = 0;
  for (var i = 0; i < this.pool.length; i++) {
    sum += this.pool[i].fit;
  }
  for (var i = 0; i < this.pool.length; i++) {
    this.pool[i].fit /= sum
  }
  console.log(this.pool);
}

// use 37% rule
Population.prototype.selectParent = function() {
  const decision_ind = floor(this.pool.length * 0.37)
  var best_ind = 0;
  
  var ind = 1;
  // skip over first 37%
  while (ind <= decision_ind) {
    if (this.pool[ind].fit > this.pool[best_ind].fit) {
      best_ind = ind;
    }
    ind++;
  }

  // look for next best option
  while (ind < this.pool.length) {
    if (this.pool[ind].fit > this.pool[best_ind].fit) {
      return this.pool[ind];
    }
    ind++;
  }

  return this.pool[best_ind];
}

Population.prototype.nextGen = function() {
  var tempPool = [];
  for (var i = 0; i < this.pool.length; i++) {
    var p1 = this.selectParent();
    var p2 = this.selectParent()
    append(tempPool, this.crossover(p1, p2))
  }
  this.pool = tempPool;
}

Population.prototype.crossover = function(p1, p2) {
  var child = new DNA();
  var ind = floor(random(1, p1.chromosomes.length)); //p1.chromosomes.length/2; //
  for (var a = 0; a < ind; a++) {
    child.chromosomes[a] = p1.chromosomes[a];
  }
  for (var b = ind; b < p2.chromosomes.length; b++) {
    child.chromosomes[b] = p2.chromosomes[b];
  }
  child.mutate();
  child.update();
  //console.log(child);
  
  return child;
}

Population.prototype.hasMatch = function() {
  for (var i = 0; i < this.pool.length; i++) {
    if (this.pool[i].str == target_phrase) {
      return true;
    }
  }
  return false;
}
