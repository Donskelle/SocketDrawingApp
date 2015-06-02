function Pen() {
        var pens = new Array();
        var color = "#000000";
        var lineArt = "round";
        var width = 15;
        var changePen = false;
        var currentPen = 0;

        pens[currentPen] = {
                strokeStyle : color,
                lineJoin : lineArt,
                lineWidth : width
        };


        var colorPicker = document.getElementById("colorPicker");
        var strokePicker = document.getElementById("strokePicker");
        var widthPicker = document.getElementById("widthPicker");


        Interaction.addOnChangeListener.apply(colorPicker, [setColor]);	
        Interaction.addOnChangeListener.apply(strokePicker, [setLineArt]);
        Interaction.addOnChangeListener.apply(widthPicker, [setLineWidth]);



       	
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


        this.getPen = function(i) {
            return pens[i];
        };


        this.getCurrentNumber = function() {
            if (changePen === true)
            {
            	currentPen = currentPen + 1;

                pens[currentPen] = {
                        strokeStyle : color,
                        lineJoin : lineArt,
                        lineWidth : width
                };
                changePen = false;
            }
            return currentPen;
        };
}

/*this.Pen = function() {
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
*/