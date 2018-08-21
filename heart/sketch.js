var heartSize = 30;
var a = [];
var i = 0;
function setup() {
    createCanvas(640, 480);
    background(0);
    angleMode(DEGREES);
    a.push(new heart(200,200,10,20));

}
class heart {
    constructor(x, y, a ,alpha){
        this.x = x;
        this.y = y;
        this.a = a;
        this.alpha = alpha;
    }
    setHeartSize(s){
        this.a += s;
    }
    setHeartAlpha(a){
        this.alpha -= a;
    }
    getHeartAlpha(){
        return this.alpha;
    }
    heartDraw(){
        noStroke();
        fill(255,0,0, this.alpha);
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
    a[0].heartDraw();
    a[0].setHeartSize(0.05*i++);
    a[0].setHeartAlpha(0.05*i);
    if(a[0].getHeartAlpha <= 0){
        console.log("alpha <=0");
        a.length = 0;
        i=0;
        a.push(new heart(200,200,10,20));
        background(0);
    }


}

