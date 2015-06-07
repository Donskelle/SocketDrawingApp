/**
 * Namesbereich für 
 */

function Interaction() {

}
(function(){
    this.makeCallback = function(callback) {
        return function(e) {
            callback(e);
        };
    }

    this.addListener = function (listener, callback) {
        this.addEventListener(listener, Interaction.makeCallback(callback));
    }

    this.addClickListener = function(callback) {
        Interaction.addListener.apply(this, ["mouseup", callback]);
        Interaction.addListener.apply(this, ["touchend", callback]);
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

    this.addSubmitListener = function(callback) {
        Interaction.addListener.apply(this, ["submit", callback]);
    }

    this.addOnChangeListener = function(callback) {
        Interaction.addListener.apply(this, ["change", callback]);
    } 

    this.readForm = function () {
        var inputs = this.getElementsByTagName("input");
        var fields = {};
        for (var i = 0; i < inputs.length; i++) {
            fields[inputs[i].name] = inputs[i].value;
        };

        var selects = this.getElementsByTagName("select");
        for (var i = 0; i < selects.length; i++) {
            fields[selects[i].name] = selects[i].value;
        };

        var textareas = this.getElementsByTagName("textarea");
        for (var i = 0; i < textareas.length; i++) {
            fields[textareas[i].name] = textareas[i].value;
        };
        //this.reset();
        return fields;
    }

}).call(Interaction);
