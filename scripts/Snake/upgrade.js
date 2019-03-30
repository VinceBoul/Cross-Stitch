

//pixi init
var app = new PIXI.Application(400, 400, { antialias: true });

//circle array
var circles = [];

function initRenderer() {


    document.getElementById("pixidisplay-4").appendChild(app.view);

    console.log("initializing renderer");

    for(var i = 0; i < 100; i++) {
        circles[i] = new CircleShape(Math.floor((Math.random() * 400) + 1), Math.floor((Math.random() * 400) + 1));
    }
}

function draw() {
    console.log("drawing..");

    for(var i = 0; i < 100; i++) {
        circles[i].drawCircleShape();
    }

}

function CircleShape(_x, _y) {

    var circleGraphic = new PIXI.Graphics();

    var str = '#1C3144';
    var num = parseInt(str.substring(1), 16);
    var size = 1;
    var speed = 0.3;

    this.x = _x;
    this.y = _y;

    this.drawCircleShape = function drawCircleShape() {

        circleGraphic.lineStyle(0);
        circleGraphic.beginFill(num, 1);
        circleGraphic.drawCircle(0, 0, 1);

        circleGraphic.endFill();

        app.stage.addChild(circleGraphic);
        circleGraphic.scale.set(size);

        circleGraphic.position.x = this.x;
        circleGraphic.position.y = this.y;

        app.ticker.add(function(delta) {
            circleGraphic.scale.set(size);
            size = size + speed * delta;

        });
    }

    console.log(size);
}

initRenderer();
draw();



