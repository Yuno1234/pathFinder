var population;
var lifespan = 200;
var lifeP;
var count = 0;
var target;

function setup() {
    createCanvas(400, 300);
    rocket = new Rocket();
    population = new Population();
    lifeP = createP();
    target = createVector(width/2, 50);
}


function draw() {
    background(0);
    population.run();
    lifeP.html(count);
    

    count++;
    if (count == lifespan) {
        population.evaluate();
        population.selection();
        count = 0;
    }

    ellipse(target.x, target.y, 16, 16);
}


function Population() {
    this.rockets = [];
    this.popsize = 25;
    this.matingpool = [];

    for (var i = 0; i < this.popsize; i++) {
        this.rockets[i] = new Rocket();
    }

    this.evaluate = function() {

        var maxfit = 0;
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].calcFitness();
            if (this.rockets[i].fitness > maxfit) {
                maxfit = this.rockets[i].fitness;
            } 
        }
        
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].fitness /= maxfit;
        }

        this.matingpool = [];
        for (var i = 0; i < this.popsize; i++) {
            var n = this.rockets[i].fitness * 100;
            for (var j = 0; j < n; j++) {
                 this.matingpool.push(this.rockets[i]);
            }
        }
    }

    this.selection = function() {
        var newRockets = [];
        for (var i = 0; i < this.rockets.length; i++){
            var parentA = random(this.matingpool).dna;
            var parentB = random(this.matingpool).dna;
            var child = parentA.crossover(parentB);
            newRockets[i] = new Rocket(child);
        }
        this.rockets = newRockets;
        
    }

    this.run = function() {
        for (var i = 0; i < this.popsize; i++) {
            this.rockets[i].update();
            this.rockets[i].show();
        }
    }
}

function DNA(genes) {
    if (genes) {
        this.genes = genes;
    } else {
        this.genes = [];
        for (var i = 0; i < lifespan; i++) {
            this.genes[i] = p5.Vector.random2D()
            this.genes[i].setMag(0.1);
        }
    }

    this.crossover = function(partner) {
        var newgenes = [];
        var mid = floor(random(this.genes.length))
        for (var i = 0; i < this.genes.length; i++) {
            if (i > mid) {
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
        }
        return new DNA(newgenes);
    }
}

function Rocket(dna) {
    this.pos = createVector(width/2, height);
    this.vel = createVector();
    this.acc = createVector();
    if (dna) {
        this.dna = dna;
    } else {
        this.dna = new DNA();
    }
    this.fitness = 0;

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.calcFitness = function() {
        var d = dist(this.pos.x, this.pos.y, target.x, target.y)
        
        this.fitness = map(d, 0, width, width, 0);
    }

    this.update = function() {

        this.applyForce(this.dna.genes[count]);

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.show = function() {
        push();
        noStroke();
        fill(255, 150);
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());
        rectMode(CENTER);
        rect(0, 0, 20, 5);
        pop();
    }
}