var KeysLayer = {
	//  Left/Right = pos[0] Min = -400 Max = 400
	//		notes #start at 21 go to 108
	//  Up/Down = pos[1] Min = ~100 Max = ~500
	//piano.noteOn(channel, note, velocity, delay)
	posToNote : function(pos){
		// turn this into a positive number approximately 0 to 800
		pos = pos+400;
		var pct =pos / 800;
		var numkeys = 108 - 21;
		var key = Math.round(numkeys * pct,0);
		return key+21;
	},
	posToVelocity : function(pos){
		var pct = pos / 500;
		var vmax = 500;
		var v = vmax - (vmax * pct);
		return v;
	},
	reDraw3d: function(normalizedPosition){
        var mouseEvent = { 
			clientX: $(window).width() * normalizedPosition[0], 
			clientY: $(window).height() * normalizedPosition[2] };
        onDocumentMouseMove(mouseEvent);
		
	},
	SimplePlayLoop: function(frame, pointers, positionKey){
	    for(var i = 0; i < pointers.length; i++) {
	        var ptr = pointers[i];
	        var position = ptr[positionKey];
			var note = this.posToNote(position[0]);
			var velocity = this.posToVelocity(position[1]);
			piano.noteOn(i, note, velocity, 0);
			this.reDraw3d(frame.interactionBox.normalizePoint(position, true))
		}
	},
	SimplePlay: function(frame){
		// replacement for playkeys which will play notes based just on the position of the hand.
	    this.SimplePlayLoop(frame, frame.hands, "palmPosition");
	},
	SimplePlayFingers: function(frame){
		// replacement for playkeys which will play notes based just on the position of the hand.
		var Stop = true;
		if(frame.hands.length === 0){
			// stop
		} else {
			for (var i = 0; i < frame.hands.length; i++) {
				// if we have at least one finger we can keep playing music
				if(frame.hands[i].fingers.length > 0){
					Stop = false;
				}
			}
		}
		if (Stop){
			MIDI.stopAllNotes();
		}
		for(var i = 0; i < frame.hands.length; i++) {
			this.SimplePlayLoop(frame, frame.pointables, "tipPosition");
		}
	}
}