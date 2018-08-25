var video;
var video2;
var prevFrame;
var threshold = 50;
var dx = 200;
var dy = 200;
//소리
var mic = null;
var particles = [];
var particleIndex = 0;

// function generateParticle(index, size) {
//     return {
//         x: Math.random() * 10 + width / 2,
//         y: Math.random() * 10 + height / 2,
//         size: size,
//         h: index,
//         v: {
//             x: Math.random() * 10 - 5,
//             y: Math.random() * 10 - 5,
//         }
//     };
// }

function setup() {
    createCanvas(640, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video2 = createCapture(VIDEO);
    video.size(width, height);
    video2.size(width, height);
    video.hide();
    prevFrame = createImage(video.width, video.height, RGB);

    // mic = new p5.AudioIn();
    // mic.start();
    //
    // for (var i = 0; i < 360; i++) {
    //     particles[i] = generateParticle(i, 15);
    // }

}
function drawRect() {
    fill(200, 0, 200);
    rect(dx, dy, 50, 50);
}
function setRect(sx,sy) {
    dx = sx;
    dy = sy;
}
function draw() {
    image(prevFrame, 0, 0);

    loadPixels();
    video.loadPixels();
    prevFrame.loadPixels();

    // Begin loop to walk through every pixel
    for (var x = 0; x < video.width; x++) {
        for (var y = 0; y < video.height; y++) {

            // Step 1, what is the location into the array
            var loc = (x + y * video.width) * 4;

            // Step 2, what is the previous color
            var r1 = prevFrame.pixels[loc   ];
            var g1 = prevFrame.pixels[loc + 1];
            var b1 = prevFrame.pixels[loc + 2];

            // Step 3, what is the current color
            var r2 = video.pixels[loc   ];
            var g2 = video.pixels[loc + 1];
            var b2 = video.pixels[loc + 2];

            // Step 4, compare colors (previous vs. current)
            var diff = dist(r1, g1, b1, r2, g2, b2);

            // Step 5, How different are the colors?
            // If the color at that pixel has changed, then there is motion at that pixel.
            if (diff > threshold) {
                // If motion, display black
                // pixels[loc] = 0;
                // pixels[loc+1] = 0;x,y
                // pixels[loc+2] = 0;
                pixels[loc+3] = 255;
                //움직인곳에 사각형 생기기
                //setRect(x,y);
                //
                if(x >= dx-50 && x <= dx+100 && y >= dy-50 && y <= dy+100){
                    setRect(random(0,width-50),random(0,random(height-50)));
                }

            } else {
                // If not, display white
                pixels[loc] = 255;
                pixels[loc+1] = 255;
                pixels[loc+2] = 255;
                pixels[loc+3] = 255;
            }
        }
    }
    updatePixels();
    drawRect();

    // Save frame for the next cycle
    //if (video.canvas) {
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
    //}

    // colorMode(RGB);
    // blendMode(BLEND);
    //
    // blendMode(ADD);
    // colorMode(HSB);
    //
    // for (var i = 0; i < 360; i++) {
    //     var p = particles[i];
    //     stroke(0);
    //     strokeWeight(0);
    //
    //     p.x += p.v.x;
    //     p.y += p.v.y;
    //     p.v.x += Math.random() * 2 - 1;
    //     p.v.y += Math.random() * 2 - 1;
    //     p.size -= 0.2;
    //     fill(p.h, 200, 200, p.size * 20);
    //     rect(p.x, p.y, p.size, p.size);
    //
    // }
    //
    // var generateCount = Math.floor(mic.getLevel() * 100);
    // for (var i = 0; i < generateCount; i++) {
    //     particleIndex++;
    //     particleIndex %= particles.length;
    //     particles[particleIndex] = generateParticle(particleIndex, generateCount);
    // }
    //

}

