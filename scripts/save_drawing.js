

const whiteColor = '#fffefe';


let drawingColor = whiteColor;
let enableDrawing = false;
let enableRubber = false;

$(function() {

    tableCreate(55, 40);
    initColorPicker();
    initDrawingMouse();
    initSaveButton();

    $('#submit-values').click(function () {
        $('table').remove();
       tableCreate($('#drawing-width').val(), $('#drawing-height').val());
        initDrawingMouse();

    });
});

function initSaveButton() {
    $('.save-drawing').click(function () {

    })
}

function initRubberButton(){
    $('#enable-rubber').click(function () {
       enableRubber = !enableRubber;
    });
}
function initColorPicker(){
    AColorPicker.from('div.drawing-color')
        .on('change', (picker, color) => {


            drawingColor = (!enableRubber) ? picker.color : whiteColor;
            console.log('couleur pour dessiner : ' + drawingColor);
        })
}
function initDrawingMouse(){

    $('body').keyup(function (e) {
        if ( event.which === 16 ) {

            enableDrawing = !enableDrawing;

            if (enableDrawing){
                $( "td" ).mousemove(function( e ) {

                    $(this).css('background-color', drawingColor);
                    console.log($(this).attr('posX'));
                    console.log($(this).attr('posY'));
                });
            }else{
                $('td').unbind("mousemove");
            }

        }else if(event.which === 13){
            getJsonFromTable();
        }
    });

}



function tableCreate(width, height) {

    var tbl = $('<table>');
    tbl.width = '100%';
    tbl.attr('border', '1');
    var tbdy = $('<tbody>');
    for (var i = 0; i < height; i++) {
        var tr = document.createElement('tr');

        for (var j = 0; j < width; j++) {

                let td = document.createElement('td');

                // Ajoute les coordonnées en tant qu'attributs html
                td.setAttribute('posX', j.toString());
                td.setAttribute('posY', i.toString());
                td.style.backgroundColor = whiteColor;


            td.append(document.createTextNode('\u0020'));
                tr.appendChild(td);
        }
        tbdy.append(tr);
    }
    tbl.append(tbdy);
    $('.drawing').append(tbl);
}

function getJsonFromTable() {
    let crossStitchArray = [];
    let jsonObject;
    $('td').each(function(){

        if (rgb2hex($(this).css('background-color')) !== whiteColor){
            jsonObject = {
                'color' : rgb2hex($(this).css('background-color')),
                'position' : {
                    'x' : $(this).attr('posX'),
                    'y' : $(this).attr('posY'),
                }
            };
            crossStitchArray.push(jsonObject);
        }
    });
    $('.draw-json').html(JSON.stringify(crossStitchArray));

}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}