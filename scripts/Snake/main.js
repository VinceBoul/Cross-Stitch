
const lineStep = 1.6;
const pointSize = 10;

var app = new PIXI.Application(800, 600);

let renderer = app.renderer;
let stage = new PIXI.Container();
document.body.appendChild(app.renderer.view);

let ticker = PIXI.Ticker.shared;

let currentDrawing = getBoatDrawing();
let unDrawing = getBoatDrawing();
let pointsDrawing = [];
let crossStitch;

for (let i in currentDrawing.reverse()){
    crossStitch = new CrossStitch();
    crossStitch.begin(
        currentDrawing[i].position.x*pointSize,
        currentDrawing[i].position.y*pointSize,
        currentDrawing[i].color.substring(1));
    pointsDrawing.push(crossStitch);
}

let currentCSIndex = 0;
let currentCS;


currentCS = pointsDrawing.pop();
let currentUndraw = unDrawing.pop();

ticker.speed = 100;
ticker.elapsedMS = 1;
ticker.add(function() {

    if (currentCSIndex < currentDrawing.length ){


        if (!currentCS.isDrawn()){
            currentCS.newDraw();
        }else{
            currentCS = pointsDrawing.pop();
            console.log(currentCS);
            currentCSIndex += 1;
        }

    }else{
        app.ticker.stop();
    }

    renderer.render(stage);

});


/**
 * Fil de Gauche à droite
 * @constructor
 */
function CrossStitch(){

    let lineToX = 0;
    let lineToY = 0;

    this.step_one_over = false;
    this.step_two_over = false;
    this.step_undraw = false;
    this.step_three_over = false;
    this.step_four_over = false;

    this.posX = 0;
    this.posY = 0;

    this.secondLine = new PIXI.Graphics();
    this.firstLine = new PIXI.Graphics();

    this.newUndraw = function(){
        if (this.step_undraw && this.step_two_over && !this.step_three_over){
            this.undrawFirstLine();
        }
        if (this.step_three_over){
            this.undrawSecondLine();
        }
    };

    this.newDraw = function(){
        if (!this.step_one_over) this.drawFirstLine();

        if (this.step_one_over && !this.step_two_over){
            this.drawSecondLine();
        }
        if (this.step_two_over && !this.step_three_over && !this.step_undraw){
            this.prepareUndraw();
        }
    };

    /**
     * Fil la 1ère ligne
     */
    this.drawFirstLine = function(){
        lineToX += lineStep;
        lineToY += lineStep;

        this.firstLine.moveTo(0, 0);

        // 1er Fil OK
        if (lineToX >= pointSize && lineToY >= pointSize){
            this.step_one_over = true;
            this.secondLine.moveTo(pointSize, 0);
            lineToX = pointSize;
            lineToY = 0;
        }

        if (!this.step_one_over){
            this.firstLine.lineTo(lineToX, lineToY);
        }

    };

    /**
     * Fil la 2ème ligne
     */
    this.drawSecondLine = function(){
        this.secondLine.moveTo(lineToX, lineToY);

        lineToX -= lineStep;
        lineToY += lineStep;

        this.step_two_over = (lineToX <= 0);

        // 2è fil OK
        if (!this.step_two_over){
            this.secondLine.lineTo(lineToX, lineToY);
        }
    };


    this.prepareUndraw = function(){

        this.step_undraw = true;
        this.firstLine.lineTo(0, 0);
        this.posX = 0;
    };

    this.undrawFirstLine = function(){
        this.posX += lineStep;

        if (this.posX <= pointSize ){

            this.firstLine.clear();
            this.firstLine.moveTo(this.posX, this.posX);
            this.firstLine.lineTo(pointSize, pointSize);

        } else{

            this.step_three_over = true;
            this.firstLine.clear();
            stage.removeChild(this.firstLine);

            this.prepareStepFour();
        }

    };

    this.undrawSecondLine = function(){
        this.posX -= lineStep;
        this.posY += lineStep;

        if (this.posY < pointSize ){

            this.secondLine.clear();
            this.secondLine.moveTo(0, pointSize);
            this.secondLine.lineTo(this.posX, this.posY);

        } else{

            this.step_four_over = true;
            this.secondLine.clear();
            stage.removeChild(this.secondLine);
        }
    };


    this.prepareStepFour = function(){

        this.secondLine.lineTo(pointSize, 0);
        this.secondLine.moveTo(0, pointSize);

        this.posX = pointSize;
        this.posY = 0;
    };

    this.begin = function(posX, posY, color){
        this.posX = posX;
        this.posY = posY;
        this.secondLine.x = posX;
        this.secondLine.y = posY;

        this.secondLine.lineStyle(4, PIXI.utils.string2hex(color), 1);

        this.firstLine.x = posX;
        this.firstLine.y = posY;
        this.firstLine.lineStyle(4, PIXI.utils.string2hex(color), 1);

        stage.addChild(this.secondLine);
        stage.addChild(this.firstLine);
    };

    this.isDrawn = function(){
        return this.step_two_over;
    }

}

