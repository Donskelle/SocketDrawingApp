"use strict";

function Canvas(options) {
	var offset = {};
    var arrayCanvas = new Array();

    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var pens = new Array();

    var penManager = new Pen();


    this.init = function() {
        
    	addCanvas();

        this.offsetWrapper();
        return this;
    }


    this.setPen = function(penNumber, canvasId) {
        if(arrayCanvas[canvasId].currentPen == penNumber)
            return;

        
        var options = penManager.getPen(penNumber);
        arrayCanvas[canvasId].ctx.strokeStyle = options.strokeStyle;
        arrayCanvas[canvasId].ctx.lineJoin = options.lineJoin;
        arrayCanvas[canvasId].ctx.lineWidth =  options.lineWidth;
        arrayCanvas[canvasId].ctx.lineCap = 'round';

        arrayCanvas[canvasId].currentPen = penNumber;
        arrayCanvas[canvasId].drawFunction = options.drawingFunction;

        console.log(arrayCanvas[canvasId].drawFunction);
    }


    this.rebuild = function(_optionsPara) {
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
        pens.length = 0;
        options = _optionsPara;

        penManager.rebuild();

        while (arrayCanvas.length != 0)
        {
            deleteCanvas();
        }


        if(options.backgroundImage != null && options.backgroundImage != "")
        {
            var that = this;
            var input =  document.getElementById("fileUpload");

            var fReader = new FileReader();
            fReader.readAsDataURL(input.files[0]);
            fReader.onloadend = function(event){
                options.backgroundImage = new Image();
                options.backgroundImage.src = event.target.result;
                
                addCanvas();
                that.offsetWrapper();
            }
        }
        else {
            addCanvas(); 
            this.offsetWrapper();
        }
    }

    this.revert = function() {
        if(clickDrag[clickDrag.length - 1 ] == true)
        {
            while(clickDrag[clickDrag.length - 1] == true) {
                clickX.pop();
                clickY.pop();
                clickDrag.pop();
            }
            // 1. Click der Move Bewegung wird nicht als Drag interpretiert
            // Deshalb wird es hier zusätzlich zum Drag entfernt
            clickX.pop();
            clickY.pop();
            clickDrag.pop();

        }
        else {
            clickX.pop();
            clickY.pop();
            clickDrag.pop();
        }

        //
        while((Math.floor(clickX.length / 500) + 1) < arrayCanvas.length) {
            deleteCanvas();
        }
        this.draw();
    }

    this.addClick = function(x, y, dragging) {
        setX( x - offset.X );
        setY( y - offset.Y );
        clickDrag.push(dragging);

        pens.push(penManager.getCurrentNumber());

        //console.log(clickX.length);
        // Jedes Mal wenn 500 Schritte gezeichnet wurden, wird ein neues Canvas erstellt, um die Rechenoperatinen zu minimieren.
        if (clickX.length % 500 == 0)
        {
            addCanvas();
        }
    }

    this.draw = function() {
        var canvasToDraw = Math.floor(clickX.length/500);

        drawDefaults(canvasToDraw);

        for (var i = canvasToDraw * 500; i < clickX.length; i++) {
            this.setPen( pens[i], canvasToDraw);

            var drawF = function() {
                eval(arrayCanvas[canvasToDraw].drawFunction);
            };
            drawF();

            //drawFunction.call(this);
            /*arrayCanvas[canvasToDraw].ctx.beginPath();

            if(clickDrag[i] && i) {
                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i-1], clickY[i-1]);
            }
            else {
                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i] -1, clickY[i]);
            }
            arrayCanvas[canvasToDraw].ctx.lineTo(clickX[i], clickY[i]);
            arrayCanvas[canvasToDraw].ctx.closePath();
            arrayCanvas[canvasToDraw].ctx.stroke();*/
        };
    }

    this.save = function() {
        var images = [];


        for (var i = 0; i < arrayCanvas.length; i++) {
            images[i] = arrayCanvas[i].canvas.toDataURL('image/png');
        };

        addCanvas();
        var canvas = arrayCanvas[arrayCanvas.length - 1];

        for (var i = 0; i < images.length; i++) {
            var img = new Image();
            img.src = images[i];
            
            canvas.ctx.drawImage(img, 0, 0);
        };


        var downloadImage = canvas.canvas.toDataURL('image/png');
        return downloadImage;
    }

    var drawDefaults = function(i) {
    	arrayCanvas[i].ctx.clearRect(0, 0, options.width, options.height);

    	if(options.backgroundImage != null && options.backgroundImage != "" && i == 0)
        {
            arrayCanvas[i].ctx.drawImage(options.backgroundImage, 0, 0, options.width, options.height);        
        }
    };


    this.offsetWrapper = function() {
        var wrapper = document.getElementById(options.canvasWrapper);

        wrapper.style.marginTop = ((window.innerHeight - options.height) / 2) + "px";

        offset.Y = wrapper.offsetTop;
        offset.X = wrapper.offsetLeft;
    };


    var setX = function (x) {
        clickX.push(x);
    };


    var setY = function(y) {
        clickY.push(y);
    };


    var addCanvas = function() {
        var i = arrayCanvas.length;
        var canv = document.createElement('canvas');
        canv.id = 'canvas_' + i;

        document.getElementById(options.canvasWrapper).style.width = options.width + "px";
        document.getElementById(options.canvasWrapper).appendChild(canv);
        arrayCanvas[i] = {};
        arrayCanvas[i].canvas = canv;
        arrayCanvas[i].ctx = canv.getContext('2d');
        arrayCanvas[i].currentPen = null;

        canv.width = options.width;
        //canvas.style.width = options.width + "px";
        canv.height = options.height;
        if(i != 0)
            canv.style.marginTop = "-" + options.height + "px";
        //canvas.style.height = options.height + "px";
        drawDefaults(i);
    };

    var deleteCanvas = function() {
        var i = arrayCanvas.length - 1;
        var canvas = arrayCanvas[i].canvas;
        canvas.parentNode.removeChild(canvas);;

        arrayCanvas.pop();
    };

    return this.init();
}