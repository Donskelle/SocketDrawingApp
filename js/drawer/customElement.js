"use strict";

//--------------------------------------------------------------
function createCustomElement() {
    // x-notifier custom element definieren:
    // Prototyp-Objekt für x-notifier Element anlegen:
    var notifier = Object.create(HTMLElement.prototype);

    // Dem Prototypen ein Attribut "timer" zufügen:
    // sieh z.B.: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    Object.defineProperty(notifier, "timer", {
        value: null,
        writable: true,
        enumerable: true
    });

    notifier.setContent = function (string) {
        this.innerHTML = string;
        this.style.display = "block";
        this.setTimer();
    };

    notifier.setTimer = function() {
        var that = this;
        
        this.timer = window.setTimeout(function() {
            that.hide();
        }, 2000);
    };

    notifier.hide = function() {
        this.style.display = "none";
    };


    notifier.attachedCallback = function () {

        this.setAttribute("style", "position: absolute; top: 50px; left: 50%; width: 270px; margin-left:-150px; display: none; padding: 15px;");
        this.style.backgroundColor = "blue";


        // click-handler für x-vierzwei-Elemente definieren:
        this.addEventListener("click", function (e) {
            clearTimeout(this.timer);
            this.hide();
        });
    }; 
    // Neuen Elementtyp registrieren, dabei auf obigen Prototypen verweisen.
    // Es entsteht der Element-"Konstruktor" notifierEle:
    var notifierEle = document.registerElement('x-notifier', {prototype: notifier});

    // oder so mit new und dem Element-"Konstruktor":  
    document.body.insertBefore(new notifierEle(), document.querySelector("div"));
} // end init

window.addEventListener("DOMContentLoaded", createCustomElement);