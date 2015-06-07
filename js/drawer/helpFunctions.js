/**
 * [HelpFunction description]
 */
function HelpFunction() {

}


/**
 * [description]
 * Staatische Methoden
 * @return {[type]} [description]
 */
(function() {
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
		//showMenu();
	}

	this.toggleClassName = function(ele, visbility, toggleName) {
	    var className = ' ' + ele.className + ' ';

	    if (visbility == false && ~className.indexOf(' ' + toggleName + ' ') ) {
	        ele.className = className.replace(' ' + toggleName + ' ', ' ');
	    } 
	    else if(visbility == true){
	        ele.className += ' ' + toggleName;
	    }
	}

	this.getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

}).call(HelpFunction);
