"use strict";
/**
 * [HelpFunction description]
 * Namensbereich für Hilfsmethoden
 */
function HelpFunction() {

}

/**
 * [description]
 * Staatische Methoden
 * @return {[type]} [description]
 */
(function() {
	// Schließt die Lightbox
	this.closeLightbox = function(e) {
		if(typeof e === "undefined")
		{
			document.getElementById("closeLightbox").click();
		}
		else if(e.target.className == "lightboxWrapper") {
			document.getElementById("closeLightbox").click();
		}
	}


	this.merge = function(defaultObject, overWriteObject) {
		for (var prop in overWriteObject) {
		    defaultObject[prop] = overWriteObject[prop];
		}
		return defaultObject;
	}


	/**
	 * [menu description]
	 * Erstellt ein Menu mit einem Element zum öffnen und schließen
	 * @param  {[type]} options 
	 * @return {[type]}         [description]
	 */
	this.createMenu = function(options) {
		var openElement = document.getElementById(options.openElement);
		var closeElement = document.getElementById(options.closeElement);
		var visibleAttachElement = document.getElementById(options.visibleAttachElement);

		var init =  function() {
			Interaction.addClickListener.apply(openElement, [open]);
			Interaction.addClickListener.apply(closeElement, [close]);
		}
		
		var open = function () {
			HelpFunction.toggleClassName(visibleAttachElement, true, "visible");
		}
		var close = function () {
			HelpFunction.toggleClassName(visibleAttachElement, false, "visible");
		}
		init();
	}

	/**
	 * [toggleClassName description]
	 * Toggelt einen Klassenname auf einem Element
	 * @param  {[object]} ele        [description]
	 * Dom Element
	 * @param  {[boolean]} visbility  [description]
	 * Ob das Element aus oder eingeblendet werden soll
	 * @param  {[type]} toggleName [description]
	 * Name der Toggle Klasse
	 */
	this.toggleClassName = function(ele, visbility, toggleName) {
	    var className = ' ' + ele.className + ' ';

	    if (visbility == false && ~className.indexOf(' ' + toggleName + ' ') ) {
	        ele.className = className.replace(' ' + toggleName + ' ', ' ');
	    } 
	    else if(visbility == true){
	        ele.className += ' ' + toggleName;
	    }
	}

	/**
	 * [getRandomInt description]
	 * @param  {[int]} min [description]
	 * Minimum Wert
	 * @param  {[int]} max [description]
	 * Maximal Wert
	 * @return {[int]}     [description]
	 * Zufälliger Wert
	 */
	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * [readForm description]
	 * Wird über call und der Form aufgerufen. Liest alle Felder der Form aus und gibt sie in einem Object mit einsprechenden Namen der Inputs zurück
	 * @return {[object]} [description]
	 */
	this.readForm = function () {
        var inputs = this.getElementsByTagName("input");
        var fields = {};
        for (var i = 0; i < inputs.length; i++) {
            fields[inputs[i].name] = inputs[i].value;
        };

        var selects = this.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            fields[selects[i].name] = selects[i].value;
        };

        var textareas = this.getElementsByTagName("textarea");
        for (var i = 0; i < textareas.length; i++) {
            fields[textareas[i].name] = textareas[i].value;
        };
        //this.reset();
        return fields;
    }

}).call(HelpFunction);
