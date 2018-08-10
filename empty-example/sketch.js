var mic = null;
var particles = [];
var particleIndex = 0;

var video;

function generateParticle(index, size) {
    return {
        x: Math.random() * 10 + width / 2,
        y: Math.random() * 10 + height / 2,
        size: size,
        h: index,
        v: {
            x: Math.random() * 10 - 5,
            y: Math.random() * 10 - 5,
        }
    };
}

function setup() {
    // add canvas to body
    createCanvas(1024, 800);
    mic = new p5.AudioIn();
    mic.start();

    // HSB, H 0 - 360
    for (var i = 0; i < 360; i++) {
        particles[i] = generateParticle(i, 3);
    }

    video = createCapture(VIDEO);
    video.size(300, 240);
    // video.hide();
}

function draw() {
    // put the camera on the canvas

    colorMode(RGB);
    blendMode(BLEND);
    background(0, 0, 0, 25);
    blendMode(ADD);
    colorMode(HSB);
    for (var i = 0; i < 360; i++) {
        var p = particles[i];

        stroke(0);
        strokeWeight(0);

        p.x += p.v.x;
        p.y += p.v.y;
        p.v.x += Math.random() * 2 - 1;
        p.v.y += Math.random() * 2 - 1;
        p.size -= 0.1;

        fill(p.h, 200, 200, p.size * 20);
        ellipse(p.x, p.y, p.size, p.size);
    }

    var generateCount = Math.floor(mic.getLevel() * 100);
    for (var i = 0; i < generateCount; i++) {
        particleIndex++;
        particleIndex %= particles.length;
        particles[particleIndex] =
            generateParticle(particleIndex, generateCount);
    }

    image(video, 0, 0);
}