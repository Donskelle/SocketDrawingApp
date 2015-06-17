"use strict";
/**
 * [createCustomElement description]
 * Das Custom Element erstellt ein Div, welches in der Mitte des Bildschirms dargestellt wird,
 * wenn man über die Methode setContent Content hinzufügt. Das Element wird nach 3 Sekunden oder einem Klick wieder entfernt. 
 */
function createCustomElement() {
    // Prototyp-Objekt für x-notifier Element anlegen:
    var notifier = Object.create(HTMLElement.prototype);

    // Dem Prototypen ein Attribut "timer" zufügen:
    Object.defineProperty(notifier, "timer", {
        value: null,
        writable: true,
        enumerable: true
    });

    // Macht das Element sichtbar und blendet es nach 3 Sekunden wieder aus
    notifier.setContent = function (string) {
        this.innerHTML = string;
        this.style.display = "block";
        this.setTimer();
    };

    /**
     * [setTimer description]
     * Timer wird gestellt und nach 3 Sekunden wird das Element ausgeblendet.
     */
    notifier.setTimer = function() {
        var that = this;
        
        this.timer = window.setTimeout(function() {
            that.hide();
        }, 3000);
    };

    /**
     * [hide description]
     * ELement ausblenden
     */
    notifier.hide = function() {
        this.style.display = "none";
    };

    /**
     * [attachedCallback description]
     * Wird ausgeführt, wenn das Element eingefügt wird.
     */
    notifier.attachedCallback = function () {
        this.setAttribute("style", "position: absolute; top: 50px; left: 50%; width: 270px; margin-left:-150px; display: none; padding: 15px;");
        this.style.backgroundColor = "blue";

        // Wenn geklick wird es sofort ausgeblendet
        this.addEventListener("click", function (e) {
            clearTimeout(this.timer);
            this.hide();
        });
    }; 
    
    // Neuen Elementtyp registrieren, dabei auf obigen Prototypen verweisen.
    // Es entsteht der Element "Konstruktor"
    var notifierEle = document.registerElement('x-notifier', {prototype: notifier});
    document.body.insertBefore(new notifierEle(), document.querySelector("div"));
}

window.addEventListener("DOMContentLoaded", createCustomElement);