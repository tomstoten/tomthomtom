const mRate = .0075;

var DNA = function() {
  this.chromosomes = this.gen_rand_string();
  this.fit = this.getFitness();
  this.str = join(this.chromosomes, '');
}

DNA.prototype.update = function() {
  this.fit = this.getFitness();
  this.str = join(this.chromosomes, '');
}

DNA.prototype.gen_rand_string = function() {
  var list = [];
  for (var i = 0; i < target_phrase.length; i++) {
    append(list, char(floor(random(32,126))));
  }
  return list;
}

DNA.prototype.getFitness = function() {
  var count = 0;
  let target_list = split(target_phrase, '');
  for (var i = 0; i < target_phrase.length; i++) {  
    if (this.chromosomes[i] == target_list[i]) {
      count++;
    }
  }
  return count;
}

DNA.prototype.mutate = function() {
  for (var i = 0; i < this.chromosomes.length; i++) {
    if (floor(random(0, 1/mRate)) == 0) {
      this.chromosomes[i] = char(floor(random(32,126)));
    }
  }
}
