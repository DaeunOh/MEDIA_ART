var video;
var video2;
var prevFrame;
var threshold = 50;
var dx = 200;
var dy = 200;

var sound;
var fft;
var sumOfWeight = 0;
var hearts = [];
var index = 0;

//소리
var mic = null;
var particles = [];
var particleIndex = 0;

class heart {
    constructor(x, y, size ,alpha){
        this.x = x;
        this.y = y;
        this.size = size;
        this.alpha = alpha;
    }

    heartDraw(){
        noStroke();
        beginShape();
        curveVertex(this.x,this.y-this.size-this.size/8);
        curveVertex(this.x,this.y-this.size-this.size/8);

        curveVertex(this.x-this.size/2-this.size/8,this.y-2*this.size+this.size/8);
        curveVertex(this.x-this.size/2-this.size-this.size/8,this.y-2*this.size+this.size/8);

        curveVertex(this.x-2*this.size-this.size/4,this.y-this.size);
        curveVertex(this.x-2*this.size-this.size/4,this.y);
        curveVertex(this.x-this.size-this.size/2,this.y+this.size);

        vertex(this.x,this.y+2*this.size);
        vertex(this.x,this.y+2*this.size);
        vertex(this.x,this.y+2*this.size);

        curveVertex(this.x+this.size+this.size/2,this.y+this.size);

        curveVertex(this.x+2*this.size+this.size/4,this.y);
        curveVertex(this.x+2*this.size+this.size/4,this.y-this.size);

        curveVertex(this.x+this.size*13/8,this.y-2*this.size+this.size/8);
        curveVertex(this.x+this.size*5/8,this.y-2*this.size+this.size/8);
        endShape(CLOSE);
    }

    heartSet(dx, dy){
        this.dx = dx;
        this.dy = dy;
    }
}

function preload() {
    sound = loadSound("blackpink.mp3");
}

function setup() {
    var cnv = createCanvas(1200, 800);
    cnv.mouseClicked(togglePlay);
    fft = new p5.FFT(0, 256);
    sound.amp(0.5);
    angleMode(DEGREES);

    pixelDensity(1);
    video = createCapture(VIDEO);
    video2 = createCapture(VIDEO);
    video.size(width, height);
    video2.size(width/2, height/2);
    video.hide();
    prevFrame = createImage(video.width, video.height, RGB);

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
    background(0, 0, 0, 25);
    colorMode(HSB, 256);

    var spectrum = fft.analyze();

    noStroke();

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

    for(var i = 0; i<hearts.length; i++){
        hearts[i].size += 0.2;
        hearts[i].alpha -= 1;

        fill(map(sumOfWeight, 5000, 10000, 0, 255) % 256, 255, 255, hearts[i].alpha);
        hearts[i].heartDraw();
    }

    if(frameCount % 20 == 0) {
        hearts[index] = new heart(dx,dy,14,70);

        if(index == 20)
            index = 0;
        else
            index++;
    }

    //image(prevFrame, 0, 0);

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
            // var diff = dist(r1, g1, b1, r2, g2, b2);
            var diff = 0;
            diff += abs(r1-r2) + abs(g1-g2) + abs(b1-b2);


            // Step 5, How different are the colors?
            // If the color at that pixel has changed, then there is motion at that pixel.
            if (diff > threshold) {
                // If motion, display black
                // pixels[loc] = 0;
                // pixels[loc+1] = 0;
                // pixels[loc+2] = 0;
                // pixels[loc+3] = 255;

                if(x >= dx-50 && x <= dx+100 && y >= dy-50 && y <= dy+100){
                    var tempX = random(0,width-50);
                    dx = tempX;
                    var tempY = random(0,height-50);
                    dy = tempY;

                    for(var i = 0; i<hearts.length; i++){
                        hearts[i].heartSet(tempX, tempY);
                    }
                    //setRect(random(0,width-50),random(0,random(height-50)));
                }

            } else {
                // If not, display white
                // pixels[loc] = 255;
                // pixels[loc+1] = 255;
                // pixels[loc+2] = 255;
                // pixels[loc+3] = 255;
            }
        }
    }
    updatePixels();
    //
    //
    //
    prevFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // Before we read the new frame, we always save the previous frame for comparison!
}

// fade sound if mouse is over canvas
function togglePlay() {
    if (sound.isPlaying()) {
        sound.pause();
    } else {
        sound.loop();
    }
}

