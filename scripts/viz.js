let histograms = {}; // HISTOGRAM DATA

function preload() {
  // LOAD JSON FILE
  loadJSON('data/histograms.json', data => {
    histograms = data;
  });
}

function setup() {
  createCanvas(800, 800, WEBGL);
  noStroke();
  stroke(255);
}

function draw() {
  background(30);
  orbitControl(); // ENABLE ORBIT CAMERA CONTROLS

  const timestamps = Object.keys(histograms);

  const gridSize = 500; // SQUARE GRID
  const boxSize = gridSize / 48; // BOX SIZE FOR FIXED WIDTH (48 BINS)
  const depthSize = gridSize / 48; // BOX SIZE FOR FIXED DEPTH (48 TIMESTAMPS)

  translate(-gridSize / 2, -gridSize / 2, -gridSize / 2);

  // DRAW AXES
  drawAxes(gridSize);

  // DRAW BOXES
  timestamps.forEach((timestamp, tIndex) => {
    const histogram = histograms[timestamp];
    const bins = histogram.bins;

    bins.forEach((freq, bIndex) => {
      const x = bIndex * boxSize;
      const z = tIndex * depthSize;
  
      const scale = 5;
      const boxHeight = scale * freq;
  
      // MAP BOX HEIGHT TO COLOR RANGE
      const colorValue = map(boxHeight, 0, scale * Math.max(...bins), 0, 255); // Map to 0-255
  
      push();
      ambientLight(255);
      pointLight(100, 100, 100, width / 2, height / 2, 300);
  
      translate(x + boxSize / 2, -boxHeight / 2, z + depthSize / 2);
  
      strokeWeight(1);
  
      // APPLY COLOR BASED ON HEIGHT
      ambientMaterial(0, colorValue, 255 - colorValue);
      box(boxSize, boxHeight, depthSize);
      pop();
    });
  });
}

// FUNCTION TO DRAW AXES
function drawAxes(size) {
  push();
  stroke(255);
  strokeWeight(2);

  // X-AXIS (Bin Values)
  line(0, 0, 0, size, 0, 0);
  drawLabel("Bin Value", size + 10, 0, 0);

  // Y-AXIS (Frequency, Vertical Axis)
  line(0, 0, 0, 0, -size, 0); // Negative because drawing from top
  drawLabel("Frequency", 0, -size - 20, 0);

  // Z-AXIS (Time)
  line(0, 0, 0, 0, 0, size);
  drawLabel("Time", 0, 0, size + 10);

  pop();
}

// FUNCTION TO DRAW LABELS
function drawLabel(label, x, y, z) {
  push();
  translate(x, y, z);
  rotateX(-HALF_PI); // Rotate label to face upwards
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(200);
  text(label, 0, 0);
  pop();
}
