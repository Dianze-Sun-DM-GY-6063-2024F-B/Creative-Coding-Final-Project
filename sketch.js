let creatures = [];
let numCreatures = 20;
let fixedSizes = [120, 50, 20]; // 固定大小
let sizeProbabilities = [0.1, 0.35, 0.55]; // 大、中、小的概率
let numSegments = 30;
let normalSpeed = 2;
let escapeSpeed = 18;
let escapeDuration = 4000;
let escaping = false;
let escapeEndTime = 0;

// Perlin Noise 偏移
let noiseOffsets = [];
let noiseStep = 0.01; // 每帧增加的噪声步长

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  // 初始化生物和 Perlin Noise 偏移
  for (let i = 0; i < numCreatures; i++) {
    let randomSize = getRandomSize(); // 按概率获取随机大小
    creatures.push(new Creature(random(width), random(height), numSegments, randomSize));
    noiseOffsets.push({ x: random(1000), y: random(1000) }); // 独立的 Perlin 偏移值
  }
}

function draw() {
  background(0);
  let centerX = width / 2;
  let centerY = height / 2;

  // 背景渐变
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

  // 更新和显示生物
  for (let i = 0; i < creatures.length; i++) {
    creatures[i].update(noiseOffsets[i]);
    creatures[i].display();
    noiseOffsets[i].x += noiseStep; // 增加 Perlin Noise 偏移
    noiseOffsets[i].y += noiseStep;
  }

  // 恢复普通速度
  if (escaping && millis() > escapeEndTime) {
    escaping = false;
    for (let i = 0; i < creatures.length; i++) {
      creatures[i].speed = normalSpeed;
    }
  }
}

class Creature {
  constructor(x, y, numSegments, segmentSize) {
    this.segments = [];
    this.rotations = [];
    this.target = { x: random(width), y: random(height) };
    this.speed = normalSpeed;
    this.escapeTarget = null;
    this.segmentSize = segmentSize; // 每个生物的段大小
    this.legLength = segmentSize * 0.5; // 根据身体大小设置腿长

    for (let i = 0; i < numSegments; i++) {
      this.segments.push({ x: x, y: y });
      this.rotations.push(0);
    }
  }

  update(noiseOffset) {
    if (escaping) {
      if (!this.escapeTarget) {
        this.escapeTarget = this.getRandomEdgePoint(); // 逃跑目标点设为屏幕四周随机位置
        this.target = this.escapeTarget;
      }
    } else {
      this.escapeTarget = null;

      // 使用 Perlin Noise 生成分散目标点
      let noiseX = noise(noiseOffset.x) * 2 - 1; // [-1, 1]
      let noiseY = noise(noiseOffset.y) * 2 - 1;

      let rangeX = width * 1.5; // 增加范围以分散目标点
      let rangeY = height * 1.5;

      this.target.x = width / 2 + noiseX * rangeX; // 目标点分布在更大区域
      this.target.y = height / 2 + noiseY * rangeY;

      // 限制目标点在画布范围内，避免超出太远
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

      // 根据是否逃跑调整身体段的响应速度
      let lerpSpeed = escaping ? 0.8 : 0.2; // 逃跑时提高响应速度
      currentSegment.x = lerp(currentSegment.x, prevSegment.x, lerpSpeed);
      currentSegment.y = lerp(currentSegment.y, prevSegment.y, lerpSpeed);
      this.rotations[i] = lerp(this.rotations[i], this.rotations[i - 1], lerpSpeed);
    }
  }

  display() {
    for (let i = 0; i < this.segments.length; i++) {
      // 根据索引计算段大小
      let size = map(i, 0, this.segments.length - 1, this.segmentSize, this.segmentSize / 2);
      let alpha = map(i, 0, this.segments.length, 230, 0); // 渐变透明度
      let legAngle = sin(frameCount * 0.1 + i) * PI / 6;

      fill(255, 255, 255, alpha);
      noStroke();

      push();
      translate(this.segments[i].x, this.segments[i].y);
      rotate(this.rotations[i]);
      rectMode(CENTER);
      rect(0, 0, size, size, size / 4);

      stroke(255, 255, 255, alpha / 3);
      strokeWeight(10);

      // 左腿
      let leftLegX = -size / 12;
      let leftLegY = cos(legAngle) * this.legLength;
      line(leftLegX, 0, leftLegX - this.legLength, leftLegY);

      // 右腿
      let rightLegX = size / 12;
      let rightLegY = cos(-legAngle) * this.legLength;
      line(rightLegX, 0, rightLegX + this.legLength, rightLegY);

      pop();
    }

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

  getRandomEdgePoint() {
    let edge = floor(random(4));
    if (edge === 0) {
      return { x: random(width), y: 0 }; // 上边界
    } else if (edge === 1) {
      return { x: random(width), y: height }; // 下边界
    } else if (edge === 2) {
      return { x: 0, y: random(height) }; // 左边界
    } else {
      return { x: width, y: random(height) }; // 右边界
    }
  }
}

function getRandomSize() {
  let r = random();
  if (r < sizeProbabilities[0]) {
    return fixedSizes[0]; // 大
  } else if (r < sizeProbabilities[0] + sizeProbabilities[1]) {
    return fixedSizes[1]; // 中
  } else {
    return fixedSizes[2]; // 小
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
