
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
    var notifier = document.getElementsByTagName("x-notifier")[0];
    var userNumber = "";
    var setUserToHear = null;



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
            console.log(e.detail);
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
                        console.log(e.detail);
                        canvasManager.addClickPen(e.detail.message.x, e.detail.message.y, e.detail.message.drag, e.detail.message.strokeStyle, e.detail.message.lineJoin, e.detail.message.lineWidth, e.detail.message.drawingI);
                    }
                    break; 

                case "joinGroup":
                    notifier.setContent("User " + e.detail.from + " tritt bei");

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

                case "setGroupOptions":
                    notifier.setContent(e.detail.group + " beigetreten");

                    e.detail.message = JSON.parse(e.detail.message);
                    console.log("setGroupOption");
                    console.log(e.detail);
                    if(e.detail.message.to == userNumber && options.groupName == e.detail.group)
                    {
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

                case "getClicksDone":
                    e.detail.message = JSON.parse(e.detail.message);
                    if(e.detail.message.to == userNumber)
                    {
                        console.log("drinne")
                        var sendOptions = {
                            to: e.detail.from
                        };

                        var clicksCount = canvasManager.getClickCount();
                        for (var i = 0; i < clicksCount; i++) {
                            var clickPen = canvasManager.getClickPen(i);
                            clickPen.to = e.detail.from;
                            console.log("clickPen");
                            console.log(clickPen);
                            communication.sendMessage("setClicksDone", JSON.stringify(clickPen));
                            console.log("send");
                        };
                    }
                    break;

                case "setClicksDone":
                    e.detail.message = JSON.parse(e.detail.message);
                    if(e.detail.message.to == userNumber)
                    {
                        console.log("setClicksDone drinne");
                        canvasManager.addClickPen(e.detail.message.x, e.detail.message.y, e.detail.message.drag, e.detail.message.strokeStyle, e.detail.message.lineJoin, e.detail.message.lineWidth, e.detail.message.drawingI);
                    }
                    break;

                case "setUserNumber":
                    userNumber = e.detail.number;
                    console.log(userNumber);
                    break;

                case "revertStep":
                    if(e.detail.group == options.groupName)
                        canvasManager.revert();

                    break;

            }
        }]);

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

            leaveGroup();
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

            //formCreateCanvas.reset();
        }]);


        /**
         * Neue Gruppe erstellen
         */
        var formCreateGroup = document.getElementById("formCreateGroup");
        Interaction.addSubmitListener.apply(formCreateGroup, [function (e) {
            var fields = Interaction.readForm.apply(formCreateGroup);
            options = HelpFunction.merge(options, fields);

            communication.sendMessage("setGroup", options.groupName, "");
            addGroup(options.groupName, true);
            HelpFunction.closeLightbox();

            formCreateGroup.reset();

            setUserToHear = null;
        }]);


        /**
         * Gruppe auswählen
         */
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
            if(options.groupName != null)
                communication.sendMessage("revertStep", "", options.groupName);
        }]);


        /**
         * Canvas Touch und Mouse Events
         */
        var canvasWrapper = document.getElementById(options.canvasWrapper);

        Interaction.addMouseDownListener.apply(canvasWrapper, [function (e) {

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


        Interaction.addMouseMoveListener.apply(canvasWrapper, [function (e) {
            if(paint)
            {
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
                    console.log(message);


                    communication.sendMessage(
                        "addClick", 
                        message,
                        options.groupName
                    );
                }
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

    this.offsetWrapper = function() {
        var wrapper = document.getElementById(options.canvasWrapper);

        wrapper.style.marginTop = ((window.innerHeight - options.height) / 2) + "px";

        offset.Y = wrapper.offsetTop;
        offset.X = wrapper.offsetLeft;
    };

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
        else {
            console.log("already exists");
        }
    }

    function leaveGroup() {
        if(options.groupName != null) {
            notifier.setContent("Gruppe verlassen");
        }
        options.groupName = null;
        setUserToHear = null;
    }

	return this.init();
}