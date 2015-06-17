"use strict";
/**
 * Namesbereich für Interaktionsfunktionen
 * Diese erstellen ein Callback, welches mit lokalen Variablen arbeiten kann.
 * Die Function werden über call und dem Element aufgerufen.
 */
function Interaction() {

}
(function(){
    this.makeCallback = function(callback, prevent) {
        return function(e) {
            callback(e);
            if(typeof prevent == "undefined")
                e.preventDefault();
        };
    }

    this.addListener = function (listener, callback) {
        this.addEventListener(listener, Interaction.makeCallback(callback));
    }

    this.addListenerWithOutPrevent = function (listener, callback) {
        this.addEventListener(listener, Interaction.makeCallback(callback, false));
    }

    this.addClickListener = function(callback) {
        Interaction.addListenerWithOutPrevent.apply(this, ["mouseup", callback]);
        Interaction.addListenerWithOutPrevent.apply(this, ["touchend", callback]);
    }

    this.addMouseDownListener = function(callback) {
        Interaction.addListener.apply(this, ["mousedown", callback]);
        Interaction.addListener.apply(this, ["touchstart", callback]);
    }

    this.addMouseMoveListener = function(callback) {
        Interaction.addListener.apply(this, ["mousemove", callback]);
        Interaction.addListener.apply(this, ["touchmove", callback]);
    }

    this.addMouseLeaveListener = function(callback) {
        Interaction.addListener.apply(this, ["mouseleave", callback]);
        Interaction.addListener.apply(this, ["touchcancel", callback]);
    }

    this.addMessageListener = function(callback) {
        Interaction.addListener.apply(this, ["newMessage", callback]);
    }

    this.addSubmitListener = function(callback) {
        Interaction.addListener.apply(this, ["submit", callback]);
    }

    this.addOnChangeListener = function(callback) {
        Interaction.addListener.apply(this, ["change", callback]);
    } 
}).call(Interaction);
