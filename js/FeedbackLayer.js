var FedbackLayer = {
	update: function(obj){
		// clear last frame
		var canvas = this.canvas,
			ctx = this.ctx;		
		ctx.clearRect(-canvas.width/2,-canvas.height,canvas.width,canvas.height);

		// render circles based on pointable positions
		var pointablesMap = obj.pointablesMap;
		for (var i in pointablesMap) {
			// get the pointable's position
			var pointable = pointablesMap[i];
			var pos = pointable.tipPosition;

			// create a circle for each pointable
			var radius = Math.min(600/Math.abs(pos[2]),20);
			ctx.beginPath();
			ctx.arc(pos[0]-radius/2,-pos[1]-radius/2,radius,0,2*Math.PI);
			ctx.fill();
		}
	},
	canvas : {},
	// create a rendering context
	ctx : {},	
	init : function(){
		// fullscreen
		var canvas = this.canvas,
			ctx = this.ctx;
		
		canvas =  document.getElementById("leap-overlay");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		ctx = canvas.getContext("2d");
		ctx.translate(canvas.width/2,canvas.height);
		ctx.fillStyle = "rgba(0,0,0,0.7)";		
		this.canvas = canvas;
		this.ctx = ctx;
		
	}
}