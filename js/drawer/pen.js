function Pen() {
    var pens = new Array();
    var color = "#000000";
    var lineArt = "round";
    var width = 15;
    var changePen = false;
    var currentDrawingFunction = 0;
    var currentPen = 0;
    var drawingFunctions = new Array();


    this.init = function() {
        var colorPicker = document.getElementById("colorPicker");
        var strokePicker = document.getElementById("strokePicker");
        var widthPicker = document.getElementById("widthPicker");

        Interaction.addOnChangeListener.apply(colorPicker, [setColor]); 
        Interaction.addOnChangeListener.apply(strokePicker, [setLineArt]);
        Interaction.addOnChangeListener.apply(widthPicker, [setLineWidth]);

        initDrawingFunctions();

        var applyElement = document.getElementById("penSelector");

        for (var i = 0; i < drawingFunctions.length; i++) {
            var ele = document.createElement("a");
            var number = i;
            var textNote = document.createTextNode(drawingFunctions[i].name);
            ele.appendChild(textNote);
            ele.setAttribute("id", "pen"+i);
            ele.setAttribute("href", "#");
            applyElement.appendChild(ele);
            ele.addEventListener("click", function(e) {
                setDrawingFunction(e.target.attributes.id.value);
            });
        };


        pens[currentPen] = {
            strokeStyle : color,
            lineJoin : lineArt,
            lineWidth : width,
            drawingFunction : drawingFunctions[0].function
        };
        HelpFunction.toggleClassName(document.getElementById("pen0"), true, "active");

    }

    function initDrawingFunctions() {

        drawingFunctions[0] = {};
        drawingFunctions[0].name = "Standart Maler";
        drawingFunctions[0].function = function(ctx, clickX, clickY, clickDrag, i) {
            ctx.beginPath();
            if(clickDrag[i] && i) {
                ctx.moveTo(clickX[i-1], clickY[i-1]);
            }
            else {
                ctx.moveTo(clickX[i] -1, clickY[i]);
            }
            ctx.lineTo(clickX[i], clickY[i]);
            ctx.closePath();
            ctx.stroke();
        };


        drawingFunctions[1] = {};
        drawingFunctions[1].name = "Random Maler";
        drawingFunctions[1].function = function(ctx, clickX, clickY, clickDrag, i) {
            
            for (var j = -(ctx.lineWidth / 2); j < (ctx.lineWidth / 2); j+= 4) {
                for (var k = -(ctx.lineWidth / 2); k < (ctx.lineWidth / 2); k+= 4) {
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 
                                         'light-blue', 'blue', 'purple'][HelpFunction.getRandomInt(0,6)];
                        ctx.fillRect(clickX[i]+j, clickY[i]+k, 4, 4);
                    }
                }
            }
        };


        drawingFunctions[2] = {};
        drawingFunctions[2].name = "Random Maler";
        drawingFunctions[2].function = function(ctx, clickX, clickY, clickDrag, i) {
            
            for (var j = -(ctx.lineWidth / 2); j < (ctx.lineWidth / 2); j+= 4) {
                for (var k = -(ctx.lineWidth / 2); k < (ctx.lineWidth / 2); k+= 4) {
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = ['red', 'orange', 'yellow', 'green', 
                                         'light-blue', 'blue', 'purple'][HelpFunction.getRandomInt(0,6)];
                        ctx.fillRect(clickX[i]+j, clickY[i]+k, 4, 4);
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

    function setDrawingFunction(id) {
        var i = parseInt(id.replace("pen", ""));
        if (currentDrawingFunction != i)
        {   
            currentDrawingFunction = i;
            changePen = true;

            var prePen = document.querySelector(".active");
            if(prePen != null)
                HelpFunction.toggleClassName(prePen, false, "active");

            HelpFunction.toggleClassName(document.getElementById(id), true, "active");
        }
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
            drawingFunction : drawingFunctions[currentDrawingFunction].function
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
                drawingFunction : drawingFunctions[currentDrawingFunction].function
            };
            changePen = false;
        }
        return currentPen;
    };


    this.getDrawingFunction = function(i) {
        return drawingFunction[i].function;
    }


    return this.init();
}