"use strict";
/**
 * [Drawing description]
 * Inzialisiert alle Objekte und erstellt Events
 */
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
        groupName : null
	};
    var offset = {};
    options = HelpFunction.merge(options, _optionsPara);

    var canvasManager = new Canvas(options);
    var communication = new Communicator();
    var storageManager = new Storage();
    var notifier = document.getElementsByTagName("x-notifier")[0];
    var userNumber = "";
    var setUserToHear = null;

    // Wird automatisch beim Erstellen von Drawing aufgerufen und initzialisiert alle Events.
	this.init = function() {
        var paint = false;
        var that = this;

        this.offsetWrapper();

        // Überwachen von Veränderungen im CanvasWrapper.
        // Bei Änderungen wird der Offset neu gesetzt
        var target = document.querySelector('#canvasWrapper');
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                that.offsetWrapper();
            });    
        });
        
        var config = { childList : true };
        observer.observe(target, config);


        /**
         * Initzialisierung der Events
         */
    	window.addEventListener('resize', function() {
            that.offsetWrapper();
        }, true);

        /**
         * Kommunikation mit anderen Clients
         */
        Interaction.addMessageListener.apply(notifier, [function(e) {
            var operation = e.detail.operation;
            
            switch(operation) {
                // Anfrage nach verfügbaren Gruppen
                case "getGroups":
                    if(options.groupName != null)
                        communication.sendMessage("setGroup", options.groupName, "");
                    break;

                // Antwort auf verfügbare Gruppen
                case "setGroup":
                    addGroup(e.detail.message, false);
                    break;

                // Einfügen von Zeichenoperation, falls in der gleichen Gruppe
                case "addClick":
                    if(e.detail.group == options.groupName){
                        e.detail.message = JSON.parse(e.detail.message);
                        canvasManager.addClickPen(e.detail.message.x, e.detail.message.y, e.detail.message.drag, e.detail.message.strokeStyle, e.detail.message.lineJoin, e.detail.message.lineWidth, e.detail.message.drawingI);
                    }
                    break; 

                // Ein User tritt der Gruppe bei.
                case "joinGroup":
                    notifier.setContent("User " + e.detail.from + " tritt bei");

                    // Wenn dies der aktuellen Gruppe entspricht, werden ihm die aktuellen Optionen übermittelt.
                    if(e.detail.group == options.groupName)
                    {
                        var sendOptions = {
                            width: options.width,
                            height: options.height,
                            to: e.detail.from
                        };
                        communication.sendMessage("setGroupOptions", JSON.stringify(sendOptions), options.groupName);
                    }
                    break;

                // Optionen werden zugesendet
                case "setGroupOptions":
                    // e.detail.message wird in ein Json Object gewandelt.
                    e.detail.message = JSON.parse(e.detail.message);

                    // Wenn die Optionen von CLient angefragt wurden
                    if(e.detail.message.to == userNumber && options.groupName == e.detail.group)
                    {
                        notifier.setContent(e.detail.group + " beigetreten");

                        // Nutzer zur Kommunikation wird gesetzt. Dieser übermittelt alle bereits gemachten Interaktionen.
                        // Dies wird unten angefragt.
                        if(setUserToHear == null)
                            setUserToHear = e.detail.from

                        var sendOptions = {
                            to: e.detail.from
                        };
                        options.width = e.detail.message.width;
                        options.height = e.detail.message.height;
                        options.backgroundImage = null;

                        canvasManager.rebuild(options);

                        communication.sendMessage("getClicksDone", JSON.stringify(sendOptions))
                    }
                    break;

                // Bereits gemachte Klicks werden angefragt
                case "getClicksDone":
                    e.detail.message = JSON.parse(e.detail.message);
                    
                    // Wenn die Nachricht an diesen Nutzer gerichtet ist
                    if(e.detail.message.to == userNumber)
                    {
                        var sendOptions = {
                            to: e.detail.from
                        };

                        // Anzahl Click holen
                        var clicksCount = canvasManager.getClickCount();
                        // Für die Anzahl der Clicks eine Nachricht mit Clickposition und Stift verschicken.
                        for (var i = 0; i < clicksCount; i++) {
                            var clickPen = canvasManager.getClickPen(i);
                            clickPen.to = e.detail.from;
    
                            communication.sendMessage("setClicksDone", JSON.stringify(clickPen));
                        };
                    }
                    break;

                // Bereits gemachte Klicks erhalten
                case "setClicksDone":
                    e.detail.message = JSON.parse(e.detail.message);
                    if(e.detail.message.to == userNumber)
                    {
                        canvasManager.addClickPen(e.detail.message.x, e.detail.message.y, e.detail.message.drag, e.detail.message.strokeStyle, e.detail.message.lineJoin, e.detail.message.lineWidth, e.detail.message.drawingI);
                    }
                    break;

                // Die User Number wird vom Server erhalten
                case "setUserNumber":
                    userNumber = e.detail.number;
                    break;

                // Einen Schritt zurück gehen
                case "revertStep":
                    if(e.detail.group == options.groupName)
                        canvasManager.revert();
                    break;
            }
        }]);
        
        // Menü für Mal Operationen wird erstellt. CreateMenu toggelt bei Klick eine Visible Klasse.
        var menuDrawOperations = new HelpFunction.createMenu({
            "openElement": "openDrawOperations",
            "closeElement": "closeDrawOperations",
            "visibleAttachElement": "drawOperationsMenu"
        });

        // Menü für Mal Operationen wird erstellt. CreateMenu toggelt bei Klick eine Visible Klasse.
        var menuMainOptions = new HelpFunction.createMenu({
            "openElement": "openMainOptions",
            "closeElement": "closeMainOptions",
            "visibleAttachElement": "mainOptionsWrapper"
        });

        /**
         * Alle lightboxWrapper Klassen werden mit einem Click oder Touch Listener belegt,
         * um bei offener Lightbox auch durch Berührung des dunklen Feldes die Lightbox zu schließen.
         * Lightbox bei Canvas erstellen oder Gruppe erstellen
         */
        var lightboxWrapper = document.querySelectorAll(".lightboxWrapper");
        for (var i = lightboxWrapper.length - 1; i >= 0; i--) {
            Interaction.addClickListener.apply(lightboxWrapper[i], [HelpFunction.closeLightbox]);
        };


        var storageWrapper = document.getElementById("wrapperStorageContent");
        /**
         * Bei Klick auf loadSettings wird der StorageWrapper mit SettingsDaten befüllt und dargestellt.
         */
        var loadSettingsLink = document.getElementById("loadSettings");
        Interaction.addClickListener.apply(loadSettingsLink, [function(e) {
            storageWrapper.innerHTML = "<h2>Gespeicherte Einstellungen</h2>";
            var settings = storageManager.getAllSettingsKeys();

            for (var i = 0; i < settings.length; i++) {
                var link = document.createElement("a");
                var text = document.createTextNode(settings[i]);
                link.appendChild(text);
                storageWrapper.appendChild(link);

                link.addEventListener("click", function(e) {
                    var jsonString = storageManager.loadSettings( e.target.text )
                    var jsonObj = JSON.parse(jsonString);
                    options.width = jsonObj.width;
                    options.height = jsonObj.height;

                    canvasManager.rebuild(options);
                    HelpFunction.closeLightbox();
                })      
            };
            // Eigentliches Klick Event wird ausgeführt und so die Lightbox dargestellt
            return true;
        }]);


        /**
         * Bei Klick auf loadImages wird der StorageWrapper mit Localstorage Bilder befüllt und dargestellt.
         */
        var loadImageLink = document.getElementById("loadImgLink");
        Interaction.addClickListener.apply(loadImageLink, [function(e) {
            var images = storageManager.getAllImageKeys();
            storageWrapper.innerHTML = "<h2>Gespeicherte Bilder</h2>";
            for (var i = 0; i < images.length; i++) {
                var link = document.createElement("a");
                var text = document.createTextNode(images[i]);
                link.appendChild(text);
                storageWrapper.appendChild(link);

                link.addEventListener("click", function(e) {
                    that.rebuildWithBackground(storageManager.loadImage( e.target.text ));
                    HelpFunction.closeLightbox();
                });
            };
            // Eigentliches Klick Event wird ausgeführt und so die Lightbox dargestellt
            return true;
        }]);



        // Form Canvas erstellen wird submitted
        var formCreateCanvas = document.getElementById("formCreateCanvas");
        Interaction.addSubmitListener.apply(formCreateCanvas, [function (e) {
            /**
             * Neues Canvas erstellen
             */
            var fields = HelpFunction.readForm.apply(formCreateCanvas);
            options = HelpFunction.merge(options, fields);

            leaveGroup();
            HelpFunction.closeLightbox();


            // Wenn ein Bild hochgeladen wurde, wird es in den Options gespeichert und als Hintergrund eingebunden.
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
        }]);


        // Form Gruppe erstellen wird submitted
        var formCreateGroup = document.getElementById("formCreateGroup");
        Interaction.addSubmitListener.apply(formCreateGroup, [function (e) {
            var fields = HelpFunction.readForm.apply(formCreateGroup);
            options = HelpFunction.merge(options, fields);

            communication.sendMessage("setGroup", options.groupName, "");
            addGroup(options.groupName, true);
            HelpFunction.closeLightbox();

            formCreateGroup.reset();

            setUserToHear = null;
        }]);

        // Gruppe auswählen und beitreten
        var groupSelection = document.getElementById("groupSelection");
        Interaction.addOnChangeListener.apply(groupSelection, [function (e) {
            if(groupSelection.value == "Keine") {
                leaveGroup();
            }
            else {
                setUserToHear = null;
                options.groupName = groupSelection.value;
                communication.sendMessage("joinGroup", "", options.groupName);
            }

        }]);

        // Canvas als Bild im Lokalstorage speichern
        var saveButton = document.getElementById(options.storeLink);
        saveButton.addEventListener('click', function(e) {
            var imgName = prompt("Bitte einen Namen zum Speichern eingeben");
            if (imgName != null) {
                if(imgName != "")
                {
                    storageManager.saveImage(imgName, canvasManager.getDataUrl());
                    notifier.setContent("Erfolgreich ! Kann nun beim nächsten Aufruf geladen werden.");
                }
                else { 
                    notifier.setContent("Eingabe leer");
                }
            }
        }, true);

        // Einstellungen als JSON String in Lokalstorage speichern
        var saveSettingsButton = document.getElementById("saveSettings");
        saveSettingsButton.addEventListener('click', function(e) {
            var settingsName = prompt("Bitte einen Namen zum Speichern eingeben");
            if (settingsName != null) {
                if(settingsName != "")
                {   
                    var settings = {
                        width: options.width,
                        height: options.height
                    };
                    storageManager.saveSettings(settingsName, JSON.stringify(settings));
                    notifier.setContent("Erfolgreich ! Kann nun beim nächsten Aufruf geladen werden.");
                }
                else { 
                    notifier.setContent("Eingabe leer");
                }
            }
        }, true);


        // Download des aktuellen Bildes
        var downloadButton = document.getElementById(options.downloadLink);
        downloadButton.attributes.download = options.name + ".png";
        downloadButton.addEventListener('click', function(e) {
            downloadButton.href = canvasManager.getDataUrl(); 
        }, true);


        // Zurück Button anlegen. Letzte Mal Operation wird entfernt.
        var revertLink = document.getElementById(options.revertLink);
        Interaction.addClickListener.apply(revertLink, [function (e) {
            canvasManager.revert();
            if(options.groupName != null)
                communication.sendMessage("revertStep", "", options.groupName);
        }]);


        //Canvas Touch und Mouse Events anlegen. Auf dem Wrappen. In diesen werden die Canvas hinzugefügt.
        var canvasWrapper = document.getElementById(options.canvasWrapper);

        // Mouse oder Touch Move beginnt
        Interaction.addMouseDownListener.apply(canvasWrapper, [function (e) {
            if(typeof e.targetTouches != 'undefined') {
                e.x = e.targetTouches[e.targetTouches.length - 1].pageX;
                e.y = e.targetTouches[e.targetTouches.length - 1].pageY;
            }
            canvasManager.addClick(e.x - offset.X , e.y - offset.Y , false);
            
            paint = true;

            if(options.groupName != null)
            {
                var pen = canvasManager.getPenToSend();
                var message = JSON.stringify(
                { 
                    x : e.x - offset.X, 
                    y : e.y - offset.Y, 
                    drag : false, 
                    strokeStyle : pen.strokeStyle,
                    lineJoin : pen.lineJoin,
                    lineWidth : pen.lineWidth,
                    drawingI : pen.drawingFunctionsI
                });

                communication.sendMessage(
                    "addClick", 
                    message,
                    options.groupName
                );
            }
        }]);

        // Mouse oder Touchbewegung
        Interaction.addMouseMoveListener.apply(canvasWrapper, [function (e) {
            if(paint)
            {
                if(typeof e.targetTouches != 'undefined') {
                    e.x = e.targetTouches[e.targetTouches.length - 1].pageX;
                    e.y = e.targetTouches[e.targetTouches.length - 1].pageY;
                }

                canvasManager.addClick(e.x - offset.X, e.y - offset.Y, true);

                if(options.groupName != null)
                {
                    var pen = canvasManager.getPenToSend();
                    var message = JSON.stringify(
                    { 
                        x : e.x - offset.X, 
                        y : e.y - offset.Y, 
                        drag : true, 
                        strokeStyle : pen.strokeStyle,
                        lineJoin : pen.lineJoin,
                        lineWidth : pen.lineWidth,
                        drawingI : pen.drawingFunctionsI
                    });

                    communication.sendMessage(
                        "addClick", 
                        message,
                        options.groupName
                    );
                }
            }
        }]);
        
        // Touch- oder Clickbewegung hört auf
        Interaction.addClickListener.apply(canvasWrapper, [function (e) {
            paint = false;
        }]);

        // Mouse oder Touchbewgung verlässt das Element
        Interaction.addMouseLeaveListener.apply(canvasWrapper, [function (e) {
            paint = false;
        }]);
    }


    this.rebuildWithBackground = function (imgAsDataURL) {
        options.backgroundImage = new Image();
        options.backgroundImage.src = imgAsDataURL;

        options.width = options.backgroundImage.width;
        options.height = options.backgroundImage.height;

        canvasManager.rebuild(options);
    }

    // Optionen werden zusammengeführt
    this.rebuild = function(_optionsPara) {
        options = HelpFunction.merge(options, _optionsPara);
        canvasManager.rebuild(options);
    }

    // CanvasWrapper wird horizental zentriert. Außerdem wird der Offset aktualisiert
    this.offsetWrapper = function() {
        var wrapper = document.getElementById(options.canvasWrapper);

        wrapper.style.marginTop = ((window.innerHeight - options.height) / 2) + "px";

        offset.Y = wrapper.offsetTop;
        offset.X = wrapper.offsetLeft;
    };

    // Gruppe wird zum Select Input hinzugefügt, wenn Sie nicht bereits vorhanden ist.
    function addGroup(groupName, selected) {
        var testIfAlreadyExists = document.querySelector("#groupSelection option[value='" + groupName + "']");
        
        if(testIfAlreadyExists == null) 
        {
            var option = document.createElement("OPTION");
            option.value = groupName;
            if(selected)
                option.selected = "selected";
            option.appendChild(document.createTextNode(groupName));
            document.querySelector("#groupSelection").appendChild(option);
        }
    }

    // Aktuelle Gruppe wird verlassen
    function leaveGroup() {
        if(options.groupName != null) {
            notifier.setContent("Gruppe verlassen");
        }
        options.groupName = null;
        setUserToHear = null;
    }

	return this.init();
}