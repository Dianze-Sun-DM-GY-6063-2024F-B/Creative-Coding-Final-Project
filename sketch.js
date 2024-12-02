let segments = []; 
let segmentSize = 20; 
let numSegments = 10; 

function setup() {
  createCanvas(800, 800);

  for (let i = 0; i < numSegments; i++) {
    segments.push({ x: width / 2, y: height / 2 }); 
  }
}

function draw() {
  background(30);


  segments[0].x += (mouseX - segments[0].x) * 0.2;
  segments[0].y += (mouseY - segments[0].y) * 0.2;

 
  for (let i = 1; i < segments.length; i++) {
    let prev = segments[i - 1]; 
    let current = segments[i]; 

    current.x += (prev.x - current.x) * 0.2;
    current.y += (prev.y - current.y) * 0.2;
  }


  noStroke();
  fill(100, 200, 250);
  for (let i = 0; i < segments.length; i++) {
    rectMode(CENTER);
    rect(segments[i].x, segments[i].y, segmentSize, segmentSize);
  }
}
