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
			window.currentframe = 0;
			controller.on('frame', function(frame) {
			  // your code here
			  currentframe++
		      if(frame.hands.length > 0 && currentframe % 60 == 0)
		      {
				  for (var i = 0; i < frame.hands.length; i++){
			          var hand = frame.hands[i];
			          var position = hand.palmPosition;
			          var velocity = hand.palmVelocity;
			          var direction = hand.direction;
					  console.log(position);
					  piano.noteOn(0, position, velocity, 0);
				  }
			  }
			});

			window.controller.connect();
		}
	})
}
