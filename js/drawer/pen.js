function Pen() {
    var pens = new Array();
    var color = "#000000";
    var lineArt = "round";
    var width = 15;
    var changePen = false;
    var currentDrawingFunction = 0;
    var currentPen = 0;
    var drawingFunctions = new Array();


    


    //drawingFunctions[0] = function () {
    //
    //}


    this.init = function() {
        var colorPicker = document.getElementById("colorPicker");
        var strokePicker = document.getElementById("strokePicker");
        var widthPicker = document.getElementById("widthPicker");

        Interaction.addOnChangeListener.apply(colorPicker, [setColor]); 
        Interaction.addOnChangeListener.apply(strokePicker, [setLineArt]);
        Interaction.addOnChangeListener.apply(widthPicker, [setLineWidth]);

        initDrawingFunctions();


        pens[currentPen] = {
            strokeStyle : color,
            lineJoin : lineArt,
            lineWidth : width,
            drawingFunction : drawingFunctions[0]
        };
    }

    function initDrawingFunctions() {
        drawingFunctions[0] = "\
            arrayCanvas[canvasToDraw].ctx.beginPath();\
            if(clickDrag[i] && i) {\
                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i-1], clickY[i-1]);\
            }\
            else {\
                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i] -1, clickY[i]);\
            }\
            arrayCanvas[canvasToDraw].ctx.lineTo(clickX[i], clickY[i]);\
            arrayCanvas[canvasToDraw].ctx.closePath();\
            arrayCanvas[canvasToDraw].ctx.stroke()";

        drawingFunctions[1] = function(ctx, x, y) {
            for (var i = -10; i < 10; i+= 4) {
                for (var j = -10; j < 10; j+= 4) {
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 
                                         'light-blue', 'blue', 'purple'][HelpFunction.getRandomInt(0,6)];
                        ctx.fillRect(x+i, y+j, 4, 4);
                    }
                }
            }
        };
    }
        

   	
    function setColor (paraColor) {
    	// Wenn durch das Change Event ausgelöst wird, wird der Wert aus dem colorPicker genommen.
    	if(typeof paraColor === "object")
    		color = colorPicker.value;
        else
        	color = paraColor;

        changePen = true;
    };


    function setLineArt (paraLineArt) {
    	if(typeof paraLineArt === "object")
    		lineArt = strokePicker.value;
    	else 
        	lineArt = paraLineArt;

        changePen = true;
    };


    function setLineWidth (paraLineWidth) {
    	if(typeof paraLineWidth === "object")
    		width = widthPicker.value;
        else
			width = paraLineWidth;

        changePen = true;
    };

    function setDrawingFunction(paraDrawingFunction) {
        if(typeof paraDrawingFunction === "object")
            width = widthPicker.value;
        else
            width = paraDrawingFunction;

        changePen = true;
    }


    this.getPen = function(i) {
        return pens[i];
    };

    this.rebuild = function() {
        pens.length = 0;
        currentPen = 0;

        pens[currentPen] = {
            strokeStyle : setColor({}),
            lineJoin : setLineArt({}),
            lineWidth : setLineWidth({}),
            drawingFunction : drawingFunctions[0]
        };

    }
    

    this.getCurrentNumber = function() {
        if (changePen === true)
        {
        	currentPen = currentPen + 1;

            pens[currentPen] = {
                strokeStyle : color,
                lineJoin : lineArt,
                lineWidth : width,
                drawingFunction : drawingFunctions[0]
            };
            changePen = false;
        }
        return currentPen;
    };


    this.getDrawingFunction = function(i) {
        return drawingFunction[i];
    }


    return this.init();
}