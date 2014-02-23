window.onload = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./midi-js-soundfonts/FluidR3_GM/",
		instrument: "acoustic_grand_piano",
		callback: function() {
			window.piano = MIDI;
			FedbackLayer.init();
			window.controller = new Leap.Controller();
			var currentframe = 0;
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, 108, 127, 0);
			
			controller.on('frame', function(frame) {
			  currentframe++;
		      if(currentframe % 5 == 0){
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
