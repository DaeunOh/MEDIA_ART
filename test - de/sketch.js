var sound;
var fft;
var sumOfWeight = 0;
var index = 0;

var hearts = [];
var smallHearts = [];
var heartIndex = 0;

var dx = 200;
var dy = 200;
var smallHeartX;
var smallHeartY;

var locked = false;
var prevFrameCount = 0;

var mic = null;

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

function generateSmallHeart(index, size) {
    return {
        x: Math.random() * 10 + smallHeartX,
        y: Math.random() * 10 + smallHeartY,
        size: size,
        h: index,
        v: {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5,
        }
    }
}

function smallHeart(x, y, size) {
    noStroke();
    beginShape();
    curveVertex(x, y - size - size / 8);
    curveVertex(x, y - size - size / 8);

    curveVertex(x - size / 2 - size / 8, y - 2 * size + size / 8);
    curveVertex(x - size / 2 - size - size / 8, y - 2 * size + size / 8);

    curveVertex(x - 2 * size - size / 4, y - size);
    curveVertex(x - 2 * size - size / 4, y);
    curveVertex(x - size - size / 2, y + size);

    vertex(x, y + 2 * size);
    vertex(x, y + 2 * size);
    vertex(x, y + 2 * size);

    curveVertex(x + size + size / 2, y + size);

    curveVertex(x + 2 * size + size / 4, y);
    curveVertex(x + 2 * size + size / 4, y - size);

    curveVertex(x + size * 13 / 8, y - 2 * size + size / 8);
    curveVertex(x + size * 5 / 8, y - 2 * size + size / 8);
    endShape(CLOSE);
}

function preload() {
    sound = loadSound("iu.mp3");
}

function setup() {
    var cnv = createCanvas(1024, 800);
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT(0, 256);
    sound.amp(0.5);
    angleMode(DEGREES);

    mic = new p5.AudioIn();
    mic.start();

    for (var i = 0; i < 360; i++) {
        smallHearts[i] = generateSmallHeart(i, 3);
    }
}

function draw() {
    // colorMode(RGB);
    // blendMode(BLEND);

    // blendMode(ADD);
    colorMode(HSB, 256);
    background(0, 0, 255);

    var spectrum = fft.analyze();

    //noStroke();
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

    for (var i = 0; i < hearts.length; i++) {
        hearts[i].size += 0.2;
        hearts[i].alpha -= 3;

        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255, hearts[i].alpha);
        hearts[i].heartDraw();
    }

    for (var i = 0; i < smallHearts.length; i++) {
        var h = smallHearts[i];

        stroke(0);
        strokeWeight(0);

        h.x += h.v.x;
        h.y += h.v.y;
        h.v.x += Math.random() - 0.5;
        h.v.y += Math.random() - 0.5;
        h.size -= 0.1;

        fill(map(sumOfWeight, 5000, 10000, 0, 255), 200, 200, h.size * 20);
        smallHeart(h.x, h.y, h.size);
    }

    var generateCount = Math.floor(mic.getLevel() * 1000);
    if (generateCount > 100) { // clap
        if (!locked) {
            locked = true;

            prevFrameCount = frameCount;

            smallHeartX = dx;
            smallHeartY = dy;

            for (var i = 0; i < generateCount - 50; i++) {
                heartIndex++;
                heartIndex %= smallHearts.length;
                smallHearts[heartIndex] =
                    generateSmallHeart(heartIndex, 8);
            }

            var tempX = random(100, width - 100);
            dx = tempX;
            var tempY = random(100, height - 100);
            dy = tempY;
        }
        else {
            if (frameCount - prevFrameCount > 10) {
                locked = false;
            }
        }


    }

    if (frameCount % 60 == 0) { // 20(fast) ~ 60(slow)
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
    //
    // text('click to play/pause', 4, 10);
}

// fade sound if mouse is over canvas
function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
}