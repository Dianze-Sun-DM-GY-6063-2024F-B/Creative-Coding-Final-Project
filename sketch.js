let creatures = [];
let numCreatures = 20;
let segmentSize = 10;
let numSegments = 10;
let normalSpeed = 2;
let escapeSpeed = 8;
let escapeDuration = 6000;
let escaping = false;
let escapeEndTime = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);

  for (let i = 0; i < numCreatures; i++) {
    creatures.push(new Creature(random(width), random(height), numSegments));
  }
}

function draw() {
  background(0);

  for (let i = 0; i < creatures.length; i++) {
    creatures[i].update();
    creatures[i].display();
  }

  if (escaping && millis() > escapeEndTime) {
    escaping = false;
    for (let i = 0; i < creatures.length; i++) {
      creatures[i].speed = normalSpeed;
    }
  }
}

class Creature {
  constructor(x, y, numSegments) {
    this.segments = [];
    this.rotations = [];
    this.target = { x: random(width), y: random(height) };
    this.timeToNextTarget = millis() + random(500, 2000);
    this.speed = normalSpeed;
    this.escapeTarget = null;

    for (let i = 0; i < numSegments; i++) {
      this.segments.push({ x: x, y: y });
      this.rotations.push(0);
    }
  }

  update() {
    if (escaping) {
      if (!this.escapeTarget) {
        this.escapeTarget = this.randomTopPoint();
        this.target = this.escapeTarget;
      }
    } else {
      this.escapeTarget = null;
      if (millis() > this.timeToNextTarget) {
        this.target = { x: random(width), y: random(height) };
        this.timeToNextTarget = millis() + random(500, 2000);
      }
    }

    let head = this.segments[0];
    let dx = this.target.x - head.x;
    let dy = this.target.y - head.y;
    let distance = dist(head.x, head.y, this.target.x, this.target.y);

    if (distance > this.speed) {
      head.x += (dx / distance) * this.speed;
      head.y += (dy / distance) * this.speed;
      this.rotations[0] = atan2(dy, dx);
    }

    for (let i = 1; i < this.segments.length; i++) {
      let prevSegment = this.segments[i - 1];
      let currentSegment = this.segments[i];
      let dx = prevSegment.x - currentSegment.x;
      let dy = prevSegment.y - currentSegment.y;
      let distance = dist(prevSegment.x, prevSegment.y, currentSegment.x, currentSegment.y);

      if (distance > segmentSize) {
        let offset = distance - segmentSize;
        currentSegment.x += (dx / distance) * offset;
        currentSegment.y += (dy / distance) * offset;
      }

      currentSegment.x = lerp(currentSegment.x, prevSegment.x, 0.2);
      currentSegment.y = lerp(currentSegment.y, prevSegment.y, 0.2);
      this.rotations[i] = lerp(this.rotations[i], this.rotations[i - 1], 0.2);
    }
  }

  display() {
    for (let i = 0; i < this.segments.length; i++) {
      let alpha = map(i, 0, this.segments.length, 255, 50);
      let legAngle = sin(frameCount * 0.1 + i) * PI / 6;

      fill(255, 255, 255, alpha);
      noStroke();

      push();
      translate(this.segments[i].x, this.segments[i].y);
      rotate(this.rotations[i]);
      rectMode(CENTER);
      rect(0, 0, segmentSize, segmentSize, segmentSize / 4);

      stroke(200, 200, 255, alpha);
      strokeWeight(2);

      let leftLegX = -segmentSize / 2;
      let leftLegY = cos(legAngle) * 15;
      line(leftLegX, 0, leftLegX - 15, leftLegY);

      let rightLegX = segmentSize / 2;
      let rightLegY = cos(-legAngle) * 15;
      line(rightLegX, 0, rightLegX + 15, rightLegY);

      pop();
    }

    let head = this.segments[0];
    push();
    translate(head.x, head.y);
    rotate(this.rotations[0]);
    fill(255, 255, 255, 200);
    ellipse(-segmentSize / 4, -segmentSize / 4, segmentSize / 3, segmentSize / 3);
    ellipse(segmentSize / 4, -segmentSize / 4, segmentSize / 3, segmentSize / 3);
    fill(0);
    ellipse(-segmentSize / 4, -segmentSize / 4, segmentSize / 4, segmentSize / 4);
    ellipse(segmentSize / 4, -segmentSize / 4, segmentSize / 4, segmentSize / 4);
    pop();
  }

  randomTopPoint() {
    return { x: random(width), y: 0 };
  }
}

function keyPressed() {
  if (key === ' ') {
    escaping = true;
    escapeEndTime = millis() + escapeDuration;
    for (let i = 0; i < creatures.length; i++) {
      creatures[i].speed = escapeSpeed;
    }
  }
}
