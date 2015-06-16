"use strict";
/**
 * [Canvas description]
 * In dieser Klasse werden die Canvas Dom Elemente erstellt und die eigentliche Zeichenlogik angespiegelt.
 */
function Canvas(options) 
{
    var arrayCanvas = new Array();
    var clickX = new Array();
    var clickY = new Array();
    var clickDrag = new Array();
    var pens = new Array();

    var penManager = new Pen();

    // Initialisiert das 1. Canvas Element.
    this.init = function() {
    	addCanvas();

        return this;
    }
    
    /**
     * [getClickPen description]
     * ClickPostition und aktueller Stift werden entsprechend i zurückgegeben
     * @param  {[int]} i [description]
     * Position des Clicks
     * @return {[object]}   [description]
     * Object mit allen Werten wird zurück gegeben
     */
    this.getClickPen = function(i) {
        var response = {};
        var pena = this.getPenToSend(i);

        response.x = clickX[i];
        response.y = clickY[i];
        response.drag = clickDrag[i];
        response.strokeStyle = pena.strokeStyle;
        response.lineJoin = pena.lineJoin;
        response.lineWidth = pena.lineWidth;
        response.drawingI = pena.drawingFunctionsI;
        return response;
    }

    /**
     * [getClickCount description]
     * Anzahl der Click und Touch Operationen abfragen
     * @return {[int]} [description]
     * Anzahl Clicks
     */
    this.getClickCount = function() {
        return clickX.length;
    }

    /**
     * [setPen description]
     * Setzt Mal Art entsprechend des angegeben Stiftes auf dem angegebenen canvas
     * @param {[int]} penNumber [description]
     * Id des Stiften
     * @param {[int]} canvasId  [description]
     * Canvas, welches den Stift anwenden soll
     */
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

        if(typeof arrayCanvas[canvasId].drawFunction != "function")
            arrayCanvas[canvasId].drawFunction = penManager.getFunction(options.drawingFunctionsI);
    }

    /**
     * [rebuild description]
     * Setzt das Objekt zurück und übernimmt die übergebenen Optionen
     * @param  {[object]} _optionsPara [description]
     * Optionen siehe Drawer
     */
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

        addCanvas(); 
    }


    /**
     * [revert description]
     * Letzte Bewegung wird entfernt
     */
    this.revert = function() {
        if(clickDrag[clickDrag.length - 1 ] == true)
        {
            while(clickDrag[clickDrag.length - 1] == true) {
                clickX.pop();
                clickY.pop();
                clickDrag.pop();
                pens.pop()
            }
            // 1. Click der Move Bewegung wird nicht als Drag interpretiert
            // Deshalb wird es hier zusätzlich zum Drag entfernt
            clickX.pop();
            clickY.pop();
            clickDrag.pop();
            pens.pop()
        }
        else {
            clickX.pop();
            clickY.pop();
            clickDrag.pop();
            pens.pop()
        }

        //
        while((Math.floor(clickX.length / 500) + 1) < arrayCanvas.length) {
            deleteCanvas();
        }
        this.drawAll();
    }

    /**
     * [addClick description]
     * Letzte Bewegung wird hinzugefügt
     */
    this.addClick = function(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);

        pens.push(penManager.getCurrentNumber());

        // Jedes Mal wenn 500 Schritte gezeichnet wurden, wird ein neues Canvas erstellt, um die Rechenoperatinen zu minimieren.
        if (clickX.length % 500 == 0)
        {
            addCanvas();
        }
        this.drawLast();
    }

    /**
     * [getPenToSend description]
     * Pen ohne Funktion holen
     */
    this.getPenToSend = function(index) {
        var pena
        if(typeof index == "undefined")
            pena = penManager.getPen(pens[pens.length - 1]);
        else
            pena = penManager.getPen(pens[index]);

        delete pena.drawingFunction;
        return pena;
    }

    /**
     * [addClickPen description]
     * Bewegung inklusive Stift hinzufügen
     */
    this.addClickPen = function(x, y, dragging, strokeStyle, lineJoin, lineWidth, drawingFunctionsI) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);

        var oldNumber = penManager.getCurrentNumber();
        pens.push(penManager.addPen(strokeStyle, lineJoin, lineWidth, drawingFunctionsI));

        // Jedes Mal wenn 500 Schritte gezeichnet wurden, wird ein neues Canvas erstellt, um die Rechenoperatinen zu minimieren.
        if (clickX.length % 500 == 0)
        {
            addCanvas();
        }
        this.drawLast();

        var canvasToDraw = Math.floor(clickX.length/500);

        penManager.setCurrentPen(oldNumber);
    }


     /**
     * [drawAll description]
     * Alle Operationen des aktuellen Canvas Elements werden wiederholt
     */
    this.drawAll = function() {
        var canvasToDraw = Math.floor(clickX.length/500);

        drawDefaults(canvasToDraw);

        for (var i = canvasToDraw * 500; i < clickX.length; i++) {
            this.setPen( pens[i], canvasToDraw);

            arrayCanvas[canvasToDraw].drawFunction(arrayCanvas[canvasToDraw].ctx, clickX, clickY, clickDrag, i);
        };
    }

    /**
     * [drawLast description]
     * Zuletzt hinzugefügte Bewegung wird gezeichnet
     */
    this.drawLast = function() {
        var canvasToDraw = Math.floor(clickX.length/500);
        var i = clickX.length - 1;

        this.setPen( pens[i], canvasToDraw);
        arrayCanvas[canvasToDraw].drawFunction(arrayCanvas[canvasToDraw].ctx, clickX, clickY, clickDrag, i);
    }

    /**
     * [getDataUrl description]
     * Holt die dataUrl von allen Canvas und malt sie auf einen neuen Canvas Layer. 
     * Welches dann ebenfalls über die Methode toDataUrl geholt wird und zurück gegeben wird.
     */
    this.getDataUrl = function() {
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

    /**
     * [drawDefaults description]
     * Malt ein BackgroundImage falls gesetzt
     * @param  {[int]} i [description]
     * Indes des Canvas Elements

     */
    var drawDefaults = function(i) {
    	arrayCanvas[i].ctx.clearRect(0, 0, options.width, options.height);

    	if(options.backgroundImage != null && options.backgroundImage != "" && i == 0)
        {
            arrayCanvas[i].ctx.drawImage(options.backgroundImage, 0, 0, options.width, options.height);        
        }
    };

    /**
     * [addCanvas description]
     * Canvas Layer wird hinzugefügt
     */
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

    /**
     * [deleteCanvas description]
     * Canvas Layer wird entfernt
     */
    var deleteCanvas = function() {
        var i = arrayCanvas.length - 1;
        var canvas = arrayCanvas[i].canvas;
        canvas.parentNode.removeChild(canvas);;

        arrayCanvas.pop();
    };

    return this.init();
}