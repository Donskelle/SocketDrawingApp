"use strict";
function Canvas(_optionsPara) {
	var options = {
		width: 1000,
		height: 600,
		background: "white",
		backgroundImage: null,
		canvasWrapper: "canvasWrapper",
                revertLink: "revert"
	};
	options = HelpFunction.merge(options, _optionsPara);
	
        var offset = {};
        var arrayCanvas = new Array();
	//var canvas, ctx;
        var clickX = new Array();
        var clickY = new Array();
        var clickDrag = new Array();
        var pens = new Array();

        var penManager = new Pen();

        

        this.setPen = function(penNumber, canvasId) {
                if(arrayCanvas[canvasId].currentPen == penNumber)
                        return;

                
                var options = penManager.getPen(penNumber);
                arrayCanvas[canvasId].ctx.strokeStyle = options.strokeStyle;
                arrayCanvas[canvasId].ctx.lineJoin = options.lineJoin;
                arrayCanvas[canvasId].ctx.lineWidth =  options.lineWidth;

                arrayCanvas[canvasId].currentPen = penNumber;

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
                        console.log((Math.floor(clickX.length / 500) + 1) + " deleteCanvas " + arrayCanvas.length);
                        console.log("deleteCanvas");



                        var test = deleteCanvas();
                }

                console.log(clickX.length);
                this.draw();
        }


        this.addClick = function(x, y, dragging) {
                setX( x - offset.X );
                setY( y - offset.Y );
                clickDrag.push(dragging);

                pens.push(penManager.getCurrentNumber());
                console.log(clickX.length);
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
                        arrayCanvas[canvasToDraw].ctx.beginPath();

                        this.setPen( pens[i], canvasToDraw);

                        if(clickDrag[i] && i) {
                                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i-1], clickY[i-1]);
                        }
                        else {
                                arrayCanvas[canvasToDraw].ctx.moveTo(clickX[i] -1, clickY[i]);
                        }
                        arrayCanvas[canvasToDraw].ctx.lineTo(clickX[i], clickY[i]);
                        arrayCanvas[canvasToDraw].ctx.closePath();
                        arrayCanvas[canvasToDraw].ctx.stroke();
                };
        }

	this.init = function() {
                var paint = false;
                var that = this;
                
                addCanvas(0);

                offsetWrapper();

        	window.addEventListener('resize', function() {
                        offsetWrapper();
                }, true);


                var revertLink = document.getElementById(options.revertLink);
                Interaction.addClickListener.apply(revertLink, [function (e) {
                        that.revert();
                }]);


                var canvasWrapper = document.getElementById(options.canvasWrapper);

                Interaction.addMouseDownListener.apply(canvasWrapper, [function (e) {
                        that.addClick(e.x, e.y, false);
                        that.draw();
                        paint = true;
                }]);


                Interaction.addMouseMoveListener.apply(canvasWrapper, [function (e) {
                        if(paint)
                        {
                                that.addClick(e.x, e.y, true);
                                that.draw();
                        }
                }]);

                Interaction.addClickListener.apply(canvasWrapper, [function (e) {
                        paint = false;
                }]);

                Interaction.addMouseLeaveListener.apply(canvasWrapper, [function (e) {
                        paint = false;
                }]);
        }

        var drawDefaults = function(i) {
        	arrayCanvas[i].ctx.clearRect(0, 0, options.width, options.height);

        	if(options.backgroundImage != null && i == 0)
                {
                        arrayCanvas[i].ctx.drawImage(options.backgroundImage, 0, 0, options.width, options.heigt);
                }
        };


        var offsetWrapper = function() {
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
        }

        var deleteCanvas = function() {
                var i = arrayCanvas.length - 1;
                var canvas = arrayCanvas[i].canvas;
                canvas.parentNode.removeChild(canvas);;

                arrayCanvas.pop();
        }


	return this.init();
}