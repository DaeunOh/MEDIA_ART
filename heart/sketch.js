var hs = 10;
var al =20;
var a = [];
var i = 0;
var n;
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
    set sheartSize(s){
        this.a = s;
    }
    set sheartAlpha(a){
        this.alpha = a;
    }
    get gheartAlpha(){
        return this.alpha;
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
    background(0, 0, 0, 25);

    hs+=0.2;
    a[0].sheartSize = hs;
    al-= 1;
    a[0].sheartAlpha = al;
    n = a[0].gheartAlpha;
    fill(255,0,0, n);
    a[0].heartDraw();
    if(n <= 0){
        console.log("aaa");
        i=0;
        a[0].sheartSize = 10;
        a[0].sheartAlpha = 20;
        a.length = 0;
        a.push(new heart(200,200,10,20));
    }


}

