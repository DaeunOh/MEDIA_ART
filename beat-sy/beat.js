var sound = [];
var selectedSound = [];
var fft;
var sumOfWeight = 0;
var hearts = [];
var beatHearts = [];
var index = 0;
var si = 0;

var smallHearts = [];
var heartIndex = 0;
var locked = false;
var prevFrameCount = 0;
var song = 0;
var dx;
var dy;

var button1;
var button2;
var button3;
var button4;

var r = 120;
var hs = 7;
var smallHeartX = 200;
var smallHeartY = 200;

var mic = null;

// var soundFile;
var amplitude;
var backgroundColor;

var heartRotate = true;

var beatHoldFrames = 30;
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

}

function generateSmallHeart(index, size, smallHeartX, smallHeartY) {
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
    sound[0] = loadSound("btob.mp3");
    sound[1] = loadSound("iu.mp3");
    sound[2] = loadSound("blackpink.mp3");
    sound[3] = loadSound("Selena Gomez-Bad Liar.mp3");
}
//
function btob() {
    song = 0;
    for(var i = 0 ;i<sound.length; i++){
        sound[i].stop();
    }
    sound[song].play();

    amplitude = new p5.Amplitude();
    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);
}

function iu() {
    song = 1;
    for(var i = 0 ;i<sound.length; i++){
        sound[i].stop();
    }
    sound[song].play();

    amplitude = new p5.Amplitude();
    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);
}
function dudu() {
    song = 2;
    for(var i = 0 ;i<sound.length; i++){
        sound[i].stop();
    }
    sound[song].play();

    amplitude = new p5.Amplitude();
    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);

}
function selena() {
    song = 3;
    for(var i = 0 ;i<sound.length; i++){
        sound[i].stop();
    }
    sound[song].play();

    amplitude = new p5.Amplitude();
    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);


}
// function changeMusic(s) {
//     song = s;
//     for(var i = 0 ;i<sound.length; i++){
//         sound[i].stop();
//     }
//     sound[song].play();
//     sound[song].showControls()
//
// }

function setup() {
    var c = createCanvas(windowWidth, windowHeight);
    //var cnv = createCanvas(1800, 1000);
    //c.mouseClicked(togglePlay);
    fft = new p5.FFT(0, 256);
    for (var i = 0; i < sound.length; i++) {
        sound[i].amp(0.5);
    }

    angleMode(DEGREES);
    dx = windowWidth / 2;
    dy = windowHeight / 2;

    button1 = createButton('MOVIE-BTOB').style('padding', '10px');
    button2 = createButton('밤편지-IU').style('padding', '10px');
    button3 = createButton('뚜두뚜두-BlackPink').style('padding', '10px');
    button4 = createButton('Bad Liar-Selena Gomez').style('padding', '10px');
    button1.position(windowWidth - 200, 10);
    button2.position(windowWidth - 200, 60);
    button3.position(windowWidth - 200,110);
    button4.position(windowWidth - 200,160);
    button1.mousePressed(btob);
    button2.mousePressed(iu);
    button3.mousePressed(dudu);
    button4.mousePressed(selena);

    mic = new p5.AudioIn();
    mic.start();

    noStroke();
    rectMode(CENTER);
    backgroundColor = color(0, 0, 0);

    amplitude = new p5.Amplitude();

    // sound.play();

    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);

    beatHearts[0] = new heart(dx, dy + r, 5, 252);

    for (var i = 0; i < 360; i++) {
        smallHearts[i] = generateSmallHeart(i, 12, smallHeartX, smallHeartY);
    }
}

function draw() {
    // colorMode(RGB);
    // blendMode(BLEND);
    background(backgroundColor);
    // blendMode(ADD);
    colorMode(HSB, 256);


    amplitude.setInput(sound[song]);
    amplitude.smooth(0.9);
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
        hearts[i].alpha -= 3;

        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255, hearts[i].alpha);
        hearts[i].heartDraw();
    }


    for (var i = 0; i < beatHearts.length; i++) {
        beatHearts[i].alpha -= 1.5;

        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255, beatHearts[i].alpha);
        beatHearts[i].heartDraw();
    }

    // var generateCount = Math.floor(mic.getLevel() * 1000);
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
                    generateSmallHeart(heartIndex, 12, smallHeartX, smallHeartY);
            }

            var tempX = random(200, width - 200);
            dx = tempX;
            var tempY = random(200, height - 200);
            dy = tempY;
        }
        else {
            if (frameCount - prevFrameCount > 10) {
                locked = false;
            }
        }


    }

    if (frameCount % 60 == 0) {
        hearts[index] = new heart(dx, dy, 18, 252);
        if (index == 20)
            index = 0;
        else
            index++;
    }
    //
    //
    // if (mic.getLevel() * 1000 > 100) {
    //     var tempX = random(100, width - 100);
    //     dx = tempX;
    //     tempX = random(100, width - 100);
    //     dx2 = tempX;
    //     tempX = random(100, width - 100);
    //     dx3 = tempX;
    //
    //     var tempY = random(100, height - 100);
    //     dy = tempY;
    //     tempY = random(100, height - 100);
    //     dy2 = tempY;
    //     tempY = random(100, height - 100);
    //     dy3 = tempY;
    //
    // }

    // if (frameCount % 60 == 0) {
    //     hearts[index] = new heart(dx, dy, 14, 252);
    //     hearts2[index] = new heart(dx2, dy2, 14, 252);
    //     hearts3[index] = new heart(dx3, dy3, 14, 252);
    //
    //     if (index == 20)
    //         index = 0;
    //     else
    //         index++;
    // }


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

//fade sound if mouse is over canvas
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
    if (si === 0) {
        beatHearts[0] = new heart(dx, dy + r, hs, 252);
    }
    else if (si === 1) {
        beatHearts[1] = new heart(dx + r / sqrt(2), dy + r / sqrt(2), hs, 252);
    }
    else if (si === 2) {
        beatHearts[2] = new heart(dx + r, dy, hs, 252);
    }
    else if (si === 3) {
        beatHearts[3] = new heart(dx + r / sqrt(2), dy - r / sqrt(2), hs, 252);
    }
    else if (si === 4) {
        beatHearts[4] = new heart(dx, dy - r, hs, 252);
    }
    else if (si === 5) {
        beatHearts[5] = new heart(dx - r / sqrt(2), dy - r / sqrt(2), hs, 252);
    }
    else if (si === 6) {
        beatHearts[6] = new heart(dx - r, dy, hs, 252);
    }
    else if (si === 7) {
        beatHearts[7] = new heart(dx - r / sqrt(2), dy + r / sqrt(2), hs, 252);
    }

    if (si == 7)
        si = 0;
    else
        si++;

    console.log(si);

    heartRotate = !heartRotate;
    backgroundColor = color(random(40, 180), random(40, 180), random(40, 180));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background(0);
}