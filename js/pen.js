function Pen() {
	
}
( function() {
	this.color = "#fff";
	this.strokeWidth = 15;
	this.lineJoin = "round";


	this.setStrokeWidth = function(paraSize) {
		this.strokeWidth = paraStrokeWidth;
	};

	this.setLineJoin = function(paraLineJoin) {
		this.lineJoin = paraLineJoin;
	};

	this.setColor = function(paraColor) {
		this.color = paraColor;
	};

} ).call(Pen);

