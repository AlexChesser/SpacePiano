var changeInstrument = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./midi-js-soundfonts/FluidR3_GM/",
		instrument: $("#instrument option:selected").text(),
		callback: function() {
			window.piano = MIDI;
			
			// actually, now that we're using up to 14 pointers, maybe we need to 
			// update all channels when we change the instrument.
			// unless we actually want to have a mix of instruments .. ooooh 
			for(var i = 0; i < 14; i++) {
				piano.programChange(i,  $("#instrument option:selected").val());
			}
			FedbackLayer.init();
			window.controller = new Leap.Controller();
			var currentframe = 0;
			MIDI.setVolume(0, 127);
			
			controller.on('frame', function(frame) {
			  currentframe++;
		      if(currentframe % $("#playspeed").val() == 0){
					currentframe = 0;
					KeysLayer.SimplePlayFingers(frame)
					FedbackLayer.update(frame);
			  }
			});
			window.controller.connect();
		}
	})	
}

window.onload = function(){
	BoxField();
	changeInstrument()
}
