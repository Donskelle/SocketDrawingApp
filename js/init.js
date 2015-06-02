
	var canvas = new Canvas({
		
	});
	var paint = false;

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


	/**
	 * Neues Canvas erstellen
	 */
	var formCreateCanvas = document.getElementById("formCreateCanvas");

	Interaction.addSubmitListener.apply(formCreateCanvas, [function (e) {
		var fields = Interaction.readForm.apply(formCreateCanvas);
		HelpFunction.closeLightbox();
		formCreateCanvas.reset();
		canvas = new Canvas(fields);
	}]);


	/**
	 * Neue Gruppe erstellen
	 */
	var formCreateGroup = document.getElementById("formCreateGroup");
	Interaction.addSubmitListener.apply(formCreateGroup, [function (e) {
		var fields = Interaction.readForm.apply(formCreateGroup);
		HelpFunctions.closeLightbox();
		formCreateGroup.reset();
	}]);


