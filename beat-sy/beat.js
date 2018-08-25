var sound;
var fft;
var sumOfWeight = 0;
var hearts = [];
var smallhearts = [];
var index = 0;
var si = 0;

var dx = 200;
var dy = 200;

var mic = null;

// var soundFile;
var amplitude;
var backgroundColor;

var heartRotate = true;

var beatHoldFrames = 200;
var beatThreshold = 0.11;

var beatCutoff = 0;
var beatDecayRate = 0.98;
var framesSinceLastBeat = 0;

class heart {
    constructor(x, y, size, alpha) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = alpha;
    }

    heartDraw() {
        noStroke();
        beginShape();
        curveVertex(this.x, this.y - this.size - this.size / 8);
        curveVertex(this.x, this.y - this.size - this.size / 8);

        curveVertex(this.x - this.size / 2 - this.size / 8, this.y - 2 * this.size + this.size / 8);
        curveVertex(this.x - this.size / 2 - this.size - this.size / 8, this.y - 2 * this.size + this.size / 8);

        curveVertex(this.x - 2 * this.size - this.size / 4, this.y - this.size);
        curveVertex(this.x - 2 * this.size - this.size / 4, this.y);
        curveVertex(this.x - this.size - this.size / 2, this.y + this.size);

        vertex(this.x, this.y + 2 * this.size);
        vertex(this.x, this.y + 2 * this.size);
        vertex(this.x, this.y + 2 * this.size);

        curveVertex(this.x + this.size + this.size / 2, this.y + this.size);

        curveVertex(this.x + 2 * this.size + this.size / 4, this.y);
        curveVertex(this.x + 2 * this.size + this.size / 4, this.y - this.size);

        curveVertex(this.x + this.size * 13 / 8, this.y - 2 * this.size + this.size / 8);
        curveVertex(this.x + this.size * 5 / 8, this.y - 2 * this.size + this.size / 8);
        endShape(CLOSE);
    }

    heartSet(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }
}

function preload() {
    sound = loadSound("blackpink.mp3");
}

function setup() {
    c = createCanvas(windowWidth, windowHeight);
    //var cnv = createCanvas(1800, 1000);
    c.mouseClicked(togglePlay);
    fft = new p5.FFT(0, 256);
    sound.amp(0.5);
    angleMode(DEGREES);

    mic = new p5.AudioIn();
    mic.start();

    noStroke();
    rectMode(CENTER);
    backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));

    amplitude = new p5.Amplitude();

    sound.play();

    amplitude.setInput(sound);
    amplitude.smooth(0.9);
}

function draw() {
    // colorMode(RGB);
    // blendMode(BLEND);
    background(backgroundColor);
    // blendMode(ADD);
    colorMode(HSB, 256);

    var level = amplitude.getLevel();
    detectBeat(level);

    var spectrum = fft.analyze();

    noStroke();
    //fill(0,255,0); // spectrum is green
    //console.log(spectrum.length);
    sumOfWeight = 0;

    for (var i = 0; i < spectrum.length; i++) {
        if (spectrum[i] >= 0 && spectrum[i] < 36) {
            sumOfWeight += 10;
        }
        else if (spectrum[i] >= 36 && spectrum[i] < 72) {
            sumOfWeight += 20;
        }
        else if (spectrum[i] >= 72 && spectrum[i] < 108) {
            sumOfWeight += 30;
        }
        else if (spectrum[i] >= 108 && spectrum[i] < 145) {
            sumOfWeight += 40;
        }
        else if (spectrum[i] >= 145 && spectrum[i] < 182) {
            sumOfWeight += 50;
        }
        else if (spectrum[i] >= 182 && spectrum[i] < 219) {
            sumOfWeight += 60;
        }
        else {
            sumOfWeight += 70;
        }
    }

    var distortDiam = map(level, 0, 1, 0, 1200);
    if (heartRotate) {
        var rotation = PI / 2;
    } else {
        var rotation = 0;
    }

    for (var i = 0; i < hearts.length; i++) {
        hearts[i].size += 0.2;
        //hearts[i].size += distortDiam/1000;
        hearts[i].alpha -= 3;
        //rotate(rotation);

        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255, hearts[i].alpha);
        hearts[i].heartDraw();

    }
    for (var i = 0; i < smallhearts.length; i++){
        smallhearts[i].heartDraw();
    }


    // var generateCount = Math.floor(mic.getLevel() * 1000);


    if (mic.getLevel() * 1000 > 100) {
        var tempX = random(100, width - 100);
        dx = tempX;
        var tempY = random(100, height - 100);
        dy = tempY;
    }

    if (frameCount % 60 == 0) {
        hearts[index] = new heart(dx, dy, 14, 252);

        if (index == 20)
            index = 0;
        else
            index++;
    }

    // for (var i = 0; i < spectrum.length; i++) {
    //     // console.log("second" + i);
    //     var x = map(i, 0, spectrum.length, 0, width);
    //     var h = -height + map(spectrum[i], 0, 255, height, 0);
    //     fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255);
    //     rect(x, height, width / spectrum.length, h)
    // }


    // colorMode(RGB);
    //
    // var waveform = fft.waveform();
    // noFill();
    // beginShape();
    // stroke(255, 0, 0); // waveform is red
    // strokeWeight(1);
    // for (var i = 0; i < waveform.length; i++) {
    //     var x = map(i, 0, waveform.length, 0, width);
    //     var y = map(waveform[i], -1, 1, 0, height);
    //     vertex(x, y);
    // }
    // endShape();

    text('click to play/pause', 4, 10);
}

// fade sound if mouse is over canvas
function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
}

function detectBeat(level) {
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.2;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        }
        else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

function onBeat() {
    hearts[si] = new heart(dx + random(-40, 40), dy + random(-40, 40), 2, 252);

    if (si == 6)
        si = 0;
    else
        si++;

    heartRotate = !heartRotate;
    backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}