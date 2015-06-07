function Communicator() {
	var ws;

	this.connect = function() {
		try {
            ws = new WebSocket("ws://localhost:8080");

            ws.onopen = function() {
                console.log("verbunden, readyState: " + this.readyState);
                ws.send("gibUrlUndPort");
            };
            ws.onmessage = function(e) {
                console.log(e.data);
            };
            ws.onclose = function() {
                console.log("Verbindung beendet, readyState: " + this.readyState);
            };
        } 
        catch(e) {
            schreib(e.message)
        }
	};

	this.getGroups = function() {

	};

	return this.connect();
}