var KeysLayer = {
	WHITEKEY_NUMBER : 14,
    OVERALL_BORDER : 0.02,
    KEY_WIDTH : (1 - 2 * this.OVERALL_BORDER) / this.WHITEKEY_NUMBER,
    KEYTOUCH_THRESHOLD : 0.05,
    getAllTouchedKeys: function(frame) {
        var resultList = [];
        var pointables = frame.pointables;
        for (var i = 0, pointable; pointable = pointables[i++]; ) {
            var interactionBox = frame.interactionBox;
            var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);
            if (normalizedPosition[1] < 0.5 + this.KEYTOUCH_THRESHOLD &&
                normalizedPosition[1] > 0.5 - this.KEYTOUCH_THRESHOLD) {
                var key = this.findKey(normalizedPosition);
                
                if (key) {
                    key.setVelocity(interactionBox.normalizePoint(pointable.tipVelocity, true)[1]);
                    resultList.push(key);
                }
            }
        }
        return resultList;
    },
	findKey : function(pos) {
        var xIndex = Math.floor((pos[0] - this.OVERALL_BORDER) / this.KEY_WIDTH);
        if (pos[2] > 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER) {
            return new this.KeyTouch(true, xIndex, 0);
        }

        if (pos[2] < 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER
              && xIndex % 7 != 2 && xIndex % 7 != 6) {
            return new this.KeyTouch(false, xIndex, 0);
        }
    },
    KeyTouch : function(isWhite, keyIndex, velocity) {
        var _keyIndex = keyIndex;
        var _isWhite = isWhite;
        var _velocity = velocity;

        return {
            printKey: function () {
                return "note: " + _keyIndex + "<br />" + "isWhite: " + _isWhite +
            "<br />" + _velocity + "<br />";
            },
            setVelocity: function (velocity) {
                _velocity = velocity;
            }
        }
    },
	PlayKeys: function(frame){
	    var hands = frame.hands;
	    var pointables = frame.pointables;

	    var pointableOutput = document.getElementById("result");
	    var pointableString = "";

	    var keyList = this.getAllTouchedKeys(frame);

	    for (var i = 0; i < keyList.length; i++) {
	        pointableString += keyList[i].printKey();
			//piano.noteOn(0, note, 127, 0);

	
	    }
		
		
	}
}