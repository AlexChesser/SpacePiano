
function KeyTouch(isWhite, keyIndex, velocity) {
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
            },
            getKeyIndex: function() {
                return _keyIndex;
            },
            getVelocity: function() {
                return _velocity;
            },
            isWhite: function() {
                return _isWhite;
            }
        }
    }

var KeysLayer = {
	WHITEKEY_NUMBER : 10,
    OVERALL_BORDER : 0,
    BASE_NOTE_INDEX: 48,
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
            if (normalizedPosition[1] < 0.5 + this.KEYTOUCH_THRESHOLD &&
                normalizedPosition[1] > 0.5 - this.KEYTOUCH_THRESHOLD) {
                var key = this.findKey(normalizedPosition);
                
                if (key) {
                    key.setVelocity(interactionBox.normalizePoint(pointable.tipVelocity, true)[1]);
                    resultList.push(key);
                }
            }
            
            var mouseEvent = { clientX: $(window).width() * normalizedPosition[0], clientY: $(window).height() * normalizedPosition[2] };
            onDocumentMouseMove(mouseEvent);
        }
        
        return resultList;
    },
	findKey : function(pos) {
        var xIndex = Math.floor((pos[0] - this.OVERALL_BORDER) / this.KEY_WIDTH());
        if (pos[2] > 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER) {
            return new KeyTouch(true, xIndex, 0);
        }

        if (pos[2] < 0.5 && xIndex >= 0 && xIndex < this.WHITEKEY_NUMBER
              && xIndex % 7 != 2 && xIndex % 7 != 6) {
            return new KeyTouch(false, xIndex, 0);
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
	PlayKeys: function(frame){
	    var pointableOutput = document.getElementById("result");
	    var pointableString = "";

	    var keyList = this.getAllTouchedKeys(frame);
	    for (var i = 0; i < keyList.length; i++) {
            if (keyList[i].getVelocity() < 0.5 && keyList[i].getVelocity() > 0) {
                if (keyList[i].isWhite()) {
			        piano.noteOn(0, this.whiteKeyIndexToNote(keyList[i].getKeyIndex()), (keyList[i].getVelocity() * 2) * 127, 0);
                } else {
                    piano.noteOn(0, this.blackKeyIndexToNote(keyList[i].getKeyIndex()), (keyList[i].getVelocity() * 2) * 127, 0);
                }
            }
	    }	
	}
}