// LOAD JSON DATA
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

  timestamps.forEach((timestamp, tIndex) => {
    const histogram = histograms[timestamp];
    const bins = histogram.bins;

    bins.forEach((freq, bIndex) => {
      const x = bIndex * boxSize;
      const z = tIndex * depthSize;

      const boxHeight = freq * 0.5; // SCALE HEIGHT

      push();
      translate(x + boxSize / 2, gridSize - boxHeight / 2, z + depthSize / 2);

      strokeWeight(1);
      ambientMaterial(120, 100, 250); // BOX COLOR
      box(boxSize, 100 * boxHeight, depthSize);
      pop();
    });
  });
}
