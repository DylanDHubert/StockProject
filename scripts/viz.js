let histograms; // STORE HISTOGRAM DATA
let timestamps; // TIMESTAMP KEYS
let binSize = 50; // SIZE OF EACH BIN
let cubeSize = 500; // SIZE OF CUBE
let spacing = 10; // SPACING BETWEEN BOXES
let boxHeightScale = 5; // SCALE HEIGHT OF BOXES FOR VISUALIZATION

function preload() {
    // LOAD HISTOGRAM DATA
    histograms = loadJSON('data/histograms.json');
}

function setup() {
    createCanvas(800, 800, WEBGL);
    noStroke();
    timestamps = Object.keys(histograms); // EXTRACT TIMESTAMPS
}

function draw() {
    background(30);
    orbitControl(); // ENABLE ORBITAL CAMERA CONTROLS

    // CENTER THE ORIGIN
    translate(-cubeSize / 2, -cubeSize / 2, -cubeSize / 2);

    let sliceDepth = cubeSize / timestamps.length; // DEPTH OF EACH TIMESTAMP SLICE

    timestamps.forEach((timestamp, tIndex) => {
        let histogram = histograms[timestamp]; // GET HISTOGRAM FOR CURRENT TIMESTAMP
        let bins = histogram.bins;
        let binWidth = (cubeSize - bins.length * spacing) / bins.length; // WIDTH OF EACH BIN

        bins.forEach((freq, bIndex) => {
            // POSITION BOX
            let x = bIndex * (binWidth + spacing);
            let z = tIndex * sliceDepth;

            // BOX HEIGHT BASED ON FREQUENCY
            let boxHeight = freq * boxHeightScale;

            // DRAW BOX
            push();
            translate(x, cubeSize - boxHeight / 2, z); // ADJUST FOR BASE ALIGNMENT
            ambientMaterial(150, 100, 250); // SET BOX COLOR
            box(binWidth, boxHeight, sliceDepth - spacing);
            pop();
        });
    });
}
