var heartSize = 30;
var a = [];
function setup() {
    createCanvas(640, 480);
    background(0);
    angleMode(DEGREES);


}
class heart {
    constructor(x, y, a){
        this.x = x;
        this.y = y;
        this.a = a;
    }

    heartDraw(){
        noStroke();
        beginShape();
        curveVertex(this.x,this.y-this.a-this.a/8);
        curveVertex(this.x,this.y-this.a-this.a/8);

        curveVertex(this.x-this.a/2-this.a/8,this.y-2*this.a+this.a/8);
        curveVertex(this.x-this.a/2-this.a-this.a/8,this.y-2*this.a+this.a/8);

        curveVertex(this.x-2*this.a-this.a/4,this.y-this.a);
        curveVertex(this.x-2*this.a-this.a/4,this.y);
        curveVertex(this.x-this.a-this.a/2,this.y+this.a);

        vertex(this.x,this.y+2*this.a);
        vertex(this.x,this.y+2*this.a);
        vertex(this.x,this.y+2*this.a);

        curveVertex(this.x+this.a+this.a/2,this.y+this.a);

        curveVertex(this.x+2*this.a+this.a/4,this.y);
        curveVertex(this.x+2*this.a+this.a/4,this.y-this.a);

        curveVertex(this.x+this.a*13/8,this.y-2*this.a+this.a/8);
        curveVertex(this.x+this.a*5/8,this.y-2*this.a+this.a/8);
        endShape(CLOSE);
    }
}

function draw() {


    for(var i=0; i<30; i++){
        heartSize -= 0.05*i;
        fill(255,0,0, 0.1*i);
        a.push(new heart(200,200,heartSize));
        a[i].heartDraw();
    }

    heartSize = 30;

}

