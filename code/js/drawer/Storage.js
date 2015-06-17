/**
 * [Storage description]
 * Speichert und liest Einstellungen und Bilder aus dem LocalStorage
 */
function Storage() {
	var imagePrefix = "_image";
	var settingsPrefix = "_settings";


	/**
     * Lädt ein gespeichertes Bild.
     * @param sName.
     */
    this.loadImage = function(imgName) {
        return localStorage.getItem(imgName + imagePrefix);
    };

    /**
     * Lädt gespeicherte Einstellungen
     */
    this.loadSettings = function (setName) {
    	return localStorage.getItem(setName + settingsPrefix);
    }


    /**
     * Bild mit Prefix abspeichern
     */
    this.saveImage = function(setName, data) {
    	localStorage.setItem(setName + imagePrefix, data);
    }

    /**
     * Einstellungen mit Prefix abspeichern
     */
    this.saveSettings = function(setName, data) {
    	localStorage.setItem(setName + settingsPrefix, data);
    }

    /**
     * [getAllImageKeys description]
     * Liest alle gespeicherten Bilder aus
     */
    this.getAllImageKeys = function(){
        var border = imagePrefix.length;
        var imageNames = [];
        for(var key in localStorage){
            if(key.endsWith(imagePrefix)){
                var k = key.substr(0,key.length - border);
                imageNames.push(decodeURI(k));
            }
        }
        return imageNames;
    };

    /**
     * [getAllSettingsKeys description]
	 * Liest alle gespeicherten Einstellungen aus
     */
    this.getAllSettingsKeys = function() {
        var border =settingsPrefix.length;
        var settingsName = [];
        for(var key in localStorage){
            if(key.endsWith(settingsPrefix)){
                var k = key.substr(0,key.length - border);
                settingsName.push(k);
            }
        }
        return settingsName;
    };
}