function getOnePoint(){
    return [{"color":"#c99959","position":{"x":"3","y":"3"}}];
}

function getBoatDrawing(){
    return [{"color":"#c99959","position":{"x":"25","y":"7"}},{"color":"#a1e0db","position":{"x":"26","y":"7"}},{"color":"#a1e0db","position":{"x":"27","y":"7"}},{"color":"#c99959","position":{"x":"25","y":"8"}},{"color":"#85bbd9","position":{"x":"26","y":"8"}},{"color":"#a1e0db","position":{"x":"27","y":"8"}},{"color":"#a1e0db","position":{"x":"28","y":"8"}},{"color":"#c99959","position":{"x":"25","y":"9"}},{"color":"#85bbd9","position":{"x":"26","y":"9"}},{"color":"#85bbd9","position":{"x":"27","y":"9"}},{"color":"#a1e0db","position":{"x":"28","y":"9"}},{"color":"#a1e0db","position":{"x":"29","y":"9"}},{"color":"#c99959","position":{"x":"25","y":"10"}},{"color":"#85bbd9","position":{"x":"26","y":"10"}},{"color":"#85bbd9","position":{"x":"27","y":"10"}},{"color":"#85bbd9","position":{"x":"28","y":"10"}},{"color":"#a1e0db","position":{"x":"29","y":"10"}},{"color":"#a1e0db","position":{"x":"30","y":"10"}},{"color":"#c99959","position":{"x":"25","y":"11"}},{"color":"#5da8d3","position":{"x":"26","y":"11"}},{"color":"#85bbd9","position":{"x":"27","y":"11"}},{"color":"#85bbd9","position":{"x":"28","y":"11"}},{"color":"#85bbd9","position":{"x":"29","y":"11"}},{"color":"#a1e0db","position":{"x":"30","y":"11"}},{"color":"#a1e0db","position":{"x":"31","y":"11"}},{"color":"#c99959","position":{"x":"25","y":"12"}},{"color":"#5da8d3","position":{"x":"26","y":"12"}},{"color":"#5da8d3","position":{"x":"27","y":"12"}},{"color":"#85bbd9","position":{"x":"28","y":"12"}},{"color":"#85bbd9","position":{"x":"29","y":"12"}},{"color":"#85bbd9","position":{"x":"30","y":"12"}},{"color":"#a1e0db","position":{"x":"31","y":"12"}},{"color":"#a1e0db","position":{"x":"32","y":"12"}},{"color":"#a1e0db","position":{"x":"33","y":"12"}},{"color":"#c99959","position":{"x":"25","y":"13"}},{"color":"#5da8d3","position":{"x":"26","y":"13"}},{"color":"#5da8d3","position":{"x":"27","y":"13"}},{"color":"#5da8d3","position":{"x":"28","y":"13"}},{"color":"#85bbd9","position":{"x":"29","y":"13"}},{"color":"#85bbd9","position":{"x":"30","y":"13"}},{"color":"#85bbd9","position":{"x":"31","y":"13"}},{"color":"#85bbd9","position":{"x":"32","y":"13"}},{"color":"#a1e0db","position":{"x":"33","y":"13"}},{"color":"#c99959","position":{"x":"25","y":"14"}},{"color":"#5da8d3","position":{"x":"26","y":"14"}},{"color":"#5da8d3","position":{"x":"27","y":"14"}},{"color":"#5da8d3","position":{"x":"28","y":"14"}},{"color":"#5da8d3","position":{"x":"29","y":"14"}},{"color":"#85bbd9","position":{"x":"30","y":"14"}},{"color":"#85bbd9","position":{"x":"31","y":"14"}},{"color":"#85bbd9","position":{"x":"32","y":"14"}},{"color":"#a1e0db","position":{"x":"33","y":"14"}},{"color":"#a1e0db","position":{"x":"34","y":"14"}},{"color":"#c99959","position":{"x":"25","y":"15"}},{"color":"#5da8d3","position":{"x":"26","y":"15"}},{"color":"#5da8d3","position":{"x":"27","y":"15"}},{"color":"#5da8d3","position":{"x":"28","y":"15"}},{"color":"#5da8d3","position":{"x":"29","y":"15"}},{"color":"#5da8d3","position":{"x":"30","y":"15"}},{"color":"#85bbd9","position":{"x":"31","y":"15"}},{"color":"#85bbd9","position":{"x":"32","y":"15"}},{"color":"#85bbd9","position":{"x":"33","y":"15"}},{"color":"#a1e0db","position":{"x":"34","y":"15"}},{"color":"#c99959","position":{"x":"25","y":"16"}},{"color":"#5da8d3","position":{"x":"26","y":"16"}},{"color":"#5da8d3","position":{"x":"27","y":"16"}},{"color":"#5da8d3","position":{"x":"28","y":"16"}},{"color":"#5da8d3","position":{"x":"29","y":"16"}},{"color":"#5da8d3","position":{"x":"30","y":"16"}},{"color":"#85bbd9","position":{"x":"31","y":"16"}},{"color":"#85bbd9","position":{"x":"32","y":"16"}},{"color":"#85bbd9","position":{"x":"33","y":"16"}},{"color":"#a1e0db","position":{"x":"34","y":"16"}},{"color":"#c99959","position":{"x":"25","y":"17"}},{"color":"#5da8d3","position":{"x":"26","y":"17"}},{"color":"#5da8d3","position":{"x":"27","y":"17"}},{"color":"#5da8d3","position":{"x":"28","y":"17"}},{"color":"#5da8d3","position":{"x":"29","y":"17"}},{"color":"#5da8d3","position":{"x":"30","y":"17"}},{"color":"#85bbd9","position":{"x":"31","y":"17"}},{"color":"#85bbd9","position":{"x":"32","y":"17"}},{"color":"#a1e0db","position":{"x":"33","y":"17"}},{"color":"#a1e0db","position":{"x":"34","y":"17"}},{"color":"#c99959","position":{"x":"25","y":"18"}},{"color":"#5da8d3","position":{"x":"26","y":"18"}},{"color":"#5da8d3","position":{"x":"27","y":"18"}},{"color":"#5da8d3","position":{"x":"28","y":"18"}},{"color":"#5da8d3","position":{"x":"29","y":"18"}},{"color":"#85bbd9","position":{"x":"30","y":"18"}},{"color":"#85bbd9","position":{"x":"31","y":"18"}},{"color":"#85bbd9","position":{"x":"32","y":"18"}},{"color":"#a1e0db","position":{"x":"33","y":"18"}},{"color":"#c99959","position":{"x":"25","y":"19"}},{"color":"#5da8d3","position":{"x":"26","y":"19"}},{"color":"#5da8d3","position":{"x":"27","y":"19"}},{"color":"#5da8d3","position":{"x":"28","y":"19"}},{"color":"#5da8d3","position":{"x":"29","y":"19"}},{"color":"#85bbd9","position":{"x":"30","y":"19"}},{"color":"#85bbd9","position":{"x":"31","y":"19"}},{"color":"#85bbd9","position":{"x":"32","y":"19"}},{"color":"#a1e0db","position":{"x":"33","y":"19"}},{"color":"#c99959","position":{"x":"25","y":"20"}},{"color":"#5da8d3","position":{"x":"26","y":"20"}},{"color":"#85bbd9","position":{"x":"27","y":"20"}},{"color":"#85bbd9","position":{"x":"28","y":"20"}},{"color":"#85bbd9","position":{"x":"29","y":"20"}},{"color":"#85bbd9","position":{"x":"30","y":"20"}},{"color":"#85bbd9","position":{"x":"31","y":"20"}},{"color":"#a1e0db","position":{"x":"32","y":"20"}},{"color":"#a1e0db","position":{"x":"33","y":"20"}},{"color":"#c99959","position":{"x":"25","y":"21"}},{"color":"#85bbd9","position":{"x":"26","y":"21"}},{"color":"#85bbd9","position":{"x":"27","y":"21"}},{"color":"#85bbd9","position":{"x":"28","y":"21"}},{"color":"#85bbd9","position":{"x":"29","y":"21"}},{"color":"#85bbd9","position":{"x":"30","y":"21"}},{"color":"#a1e0db","position":{"x":"31","y":"21"}},{"color":"#a1e0db","position":{"x":"32","y":"21"}},{"color":"#c99959","position":{"x":"25","y":"22"}},{"color":"#85bbd9","position":{"x":"26","y":"22"}},{"color":"#85bbd9","position":{"x":"27","y":"22"}},{"color":"#a1e0db","position":{"x":"28","y":"22"}},{"color":"#a1e0db","position":{"x":"29","y":"22"}},{"color":"#a1e0db","position":{"x":"30","y":"22"}},{"color":"#a1e0db","position":{"x":"31","y":"22"}},{"color":"#c99959","position":{"x":"25","y":"23"}},{"color":"#a1e0db","position":{"x":"26","y":"23"}},{"color":"#a1e0db","position":{"x":"27","y":"23"}},{"color":"#a1e0db","position":{"x":"28","y":"23"}},{"color":"#e99c37","position":{"x":"14","y":"24"}},{"color":"#e99c37","position":{"x":"15","y":"24"}},{"color":"#e99c37","position":{"x":"16","y":"24"}},{"color":"#e99c37","position":{"x":"17","y":"24"}},{"color":"#e99c37","position":{"x":"18","y":"24"}},{"color":"#e99c37","position":{"x":"19","y":"24"}},{"color":"#e99c37","position":{"x":"20","y":"24"}},{"color":"#c99959","position":{"x":"25","y":"24"}},{"color":"#e99c37","position":{"x":"14","y":"25"}},{"color":"#df9a3e","position":{"x":"16","y":"25"}},{"color":"#df9a3e","position":{"x":"18","y":"25"}},{"color":"#df9a3e","position":{"x":"20","y":"25"}},{"color":"#c99959","position":{"x":"25","y":"25"}},{"color":"#e99c37","position":{"x":"14","y":"26"}},{"color":"#df9a3e","position":{"x":"16","y":"26"}},{"color":"#df9a3e","position":{"x":"18","y":"26"}},{"color":"#df9a3e","position":{"x":"20","y":"26"}},{"color":"#c99959","position":{"x":"25","y":"26"}},{"color":"#e99c37","position":{"x":"14","y":"27"}},{"color":"#df9a3e","position":{"x":"16","y":"27"}},{"color":"#df9a3e","position":{"x":"18","y":"27"}},{"color":"#df9a3e","position":{"x":"20","y":"27"}},{"color":"#c99959","position":{"x":"25","y":"27"}},{"color":"#c99959","position":{"x":"36","y":"27"}},{"color":"#c99959","position":{"x":"37","y":"27"}},{"color":"#c99959","position":{"x":"38","y":"27"}},{"color":"#df9a3e","position":{"x":"39","y":"27"}},{"color":"#e99c37","position":{"x":"14","y":"28"}},{"color":"#c99959","position":{"x":"15","y":"28"}},{"color":"#c99959","position":{"x":"16","y":"28"}},{"color":"#e99c37","position":{"x":"17","y":"28"}},{"color":"#df9a3e","position":{"x":"18","y":"28"}},{"color":"#df9a3e","position":{"x":"20","y":"28"}},{"color":"#c99959","position":{"x":"25","y":"28"}},{"color":"#c99959","position":{"x":"35","y":"28"}},{"color":"#c99959","position":{"x":"36","y":"28"}},{"color":"#c99959","position":{"x":"37","y":"28"}},{"color":"#c99959","position":{"x":"38","y":"28"}},{"color":"#df9a3e","position":{"x":"39","y":"28"}},{"color":"#d4a45b","position":{"x":"14","y":"29"}},{"color":"#c99959","position":{"x":"15","y":"29"}},{"color":"#c99959","position":{"x":"16","y":"29"}},{"color":"#c99959","position":{"x":"17","y":"29"}},{"color":"#c99959","position":{"x":"18","y":"29"}},{"color":"#c99959","position":{"x":"19","y":"29"}},{"color":"#c99959","position":{"x":"20","y":"29"}},{"color":"#c99959","position":{"x":"25","y":"29"}},{"color":"#c99959","position":{"x":"33","y":"29"}},{"color":"#c99959","position":{"x":"34","y":"29"}},{"color":"#c99959","position":{"x":"35","y":"29"}},{"color":"#e2b674","position":{"x":"36","y":"29"}},{"color":"#e2b674","position":{"x":"37","y":"29"}},{"color":"#e2b674","position":{"x":"38","y":"29"}},{"color":"#c99959","position":{"x":"39","y":"29"}},{"color":"#d4a45b","position":{"x":"14","y":"30"}},{"color":"#c99959","position":{"x":"15","y":"30"}},{"color":"#e2b674","position":{"x":"16","y":"30"}},{"color":"#e2b674","position":{"x":"17","y":"30"}},{"color":"#e2b674","position":{"x":"18","y":"30"}},{"color":"#c99959","position":{"x":"19","y":"30"}},{"color":"#c99959","position":{"x":"20","y":"30"}},{"color":"#c99959","position":{"x":"25","y":"30"}},{"color":"#c99959","position":{"x":"31","y":"30"}},{"color":"#c99959","position":{"x":"32","y":"30"}},{"color":"#c99959","position":{"x":"33","y":"30"}},{"color":"#e2b674","position":{"x":"34","y":"30"}},{"color":"#e2b674","position":{"x":"35","y":"30"}},{"color":"#e2b674","position":{"x":"36","y":"30"}},{"color":"#e2b674","position":{"x":"37","y":"30"}},{"color":"#e2b674","position":{"x":"38","y":"30"}},{"color":"#c99959","position":{"x":"39","y":"30"}},{"color":"#d4a45b","position":{"x":"14","y":"31"}},{"color":"#c99959","position":{"x":"15","y":"31"}},{"color":"#e2b674","position":{"x":"16","y":"31"}},{"color":"#e2b674","position":{"x":"17","y":"31"}},{"color":"#e2b674","position":{"x":"18","y":"31"}},{"color":"#e2b674","position":{"x":"19","y":"31"}},{"color":"#c99959","position":{"x":"20","y":"31"}},{"color":"#c99959","position":{"x":"21","y":"31"}},{"color":"#c99959","position":{"x":"22","y":"31"}},{"color":"#c99959","position":{"x":"25","y":"31"}},{"color":"#c99959","position":{"x":"29","y":"31"}},{"color":"#c99959","position":{"x":"30","y":"31"}},{"color":"#c99959","position":{"x":"31","y":"31"}},{"color":"#e2b674","position":{"x":"32","y":"31"}},{"color":"#e2b674","position":{"x":"33","y":"31"}},{"color":"#e2b674","position":{"x":"34","y":"31"}},{"color":"#e2b674","position":{"x":"35","y":"31"}},{"color":"#e2b674","position":{"x":"36","y":"31"}},{"color":"#e2b674","position":{"x":"37","y":"31"}},{"color":"#e2b674","position":{"x":"38","y":"31"}},{"color":"#c99959","position":{"x":"39","y":"31"}},{"color":"#5069e7","position":{"x":"14","y":"32"}},{"color":"#d4a45b","position":{"x":"15","y":"32"}},{"color":"#d4a45b","position":{"x":"16","y":"32"}},{"color":"#e2b674","position":{"x":"17","y":"32"}},{"color":"#e2b674","position":{"x":"18","y":"32"}},{"color":"#e2b674","position":{"x":"19","y":"32"}},{"color":"#e2b674","position":{"x":"20","y":"32"}},{"color":"#e2b674","position":{"x":"21","y":"32"}},{"color":"#c99959","position":{"x":"22","y":"32"}},{"color":"#c99959","position":{"x":"23","y":"32"}},{"color":"#c99959","position":{"x":"24","y":"32"}},{"color":"#c99959","position":{"x":"25","y":"32"}},{"color":"#c99959","position":{"x":"26","y":"32"}},{"color":"#c99959","position":{"x":"27","y":"32"}},{"color":"#c99959","position":{"x":"28","y":"32"}},{"color":"#c99959","position":{"x":"29","y":"32"}},{"color":"#e2b674","position":{"x":"30","y":"32"}},{"color":"#e2b674","position":{"x":"31","y":"32"}},{"color":"#e2b674","position":{"x":"32","y":"32"}},{"color":"#e2b674","position":{"x":"33","y":"32"}},{"color":"#e2b674","position":{"x":"34","y":"32"}},{"color":"#e2b674","position":{"x":"35","y":"32"}},{"color":"#e2b674","position":{"x":"36","y":"32"}},{"color":"#e2b674","position":{"x":"37","y":"32"}},{"color":"#c99959","position":{"x":"38","y":"32"}},{"color":"#c99959","position":{"x":"39","y":"32"}},{"color":"#5069e7","position":{"x":"14","y":"33"}},{"color":"#d4a45b","position":{"x":"15","y":"33"}},{"color":"#c99959","position":{"x":"16","y":"33"}},{"color":"#e2b674","position":{"x":"17","y":"33"}},{"color":"#e2b674","position":{"x":"18","y":"33"}},{"color":"#e2b674","position":{"x":"19","y":"33"}},{"color":"#e2b674","position":{"x":"20","y":"33"}},{"color":"#e2b674","position":{"x":"21","y":"33"}},{"color":"#e2b674","position":{"x":"22","y":"33"}},{"color":"#e2b674","position":{"x":"23","y":"33"}},{"color":"#e2b674","position":{"x":"24","y":"33"}},{"color":"#e2b674","position":{"x":"25","y":"33"}},{"color":"#e2b674","position":{"x":"26","y":"33"}},{"color":"#e2b674","position":{"x":"27","y":"33"}},{"color":"#e2b674","position":{"x":"28","y":"33"}},{"color":"#e2b674","position":{"x":"29","y":"33"}},{"color":"#e2b674","position":{"x":"30","y":"33"}},{"color":"#e2b674","position":{"x":"31","y":"33"}},{"color":"#e2b674","position":{"x":"32","y":"33"}},{"color":"#e2b674","position":{"x":"33","y":"33"}},{"color":"#e2b674","position":{"x":"34","y":"33"}},{"color":"#e2b674","position":{"x":"35","y":"33"}},{"color":"#e2b674","position":{"x":"36","y":"33"}},{"color":"#c99959","position":{"x":"37","y":"33"}},{"color":"#c99959","position":{"x":"38","y":"33"}},{"color":"#5069e7","position":{"x":"39","y":"33"}},{"color":"#5069e7","position":{"x":"40","y":"33"}},{"color":"#438cdb","position":{"x":"14","y":"34"}},{"color":"#438cdb","position":{"x":"15","y":"34"}},{"color":"#c99959","position":{"x":"16","y":"34"}},{"color":"#c99959","position":{"x":"17","y":"34"}},{"color":"#e2b674","position":{"x":"18","y":"34"}},{"color":"#e2b674","position":{"x":"19","y":"34"}},{"color":"#e2b674","position":{"x":"20","y":"34"}},{"color":"#e2b674","position":{"x":"21","y":"34"}},{"color":"#e2b674","position":{"x":"22","y":"34"}},{"color":"#e2b674","position":{"x":"23","y":"34"}},{"color":"#e2b674","position":{"x":"24","y":"34"}},{"color":"#e2b674","position":{"x":"25","y":"34"}},{"color":"#e2b674","position":{"x":"26","y":"34"}},{"color":"#e2b674","position":{"x":"27","y":"34"}},{"color":"#e2b674","position":{"x":"28","y":"34"}},{"color":"#e2b674","position":{"x":"29","y":"34"}},{"color":"#e2b674","position":{"x":"30","y":"34"}},{"color":"#e2b674","position":{"x":"31","y":"34"}},{"color":"#e2b674","position":{"x":"32","y":"34"}},{"color":"#e2b674","position":{"x":"33","y":"34"}},{"color":"#e2b674","position":{"x":"34","y":"34"}},{"color":"#e2b674","position":{"x":"35","y":"34"}},{"color":"#c99959","position":{"x":"36","y":"34"}},{"color":"#c99959","position":{"x":"37","y":"34"}},{"color":"#5069e7","position":{"x":"38","y":"34"}},{"color":"#5069e7","position":{"x":"39","y":"34"}},{"color":"#5069e7","position":{"x":"40","y":"34"}},{"color":"#5069e7","position":{"x":"41","y":"34"}},{"color":"#fefeff","position":{"x":"13","y":"35"}},{"color":"#438cdb","position":{"x":"14","y":"35"}},{"color":"#438cdb","position":{"x":"15","y":"35"}},{"color":"#438cdb","position":{"x":"16","y":"35"}},{"color":"#c99959","position":{"x":"17","y":"35"}},{"color":"#c99959","position":{"x":"18","y":"35"}},{"color":"#c99959","position":{"x":"19","y":"35"}},{"color":"#e2b674","position":{"x":"20","y":"35"}},{"color":"#e2b674","position":{"x":"21","y":"35"}},{"color":"#e2b674","position":{"x":"22","y":"35"}},{"color":"#e2b674","position":{"x":"23","y":"35"}},{"color":"#e2b674","position":{"x":"24","y":"35"}},{"color":"#e2b674","position":{"x":"25","y":"35"}},{"color":"#e2b674","position":{"x":"26","y":"35"}},{"color":"#e2b674","position":{"x":"27","y":"35"}},{"color":"#e2b674","position":{"x":"28","y":"35"}},{"color":"#e2b674","position":{"x":"29","y":"35"}},{"color":"#e2b674","position":{"x":"30","y":"35"}},{"color":"#e2b674","position":{"x":"31","y":"35"}},{"color":"#e2b674","position":{"x":"32","y":"35"}},{"color":"#c99959","position":{"x":"33","y":"35"}},{"color":"#c99959","position":{"x":"34","y":"35"}},{"color":"#c99959","position":{"x":"35","y":"35"}},{"color":"#c99959","position":{"x":"36","y":"35"}},{"color":"#438cdb","position":{"x":"37","y":"35"}},{"color":"#438cdb","position":{"x":"38","y":"35"}},{"color":"#438cdb","position":{"x":"39","y":"35"}},{"color":"#5069e7","position":{"x":"40","y":"35"}},{"color":"#5069e7","position":{"x":"41","y":"35"}},{"color":"#fefeff","position":{"x":"12","y":"36"}},{"color":"#438cdb","position":{"x":"14","y":"36"}},{"color":"#438cdb","position":{"x":"15","y":"36"}},{"color":"#438cdb","position":{"x":"16","y":"36"}},{"color":"#438cdb","position":{"x":"17","y":"36"}},{"color":"#438cdb","position":{"x":"18","y":"36"}},{"color":"#c99959","position":{"x":"19","y":"36"}},{"color":"#c99959","position":{"x":"20","y":"36"}},{"color":"#c99959","position":{"x":"21","y":"36"}},{"color":"#c99959","position":{"x":"22","y":"36"}},{"color":"#c99959","position":{"x":"23","y":"36"}},{"color":"#c99959","position":{"x":"24","y":"36"}},{"color":"#c99959","position":{"x":"25","y":"36"}},{"color":"#c99959","position":{"x":"26","y":"36"}},{"color":"#c99959","position":{"x":"27","y":"36"}},{"color":"#c99959","position":{"x":"28","y":"36"}},{"color":"#c99959","position":{"x":"29","y":"36"}},{"color":"#c99959","position":{"x":"30","y":"36"}},{"color":"#c99959","position":{"x":"31","y":"36"}},{"color":"#c99959","position":{"x":"32","y":"36"}},{"color":"#c99959","position":{"x":"33","y":"36"}},{"color":"#438cdb","position":{"x":"34","y":"36"}},{"color":"#438cdb","position":{"x":"35","y":"36"}},{"color":"#438cdb","position":{"x":"36","y":"36"}},{"color":"#438cdb","position":{"x":"37","y":"36"}},{"color":"#438cdb","position":{"x":"38","y":"36"}},{"color":"#438cdb","position":{"x":"39","y":"36"}},{"color":"#5069e7","position":{"x":"40","y":"36"}},{"color":"#5069e7","position":{"x":"41","y":"36"}},{"color":"#fefeff","position":{"x":"11","y":"37"}},{"color":"#fefeff","position":{"x":"12","y":"37"}},{"color":"#438cdb","position":{"x":"14","y":"37"}},{"color":"#438cdb","position":{"x":"15","y":"37"}},{"color":"#5da8d3","position":{"x":"16","y":"37"}},{"color":"#5da8d3","position":{"x":"17","y":"37"}},{"color":"#438cdb","position":{"x":"18","y":"37"}},{"color":"#438cdb","position":{"x":"19","y":"37"}},{"color":"#438cdb","position":{"x":"20","y":"37"}},{"color":"#c99959","position":{"x":"21","y":"37"}},{"color":"#c99959","position":{"x":"22","y":"37"}},{"color":"#c99959","position":{"x":"23","y":"37"}},{"color":"#c99959","position":{"x":"24","y":"37"}},{"color":"#c99959","position":{"x":"25","y":"37"}},{"color":"#c99959","position":{"x":"26","y":"37"}},{"color":"#c99959","position":{"x":"27","y":"37"}},{"color":"#c99959","position":{"x":"28","y":"37"}},{"color":"#c99959","position":{"x":"29","y":"37"}},{"color":"#c99959","position":{"x":"30","y":"37"}},{"color":"#c99959","position":{"x":"31","y":"37"}},{"color":"#c99959","position":{"x":"32","y":"37"}},{"color":"#c99959","position":{"x":"33","y":"37"}},{"color":"#438cdb","position":{"x":"34","y":"37"}},{"color":"#438cdb","position":{"x":"35","y":"37"}},{"color":"#438cdb","position":{"x":"36","y":"37"}},{"color":"#5da8d3","position":{"x":"37","y":"37"}},{"color":"#5da8d3","position":{"x":"38","y":"37"}},{"color":"#5da8d3","position":{"x":"39","y":"37"}},{"color":"#5da8d3","position":{"x":"40","y":"37"}},{"color":"#5da8d3","position":{"x":"41","y":"37"}},{"color":"#fefeff","position":{"x":"10","y":"38"}},{"color":"#fefeff","position":{"x":"11","y":"38"}},{"color":"#5069e7","position":{"x":"14","y":"38"}},{"color":"#438cdb","position":{"x":"15","y":"38"}},{"color":"#438cdb","position":{"x":"16","y":"38"}},{"color":"#5da8d3","position":{"x":"17","y":"38"}},{"color":"#5da8d3","position":{"x":"18","y":"38"}},{"color":"#5da8d3","position":{"x":"19","y":"38"}},{"color":"#5da8d3","position":{"x":"20","y":"38"}},{"color":"#5da8d3","position":{"x":"21","y":"38"}},{"color":"#5da8d3","position":{"x":"22","y":"38"}},{"color":"#5da8d3","position":{"x":"23","y":"38"}},{"color":"#5da8d3","position":{"x":"24","y":"38"}},{"color":"#5da8d3","position":{"x":"25","y":"38"}},{"color":"#5da8d3","position":{"x":"26","y":"38"}},{"color":"#5da8d3","position":{"x":"27","y":"38"}},{"color":"#5da8d3","position":{"x":"28","y":"38"}},{"color":"#5da8d3","position":{"x":"29","y":"38"}},{"color":"#5da8d3","position":{"x":"30","y":"38"}},{"color":"#5da8d3","position":{"x":"31","y":"38"}},{"color":"#5da8d3","position":{"x":"32","y":"38"}},{"color":"#5da8d3","position":{"x":"33","y":"38"}},{"color":"#5da8d3","position":{"x":"34","y":"38"}},{"color":"#5da8d3","position":{"x":"35","y":"38"}},{"color":"#5da8d3","position":{"x":"36","y":"38"}},{"color":"#5da8d3","position":{"x":"37","y":"38"}},{"color":"#438cdb","position":{"x":"38","y":"38"}},{"color":"#438cdb","position":{"x":"39","y":"38"}},{"color":"#438cdb","position":{"x":"40","y":"38"}},{"color":"#438cdb","position":{"x":"41","y":"38"}},{"color":"#fefeff","position":{"x":"10","y":"39"}},{"color":"#5069e7","position":{"x":"14","y":"39"}},{"color":"#438cdb","position":{"x":"15","y":"39"}},{"color":"#438cdb","position":{"x":"16","y":"39"}},{"color":"#438cdb","position":{"x":"17","y":"39"}},{"color":"#438cdb","position":{"x":"18","y":"39"}},{"color":"#438cdb","position":{"x":"19","y":"39"}},{"color":"#438cdb","position":{"x":"20","y":"39"}},{"color":"#438cdb","position":{"x":"21","y":"39"}},{"color":"#438cdb","position":{"x":"22","y":"39"}},{"color":"#438cdb","position":{"x":"23","y":"39"}},{"color":"#438cdb","position":{"x":"24","y":"39"}},{"color":"#438cdb","position":{"x":"25","y":"39"}},{"color":"#438cdb","position":{"x":"26","y":"39"}},{"color":"#438cdb","position":{"x":"27","y":"39"}},{"color":"#438cdb","position":{"x":"28","y":"39"}},{"color":"#438cdb","position":{"x":"29","y":"39"}},{"color":"#438cdb","position":{"x":"30","y":"39"}},{"color":"#438cdb","position":{"x":"31","y":"39"}},{"color":"#438cdb","position":{"x":"32","y":"39"}},{"color":"#438cdb","position":{"x":"33","y":"39"}},{"color":"#438cdb","position":{"x":"34","y":"39"}},{"color":"#438cdb","position":{"x":"35","y":"39"}},{"color":"#438cdb","position":{"x":"36","y":"39"}},{"color":"#438cdb","position":{"x":"37","y":"39"}},{"color":"#438cdb","position":{"x":"38","y":"39"}},{"color":"#438cdb","position":{"x":"39","y":"39"}},{"color":"#438cdb","position":{"x":"40","y":"39"}},{"color":"#438cdb","position":{"x":"41","y":"39"}}];
}
