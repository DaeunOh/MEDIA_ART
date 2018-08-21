var heartSize = 30;
var hearts = [];
var index = 0;

function setup() {
    createCanvas(640, 480);
    background(0);
    angleMode(DEGREES);
}
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
}

function draw() {
    background(0, 0, 0, 25);

    for(var i = 0; i<hearts.length; i++){
        hearts[i].size += 0.2;
        hearts[i].alpha -= 1;

        fill(255,0,0, hearts[i].alpha);
        hearts[i].heartDraw();
    }

    if(frameCount % 30 == 0) {
        hearts[index] = new heart(200,200,15,70);

        if(index == 20)
            index = 0;
        else
            index++;
    }
}

