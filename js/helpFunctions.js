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
			showMenu(true);
		}
		var close = function () {
			showMenu(false);
		}

		function showMenu (visible) {
		    var className = ' ' + visibleAttachElement.className + ' ';

		    if (visible == false && ~className.indexOf(' visible ') ) {
		        visibleAttachElement.className = className.replace(' visible ', ' ');
		    } 
		    else if(visible == true){
		        visibleAttachElement.className += ' visible';
		    }

		}
		init();
		//showMenu();
	}

}).call(HelpFunction);
