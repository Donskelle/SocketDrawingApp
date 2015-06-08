function init() {
	var drawing = new Drawing({});


	var menuDrawOperations = new HelpFunction.createMenu({
		"openElement": "openDrawOperations",
		"closeElement": "closeDrawOperations",
		"visibleAttachElement": "drawOperationsMenu"
	});

	var menuMainOptions = new HelpFunction.createMenu({
		"openElement": "openMainOptions",
		"closeElement": "closeMainOptions",
		"visibleAttachElement": "mainOptionsWrapper"
	});

	/**
	 * Alle lightboxWrapper Klassen werden mit einem Click oder Touch Listener belegt,
	 * um bei offener Lightbox auch durch Berührung des dunklen Feldes die Lightbox zu schließen
	 */
	var lightboxWrapper = document.querySelectorAll(".lightboxWrapper");
	for (var i = lightboxWrapper.length - 1; i >= 0; i--) {
		Interaction.addClickListener.apply(lightboxWrapper[i], [HelpFunction.closeLightbox]);
	};
}
window.addEventListener('DOMContentLoaded', init, false);
