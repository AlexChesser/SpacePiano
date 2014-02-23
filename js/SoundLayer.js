window.onload = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./midi-js-soundfonts/FluidR3_GM/",
		instrument: "fx_7_echoes",
		callback: function() {
			window.piano = MIDI;
			piano.programChange(0, 102);
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
