window.onload = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./MIDI.js/soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			/*
			var delay = 0; // play one note every quarter second
			var note = 50; // the MIDI note
			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay + 0.75);
			*/
			window.piano = MIDI;
	        window.controller = new Leap.Controller();
			var currentframe = 0;
			var notes = {};
			
			MIDI.setVolume(0, 255);
			controller.on('frame', function(frame) {
			  // your code here
			  currentframe++
		      if(frame.hands.length > 0 && currentframe % 10 == 0)
		      {
				  currentframe = 0;
				  for (var i = 0; i < frame.hands.length; i++){

			          var hand = frame.hands[i];
			          var position = hand.palmPosition;
			          var velocity = hand.palmVelocity;
			          var direction = hand.direction;
					  var np = frame.interactionBox.normalizePoint(position, true);
					  var  note = np[0];
					  // the piano appears to start making noise at note #20 
					  // i don't know how that maps on to anything but we want to normalize to a number 
					  // between roughly 20 and ... more. 
					  note = Math.round(note * 100+20,0);
					  console.log(note);					  
					  piano.noteOn(0, note, 512, 0);
				  }
			  }
			  
			});

			window.controller.connect();
		}
	})
}
