var sound;
var fft;
var spectrumWeight = [];
var sumOfWeight = 0;
var checkNum = 0;

function preload() {
    sound = loadSound("iu.mp3");
}

function setup() {
    var cnv = createCanvas(100, 100);
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT(0, 256);
    sound.amp(0.5);
}

function draw() {
    background(0);
    colorMode(HSB);

    var spectrum = fft.analyze();

    noStroke();
    //fill(0,255,0); // spectrum is green
    //console.log(spectrum.length);
    sumOfWeight = 0;
    checkNum = 0;

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
        else if(spectrum[i] >= 108 && spectrum[i] < 145) {
            sumOfWeight += 40;
        }
        else if(spectrum[i] >= 145 && spectrum[i] < 182) {
            sumOfWeight += 50;
        }
        else if(spectrum[i] >= 182 && spectrum[i] < 219) {
            sumOfWeight += 60;
        }
        else {
            sumOfWeight += 70;
        }
    }

    console.log(sumOfWeight);

    for (var i = 0; i < spectrum.length; i++) {
        // console.log("second" + i);
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255);
        rect(x, height, width / spectrum.length, h)
    }


    colorMode(RGB);

    var waveform = fft.waveform();
    noFill();
    beginShape();
    stroke(255, 0, 0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i < waveform.length; i++) {
        var x = map(i, 0, waveform.length, 0, width);
        var y = map(waveform[i], -1, 1, 0, height);
        vertex(x, y);
    }
    endShape();

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