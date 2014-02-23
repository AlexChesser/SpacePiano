window.onload = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./MIDI.js/soundfont/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			window.piano = MIDI;
			window.controller = new Leap.Controller();
			var currentframe = 0;
			MIDI.setVolume(0, 255);
			controller.on('frame', function(frame) {
			  currentframe++;
		      if(currentframe % 10 == 0){
					currentframe = 0;
					KeysLayer.PlayKeys(frame)
					FedbackLayer.update(frame);
			  }
			});
			window.controller.connect();
		}
	})
	BoxField();
}
