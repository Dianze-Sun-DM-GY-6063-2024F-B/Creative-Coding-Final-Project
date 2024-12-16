let creatures = [];
let numCreatures = 20;
let fixedSizes = [120, 50, 20]; 
let sizeProbabilities = [0.1, 0.35, 0.55]; 
let numSegments = 30;
let normalSpeed = 2;
let escapeSpeed = 18;
let escapeDuration = 4000;
let escaping = false;
let escapeEndTime = 0;


let mSerial;
let connectButton;
let readyToReceive = false;
let soundThreshold = 400; 


let noiseOffsets = [];
let noiseStep = 0.01; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);


  for (let i = 0; i < numCreatures; i++) {
    let randomSize = getRandomSize(); 
    creatures.push(new Creature(random(width), random(height), numSegments, randomSize));
    noiseOffsets.push({ x: random(1000), y: random(1000) }); 
  }


  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2 - 50, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  background(0);
  let centerX = width / 2;
  let centerY = height / 2;


  for (let r = max(width, height); r > 0; r -= 20) {
    let gradientColor = lerpColor(
      color(0, 59, 53),
      color(0, 0, 0),
      2 * r / max(width, height)
    );
    fill(gradientColor);
    noStroke();
    ellipse(centerX, centerY, r * 2, r * 2);
  }


  for (let i = 0; i < creatures.length; i++) {
    creatures[i].update(noiseOffsets[i]);
    creatures[i].display();
    noiseOffsets[i].x += noiseStep; 
    noiseOffsets[i].y += noiseStep;
  }


  if (escaping && millis() > escapeEndTime) {
    escaping = false;
    for (let i = 0; i < creatures.length; i++) {
      creatures[i].speed = normalSpeed;
    }
  }


  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab); 
  }

  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }
}

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  if (!line) return;

  trim(line);

  if (!line.includes(",")) {
    print("Error: ", line);
    readyToReceive = true;
    return;
  }

  let parts = line.split(",");
  let a1 = parseInt(parts[1].split(":")[1]); 


  if (a1 > soundThreshold && !escaping) {
    triggerEscape();
  }

  readyToReceive = true;
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    readyToReceive = true;
    connectButton.hide();
  }
}

function triggerEscape() {
  escaping = true;
  escapeEndTime = millis() + escapeDuration;
  for (let i = 0; i < creatures.length; i++) {
    creatures[i].speed = escapeSpeed;
  }
}

class Creature {
  constructor(x, y, numSegments, segmentSize) {
    this.segments = [];
    this.rotations = [];
    this.target = { x: random(width), y: random(height) };
    this.speed = normalSpeed;
    this.escapeTarget = null;
    this.segmentSize = segmentSize; 
    this.legLength = segmentSize * 0.5; 

    for (let i = 0; i < numSegments; i++) {
      this.segments.push({ x: x, y: y });
      this.rotations.push(0);
    }
  }

  update(noiseOffset) {
    if (escaping) {
      if (!this.escapeTarget) {
        this.escapeTarget = this.getRandomEdgePoint();
        this.target = this.escapeTarget;
      }
    } else {
      this.escapeTarget = null;

      let noiseX = noise(noiseOffset.x) * 2 - 1; 
      let noiseY = noise(noiseOffset.y) * 2 - 1;

      let rangeX = width * 1.5;
      let rangeY = height * 1.5;

      this.target.x = width / 2 + noiseX * rangeX; 
      this.target.y = height / 2 + noiseY * rangeY;


      this.target.x = constrain(this.target.x, -width * 0.5, width * 1.5);
      this.target.y = constrain(this.target.y, -height * 0.5, height * 1.5);
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

      if (distance > this.segmentSize) {
        let offset = distance - this.segmentSize;
        currentSegment.x += (dx / distance) * offset;
        currentSegment.y += (dy / distance) * offset;
      }

      let lerpSpeed = escaping ? 0.6 : 0.2; 
      currentSegment.x = lerp(currentSegment.x, prevSegment.x, lerpSpeed);
      currentSegment.y = lerp(currentSegment.y, prevSegment.y, lerpSpeed);
      this.rotations[i] = lerp(this.rotations[i], this.rotations[i - 1], lerpSpeed);
    }
  }

  display() {
    for (let i = 0; i < this.segments.length; i++) {
      let size = map(i, 0, this.segments.length - 1, this.segmentSize, this.segmentSize / 2);
      let alpha = map(i, 0, this.segments.length, 230, 0); 
      let legAngle = sin(frameCount * 0.1 + i) * PI / 6;

      fill(255, 255, 255, alpha);
      noStroke();

      push();
      translate(this.segments[i].x, this.segments[i].y);
      rotate(this.rotations[i]);
      rectMode(CENTER);
      rect(0, 0, size, size, size / 4);

      stroke(200, 200, 255, alpha / 2);
      strokeWeight(2);

      let leftLegX = -size / 9;
      let leftLegY = cos(legAngle) * this.legLength;
      line(leftLegX, 0, leftLegX - this.legLength, leftLegY);

      let rightLegX = size / 9;
      let rightLegY = cos(-legAngle) * this.legLength;
      line(rightLegX, 0, rightLegX + this.legLength, rightLegY);

      pop();
      let head = this.segments[0];
      push();
      translate(head.x, head.y);
      rotate(this.rotations[0]);
      fill(255, 255, 255, 200);
      ellipse(-this.segmentSize / 4, -this.segmentSize / 4, this.segmentSize / 3, this.segmentSize / 3);
      ellipse(this.segmentSize / 4, -this.segmentSize / 4, this.segmentSize / 3, this.segmentSize / 3);
      fill(0);
      ellipse(-this.segmentSize / 4, -this.segmentSize / 4, this.segmentSize / 4, this.segmentSize / 4);
      ellipse(this.segmentSize / 4, -this.segmentSize / 4, this.segmentSize / 4, this.segmentSize / 4);
      pop();
    }
  }

  getRandomEdgePoint() {
    let edge = floor(random(4));
    if (edge === 0) {
      return { x: random(width), y: 0 }; 
    } else if (edge === 1) {
      return { x: random(width), y: height }; 
    } else if (edge === 2) {
      return { x: 0, y: random(height) }; 
    } else {
      return { x: width, y: random(height) }; 
    }
  }
}

function getRandomSize() {
  let r = random();
  if (r < sizeProbabilities[0]) {
    return fixedSizes[0]; 
  } else if (r < sizeProbabilities[0] + sizeProbabilities[1]) {
    return fixedSizes[1]; 
  } else {
    return fixedSizes[2]; 
  }
}
