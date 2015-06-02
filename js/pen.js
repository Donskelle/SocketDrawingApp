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