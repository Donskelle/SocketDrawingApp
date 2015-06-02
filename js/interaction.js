function Interaction() {

}
(function(){
    this.makeCallback = function(callback) {
        return function(e) {
            //Interaction.callbackFunction(callback, e);
            callback(e);
            //e.preventDefault();
            //return false;
        };
    }

    this.callbackFunction = function (callback,e) {
        callback(e);
        e.preventDefault();
        return false;
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

    /*this.onmousedown = function(e) {
      ctx.lineJoin = ctx.lineCap = 'round';
      clientX = e.clientX;
      clientY = e.clientY;
      
      timeout = setTimeout(function draw() {
        for (var i = density; i--; ) {
          var angle = getRandomFloat(0, Math.PI * 2);
          var radius = getRandomFloat(0, 30);
          ctx.globalAlpha = Math.random();
          ctx.fillRect(
            clientX + radius * Math.cos(angle),
            clientY + radius * Math.sin(angle), 
            getRandomFloat(1, 2), getRandomFloat(1, 2));
        }
        if (!timeout) return;
        timeout = setTimeout(draw, 50);
      }, 50);
    };
    el.onmousemove = function(e) {
      clientX = e.clientX;
      clientY = e.clientY;
    };
    el.onmouseup = function() {
      clearTimeout(timeout);
    };*/

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
