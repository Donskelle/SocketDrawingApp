"use strict";
/**
 * [Pen description]
 * Erstellt Dom Elemente für Stifte und legt Klickfunktionen für diese ab.
 * Außerdem speichert es Stifte ab, um später darauf zugreifen zu können.
 */
function Pen() {
    var pens = new Array();
    var color = "#000000";
    var lineArt = "round";
    var width = 15;
    var changePen = false;
    var currentDrawingFunction = 0;
    var currentPen = 0;
    var drawingFunctions = new Array();

    // Stift werden initzialisiert und zur Dom hinzugefügt
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
            drawingFunction : drawingFunctions[currentDrawingFunction].function,
            drawingFunctionsI : currentDrawingFunction
        };
        HelpFunction.toggleClassName(document.getElementById("pen0"), true, "active");
    }

    /**
     * [getFunction description]
     * Fragt die Function einer MalOperation ab
     * @param  {[type]} i [description]
     * Index der Maloperation
     * @return {[function]}   [description]
     */
    this.getFunction = function(i) {
        return drawingFunctions[i].function;
    }

    /**
     * [initDrawingFunctions description]
     * Erstellt Mal Operationen 
     */
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
        drawingFunctions[2].name = "Spray";
        drawingFunctions[2].function = function(ctx, clickX, clickY, clickDrag, i) {
            /**
             * Malt 50 zufällige Punkte
             */
            for (var j = 50; j--; ) {
                var radius = ctx.lineWidth/2;
                var offsetX = HelpFunction.getRandomInt(-radius, radius);
                var offsetY = HelpFunction.getRandomInt(-radius, radius);
                ctx.fillStyle = ctx.strokeStyle;
                ctx.fillRect(clickX[i] + offsetX, clickY[i] + offsetY, 1, 1);
            }
        };

        drawingFunctions[3] = {};
        drawingFunctions[3].name = "Radierer";
        drawingFunctions[3].function = function(ctx, clickX, clickY, clickDrag, i) {
            ctx.strokeStyle = "white";
            drawingFunctions[0].function(ctx, clickX, clickY, clickDrag, i);
        };


    }
   	
    /**
     * [setColor description]
     * Setzt Color des Stiftes
     * @param {[type]} paraColor [description]
     */
    function setColor (paraColor) {
    	// Wenn durch das Change Event ausgelöst wird, wird der Wert aus dem colorPicker genommen.
    	if(typeof paraColor === "object")
    		color = colorPicker.value;
        else
        	color = paraColor;

        changePen = true;
    };

    /**
     * [setLineArt description]
     * Setzt Linienart des Stiftes
     * @param {[type]} paraLineArt [description]
     */
    function setLineArt (paraLineArt) {
        // Wenn durch das Change Event ausgelöst wird, wird der Wert aus dem colorPicker genommen.
    	if(typeof paraLineArt === "object")
    		lineArt = strokePicker.value;
    	else 
        	lineArt = paraLineArt;

        changePen = true;
    };

    /**
     * [setLineWidth description]
     * Setzt Linien Breite
     * @param {[type]} paraLineWidth [description]
     */
    function setLineWidth (paraLineWidth) {
        // Wenn durch das Change Event ausgelöst wird, wird der Wert aus dem colorPicker genommen.
    	if(typeof paraLineWidth === "object")
    		width = widthPicker.value;
        else
			width = paraLineWidth;

        changePen = true;
    };

    /**
     * [setDrawingFunction description]
     * Setzt eine neue Mal Operation mit der entsprechenden id
     * @param {[int]} id [description]
     */
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

    /**
     * [getPen description]
     * Gibt Stift zurück
     * @param  {[int]} i [description]
     * Index des Stiftes
     * @return {[object]}   [description]
     */
    this.getPen = function(i) {
        return pens[i];
    };

    /**
     * [rebuild description]
     * Pen wird zurückgesetzt
     * @return {[type]} [description]
     */
    this.rebuild = function() {
        pens.length = 0;
        currentPen = 0;

        pens[currentPen] = {
            strokeStyle : setColor({}),
            lineJoin : setLineArt({}),
            lineWidth : setLineWidth({}),
            drawingFunction : drawingFunctions[currentDrawingFunction].function,
            drawingFunctionsI : currentDrawingFunction
        };
    }

    /**
     * [addPen description]
     * Stift hinzufügen
     * @param {[string]} _strokeStyle      [description]
     * @param {[string]} _lineJoin         [description]
     * @param {[string]} _lineWidth        [description]
     * @param {[string]} _drawingFunctions [description]
     */
    this.addPen = function(_strokeStyle, _lineJoin, _lineWidth, _drawingFunctions) {
        currentPen = pens.length;
        
        pens[currentPen] = {
            strokeStyle : _strokeStyle,
            lineJoin : _lineJoin,
            lineWidth : _lineWidth,
            drawingFunction : drawingFunctions[_drawingFunctions].function,
            drawingFunctionsI : _drawingFunctions
        };

        return currentPen;
    }

    /**
     * [getCurrentNumber description]
     * Aktuelle Nummer des Stiftes abfragen. Dient dazu nicht jedes Mal ein neues Objekt erstellen zu müssen
     * @return {[int]} [description]
     * index des aktuellen Stiftes
     */
    this.getCurrentNumber = function() {
        if (changePen === true)
        {
        	currentPen = pens.length;

            pens[currentPen] = {
                strokeStyle : color,
                lineJoin : lineArt,
                lineWidth : width,
                drawingFunction : drawingFunctions[currentDrawingFunction].function,
                drawingFunctionsI : currentDrawingFunction

            };
            changePen = false;
        }
        return currentPen;
    };

    /**
     * [setCurrentPen description]
     * Setzt aktuellen Stift 
     * @param {[int]} i [description]
     * 
     */
    this.setCurrentPen = function(i) {
        currentPen = i;
    }

    /**
     * [getDrawingFunction description]
     * Drawing Funktion des angegebenen Indexes abfragen
     * @param  {[int]} i [description]
     * Index der Funktion
     * @return {[function]}   [description]
     */
    this.getDrawingFunction = function(i) {
        return drawingFunction[i].function;
    }


    return this.init();
}