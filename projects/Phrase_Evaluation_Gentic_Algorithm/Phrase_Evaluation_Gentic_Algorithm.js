const target_phrase  = "So a monkey walks into a typewriter store";
var population;
var generation = 0;

function setup() {
  createCanvas(1500, 750);
  background(240);
  //frameRate(1);

  population = new Population();
  for (var i = 0; i < 200; i++) {
    var element = new DNA();
    population.add(element);
  }
  console.log(population);
}

function draw() {
  clear();
  textAlign(LEFT);
  textSize(16);
  textStyle(NORMAL);
  text('The target phrase is:', 0, height/2, 300, 40);

  textSize(14);
  textStyle(ITALIC);
  fill(255,51,51);
  text(target_phrase, 0, height/2 + 35);

  textSize(13);
  textStyle(NORMAL);
  fill(0);
  text('Generation: ' + generation, 0, height/2 + 100);
  yCount = 18;
  xCount = 1;
  for (var i = 0; i < population.pool.length; i++) {
    if (population.pool[i].str == target_phrase) {
      fill(255, 0, 0);
    } else {
      fill(0);
    }
    textSize(12);
    text(population.pool[i].str, width - xCount * map(population.pool[i].str.length, 3, 30, 13, 8) * (population.pool[i].str.length), height - yCount);
    if (xCount >= 5) {
      yCount += 18;
      xCount = 1;
    } else {
      xCount++;
    }
  }
  if (!population.hasMatch()) {
    population.evaluate();

    population.nextGen();

    generation++;
  } else {
    textSize(20);
    textAlign(LEFT);
    text('Target has been found!', 0, height/2 - 25);
  }
}
