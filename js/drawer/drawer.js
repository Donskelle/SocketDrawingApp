
function Drawing(_optionsPara) {
	var options = {
		width: 1000,
		height: 600,
		background: "white",
		backgroundImage: null,
		canvasWrapper: "canvasWrapper",
        revertLink: "revert",
        downloadLink: "downloadLink",
        storeLink: "storeLink",
        name: "canvasDrawer",

	};
    var canvasManager;
    options = HelpFunction.merge(options, _optionsPara);
    var canvasManager = new Canvas(options);
    var communication = new Communicator();


	this.init = function() {
        var paint = false;
        var that = this;

        /**
         * Initzialisierung der Events
         */
    	window.addEventListener('resize', function() {
            canvasManager.offsetWrapper();
        }, true);

        var canvasAsdataURL;
        canvasAsdataURL = localStorage.getItem("drawerImage");
        if (canvasAsdataURL != null) {
            var response = confirm("Bild gefunden. Möchten Sie es Laden?");
            if(response == true)
            {
                options.backgroundImage = new Image();
                options.backgroundImage.src = canvasAsdataURL;

                options.width = options.backgroundImage.width;
                options.height = options.backgroundImage.height;

                canvasManager.rebuild(options);
            }
        }


        /**
         * Neues Canvas erstellen
         */
        var formCreateCanvas = document.getElementById("formCreateCanvas");
        Interaction.addSubmitListener.apply(formCreateCanvas, [function (e) {
            var fields = Interaction.readForm.apply(formCreateCanvas);
            options = HelpFunction.merge(options, fields);

            HelpFunction.closeLightbox();

            if(fields.backgroundImage != null && fields.backgroundImage != "")
            {
                var that = this;
                var input =  document.getElementById("fileUpload");

                var fReader = new FileReader();
                fReader.readAsDataURL(input.files[0]);
                
                fReader.onloadend = function(event){
                    options.backgroundImage = new Image();
                    options.backgroundImage.src = event.target.result;
                    
                    canvasManager.rebuild(options);
                }
            }
            else {
                canvasManager.rebuild(options);
            }

            document.getElementById("formCreateCanvas").reset();
        }]);


        var saveButton = document.getElementById(options.storeLink);
        saveButton.addEventListener('click', function(e) {
            localStorage.setItem("drawerImage", canvasManager.getDataUrl());
            alert("Erfolgreich ! Kann nun beim nächsten Aufruf geladen werden.");
        }, true);


        var downloadButton = document.getElementById(options.downloadLink);
        downloadButton.attributes.download = options.name + ".png";
        downloadButton.addEventListener('click', function(e) {
            downloadButton.href = canvasManager.getDataUrl(); 
        }, true);


        var revertLink = document.getElementById(options.revertLink);
        Interaction.addClickListener.apply(revertLink, [function (e) {
            canvasManager.revert();
        }]);


        var canvasWrapper = document.getElementById(options.canvasWrapper);

        Interaction.addMouseDownListener.apply(canvasWrapper, [function (e) {
            canvasManager.addClick(e.x, e.y, false);
            canvasManager.drawLast();
            paint = true;
        }]);


        Interaction.addMouseMoveListener.apply(canvasWrapper, [function (e) {
            if(paint)
            {
                canvasManager.addClick(e.x, e.y, true);
                canvasManager.drawLast();
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