"use strict";
/**
 * [Communicator description]
 * Ein Object, welches zur Kommunikation von Clients dient.
 * Eigentliche Programmierung der Kommunikation befindet sich in der Klasse Drawer.
 * Nachrichten werden über das Custom Element mit einem Event kommuniziert.
 */
function Communicator() 
{
	var ws;
    var notifier = document.getElementsByTagName("x-notifier")[0];
    var kennung = "dada";
    var userNumber = "";
    var url = "borsti1.inf.fh-flensburg.de:8080";

    /**
     * [connect description]
     * Wird beim Erstellen des Objekts automatisch aufgerufen siehe Ende des Scripts
     */
	this.connect = function() {
        var that = this;
		try {
            // Verbindung wird erstellt
            ws = new WebSocket("ws://" + url);

            /**
             * [onopen description]
             * Wenn die Verbindung zum Server erstellt ist
             */
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

    /**
     * [sendMessage description]
     * @param  {[string]} operation 
     * Operation, welche beim Client ausgeführt werden soll.
     * @param  {[string]} message
     * Eigentliche Nachrichteninhalt.
     * @param  {[string]} group
     * Gruppe die informiert werden soll. Parameter ist optional
     */
    this.sendMessage = function(operation, message, group) 
    {
        ws.send(this.decodePrivat(operation, message, group));
    }


    /**
     * [readData description]
     * Die erhalten Daten werden decodet und von Json zurück geparst.
     * Außerdem wird das Notifer Element mit einem Event ausgelöst.
     * @param  {[event.data]} data [description]
     * Erhaltene Daten vom Websocket 
     */
    function readData(data) {
        if (isJson(data)) {
            var jsonObject = JSON.parse(data);

            /**
             * [if description]
             * Prüft ob alle notwendigen Parameter gesetzt sind
             */
            if (typeof jsonObject.url === 'undefined' && typeof jsonObject.kennung != 'undefined' && typeof jsonObject.message != 'undefined') 
            {
                if (isOwnMessage(jsonObject))
                {
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

    /**
     * [isJson description]
     * Prüft, ob der übergebene String, zu einem Json geparst werden kann.
     * @param  {[string]}  str [description]
     * Zu prüfender String
     * @return {Boolean}     [description]
     * Gibt true oder False zurück
     */
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
     * [decodePrivat description]
     * Verschlüsselt eine Nachricht und gibt einen JSON String zurück
     * @param  {[string]} operation [description]
     * Operationsname
     * @param  {[string]} message   [description]
     * Eigentliche Nachricht
     * @param  {[string]} group     [description]
     * Gruppe an die geschickt werden soll
     * @return {[string]}           [description]
     * Verschlüsselter Json String
     */
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
     * [decode description]
     * Verschlüsselt ein Element. Erhöht den charCode Wert aller Buchstaben um 12
     * @param  {[string]} word [description]
     * Das zu verschlüsselnde Wort
     * @return {[string]}      [description]
     * Das verschlüsselte Wort
     */
    function decode(word) {
        var newMessage = "";
        for(var i = 0; i < word.length; i++)
        {
            newMessage += String.fromCharCode(word.charCodeAt(i) + 12);
        }

        return newMessage;
    }

    /**
     * [encode description]
     * Entschlüsselt ein Element. Verringert den Int Wert aller Buchstaben um 12
     * @param  {[string]} word [description]
     * Das zu entschlüsselnde Wort
     * @return {[string]}      [description]
     * Das entschlüsselte Wort
     */
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

    /**
     * [readSecret description]
     * Entschlüsselt alle Json Einträge des übergebenen Objects
     * @param  {[object]} data [description]
     * Json Object
     */
    function readSecret(data) {
        data.operation = encode(data.operation);
        data.message = encode(data.message);

        if(typeof data.group != undefined) {
            data.group = encode(data.group);
        }

        data.from = encode(data.from);
    }

    /**
     * [isOwnMessage description]
     * Prüft ob die Kennnug der eigenen entspricht.
     * @param  {[object]}  data [description]
     * Json Object
     * @return {Boolean}      [description]
     * Gibt True oder False zurück
     */
    function isOwnMessage(data) {
        if(encode(data.kennung) == kennung)
            return true;

        return false;
    }

	return this.connect();
}

