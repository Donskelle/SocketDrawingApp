function Communicator() {
	var ws;
    var notifier = document.getElementsByTagName("x-notifier")[0];
    var kennung = "dada";
    var userNumber = "";
    var url = "localhost:8080";


	this.connect = function() {
        var that = this;
		try {
            ws = new WebSocket("ws://" + url);

            ws.onopen = function() {
                notifier.setContent("Verbunden mit Server");
                
                /**
                 * Bestehende Gruppen abrufen
                 */
                that.sendMessage("getGroups", "", "");
            };
            ws.onmessage = function(e) {
                readData(e.data);
            };
            ws.onclose = function() {
                notifier.setContent("Verbindung beendet");
            };
        } 
        catch(e) {
            //console.log(e.message);
        }
	};

    this.sendMessage = function(operation, message, group) {
        ws.send(this.decodePrivat(operation, message, group));
    }

    function readData(data) {
        if (isJson(data)) {
            var jsonObject = JSON.parse(data);

            if (typeof jsonObject.url === 'undefined' && typeof jsonObject.kennung != 'undefined' && typeof jsonObject.message != 'undefined') {
                readSecret(jsonObject);
                var event = new CustomEvent(
                    "newMessage",
                    {
                        detail: {
                            operation: jsonObject.operation,
                            message: jsonObject.message,
                            group: jsonObject.group,
                            from: jsonObject.from
                        },
                        cancelable: true
                    }
                );

                notifier.dispatchEvent(event);
            }
        }
        else {
            // Client Number auslesen
            if(data.indexOf("+++Als Client") > -1)
            {
                userNumber = data.replace("+++Als Client ", "");
                userNumber = userNumber.replace(" verbunden mit " + url, "");
                var event = new CustomEvent(
                    "newMessage",
                    {
                        detail: {
                            number: userNumber,
                            operation: "setUserNumber"
                        },
                        cancelable: true
                    }
                );

                notifier.dispatchEvent(event);
            }

        }
    }

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    this.decodePrivat = function(operation, message, group) {
        var json = {
            "kennung" : decode(kennung),
            "message" : decode(message),
            "operation" : decode(operation),
            "from" : decode(userNumber)
        }
        if(typeof group != "undefined" )
            json.group = decode(group);

        return JSON.stringify(json);
    }
    /**
     *  Verschlüsseln
     */
    function decode(word) {
        var newMessage = "";
        for(var i = 0; i < word.length; i++)
        {
            newMessage += String.fromCharCode(word.charCodeAt(i) + 12);
        }

        return newMessage;
    }

    function encode(word) {

        var newMessage = "";
        if(typeof word != "undefined") {
            for(var i = 0; i < word.length; i++)
            {
                newMessage += String.fromCharCode(word.charCodeAt(i) - 12);
            }
        }

        return newMessage;
    }

    function readSecret(data) {
        if(encode(data.kennung) == kennung)
        {
            data.operation = encode(data.operation);
            data.message = encode(data.message);

            if(typeof data.group != undefined)
                data.group = encode(data.group);
            data.from = encode(data.from);
        }
    }

	return this.connect();
}

