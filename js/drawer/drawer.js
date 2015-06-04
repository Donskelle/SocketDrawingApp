
function Drawing(_optionsPara) {
	var options = {
		width: 1000,
		height: 600,
		background: "white",
		backgroundImage: null,
		canvasWrapper: "canvasWrapper",
        revertLink: "revert",
        saveLink: "save",
        name: "canvasDrawer"
	};
    var canvasManager;
    options = HelpFunction.merge(options, _optionsPara);
    var canvasManager = new Canvas(options);


	this.init = function() {
        var paint = false;
        var that = this;

        /**
         * Initzialisierung der Events
         */
    	window.addEventListener('resize', function() {
            canvasManager.offsetWrapper();
        }, true);


        /**
         * Neues Canvas erstellen
         */
        var formCreateCanvas = document.getElementById("formCreateCanvas");
        Interaction.addSubmitListener.apply(formCreateCanvas, [function (e) {
            var fields = Interaction.readForm.apply(formCreateCanvas);
            options = HelpFunction.merge(options, fields);
            console.log(options)
            HelpFunction.closeLightbox();
            canvasManager.rebuild(options);

            document.getElementById("formCreateCanvas").reset();
        }]);


        var saveButton = document.getElementById(options.saveLink);
        saveButton.addEventListener('click', function(e) {
            saveButton.attributes.download = options.name + ".png";
            saveButton.href = canvasManager.save(); 
        }, true);


        var revertLink = document.getElementById(options.revertLink);
        Interaction.addClickListener.apply(revertLink, [function (e) {
            canvasManager.revert();
        }]);


        var canvasWrapper = document.getElementById(options.canvasWrapper);

        Interaction.addMouseDownListener.apply(canvasWrapper, [function (e) {
            canvasManager.addClick(e.x, e.y, false);
            canvasManager.draw();
            paint = true;
        }]);


        Interaction.addMouseMoveListener.apply(canvasWrapper, [function (e) {
            if(paint)
            {
                canvasManager.addClick(e.x, e.y, true);
                canvasManager.draw();
            }
        }]);

        Interaction.addClickListener.apply(canvasWrapper, [function (e) {
                paint = false;
        }]);

        Interaction.addMouseLeaveListener.apply(canvasWrapper, [function (e) {
                paint = false;
        }]);
    }

    this.rebuild = function(options) {
        options = HelpFunction.merge(options, _optionsPara);
        canvasManager.rebuild(options);
    }


	return this.init();
}