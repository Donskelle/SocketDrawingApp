"use strict";
function Canvas(_optionsPara) {
	var options = {
		width: 600,
		height: 400,
		background: "white",
		backgroundImage: null,
		id: "canvas"
	};
	options = HelpFunction.merge(options, _optionsPara);
	
        var offset = {};
	var canvas, ctx;
        var clickX = new Array();
        var clickY = new Array();
        var clickDrag = new Array();
        var penStyle = new Array();

        var pen = new Pen;

        this.Pen = function() {
                var pens = new Array();
                var color = "#fff";
                var lineArt = "round";
                var width = 15;
                var changePen = false;
                var currentPen = 0;

                (function init() {
                        pens[currentPen] = {
                                strokeStyle : color,
                                lineJoin : lineArt,
                                lineWidth : width
                        };
                })();
                (function() {
                        this.setColor = function(paraColor) {
                                color = paraColor;
                                changePen = true;
                        };
                        this.setLineArt = function(paraLineArt) {
                                lineJoin = paraLineArt;
                                changePen = true;
                        };
                        this.setLineWidth = function(paraLineWidth) {
                                width = paraLineWidth;
                                changePen = true;
                        };
                        this.getPen = function (i) {
                                if (typeof i != "undefined" ) {
                                        return pen[i];
                                }
                                else if (changePen === true)
                                {
                                        pens[currentPen++] = {
                                                strokeStyle : color,
                                                lineJoin : lineArt,
                                                lineWidth : width
                                        };
                                        changePen = false;
                                        return pens[currentPen];
                                }
                                return {}
                        };
                        this.getCurrentNumber = function() {
                                return currentPen;
                        };
                }).call(Pen.prototype);
        }

        this.setPen = function(pen) {
                // Clears the canvas
                var options = pen.getPen(pen);
                /*ctx.strokeStyle = "#dag231";
                ctx.lineJoin = "round";
                ctx.lineWidth = 5;*/
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
                this.draw();
        }


        this.addClick = function(x, y, dragging) {
                self.setX( x - offset.X );
                self.setY( y - offset.Y );
                clickDrag.push(dragging);
                penStyle.push(pen.getCurrentNumber);
        }


        this.draw = function(pen) {
                self.drawDefaults();

                if (typeof pen != "undefined")
                        this.setPen( pen );

                for (var i = 0; i < clickX.length; i++) {
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
        }

	var self = {
                init : function() {
                	canvas = document.getElementById(options.id);
                	ctx = canvas.getContext('2d');

                	canvas.width = options.width;
                	//canvas.style.width = options.width + "px";
                	canvas.height = options.height;
                	//canvas.style.height = options.height + "px";
                	self.drawDefaults();
        		self.offsetCanvas();


                	window.addEventListener('resize', function() {
                		self.offsetCanvas();
        		    }, true);
                },

                drawDefaults : function() {
                	ctx.clearRect(0, 0, canvas.width, canvas.height);

                	if(options.backgroundImage != null)
                        {
                                ctx.drawImage(options.backgroundImage, 0, 0, options.width, options.heigt);
                        }
                },
        	offsetCanvas: function() { 
                	canvas.style.marginTop = ((window.innerHeight - canvas.height) / 2) + "px";
                        offset.X = canvas.offsetLeft;
                        offset.Y = canvas.offsetTop;
                },

                setX : function (x) {
                        clickX.push(x);
                },

                setY : function(y) {
                        clickY.push(y);
                }
	};
	return self.init();

}