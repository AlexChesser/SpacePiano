var KeysLayer = {
	WHITEKEY_NUMBER : 108,
    OVERALL_BORDER : 0,
    BASE_NOTE_INDEX: 21,
    KEY_WIDTH : function() {
            return (1 - 2 * this.OVERALL_BORDER) / this.WHITEKEY_NUMBER;
        },
    KEYTOUCH_THRESHOLD : 0.2,
    getAllTouchedKeys: function(frame) {
        var resultList = [];
        var pointables = frame.pointables;
        for (var i = 0, pointable; pointable = pointables[i++]; ) {
			
            var interactionBox = frame.interactionBox;
            var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
            var key = this.findKey(normalizedPosition);
                
            if (key) {
                resultList.push(key);
            }
            
            var mouseEvent = { clientX: $(window).width() * normalizedPosition[0], clientY: $(window).height() * normalizedPosition[2] };
            onDocumentMouseMove(mouseEvent);
        }
        
        return resultList;
    },
	KeyTouch: function(isWhite, keyIndex, height) {
	        var _keyIndex = keyIndex;
	        var _isWhite = isWhite;
	        var _height = height;

	        return {
	            printKey: function () {
	                return "note: " + _keyIndex + "<br />" + "isWhite: " + _isWhite +
	            "<br />" + _height + "<br />";
	            },
	            getKeyIndex: function() {
	                return _keyIndex;
	            },
	            getHeight: function() {
	                return _height;
	            },
	            isWhite: function() {
	                return _isWhite;
	            }
	        }
	    },	
	findKey : function(pos) {
        var xIndex = Math.floor((pos[0] - this.OVERALL_BORDER) / this.KEY_WIDTH());
        if (pos[2] > 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER) {
            return new this.KeyTouch(true, xIndex, pos[1]);
        }

        if (pos[2] < 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER
              && xIndex % 7 != 2 && xIndex % 7 != 6) {
            return new this.KeyTouch(false, xIndex, pos[1]);
        }
    },
    numberOfSkippedBlackKeys : function(index) {
       return Math.floor(index / 7) + Math.floor((index % 7) / 3);
    },
    whiteKeyIndexToNote : function(index) {
        return this.BASE_NOTE_INDEX + 2 * index - this.numberOfSkippedBlackKeys(index);
    },
    blackKeyIndexToNote : function(index) {
        return this.BASE_NOTE_INDEX + 2 * index + 1 - this.numberOfSkippedBlackKeys(index);  
    },
	tmp: function(frame){
		console.log(this.getAllTouchedKeys(frame));
		this.tmp = function(){};
	},
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
	},
	PlayKeys: function(frame){
	    var pointableOutput = document.getElementById("result");
	    var pointableString = "";

	    var keyList = this.getAllTouchedKeys(frame);
		
	    for (var i = 0; i < keyList.length; i++) {
			
			//piano.noteOn(0, 21+(Math.round(keyList[i].getKeyIndex()*100)), (1 - keyList[i].getHeight()) * 127, 0);
			console.log(keyList[i].getKeyIndex());
			
			
            if (keyList[i].isWhite()) {
			    piano.noteOn(0, this.whiteKeyIndexToNote(keyList[i].getKeyIndex()), (1 - keyList[i].getHeight()) * 127, 0);
            } else {
                piano.noteOn(0, this.blackKeyIndexToNote(keyList[i].getKeyIndex()), (1 - keyList[i].getHeight()) * 127, 0);
            }

	    }	
	}
}