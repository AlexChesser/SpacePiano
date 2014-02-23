var changeInstrument = function(){
	MIDI.loadPlugin({
		soundfontUrl: "./midi-js-soundfonts/FluidR3_GM/",
		instrument: $("#instrument option:selected").text(),
		callback: function() {
			window.piano = MIDI;
			
			piano.programChange(0,  $("#instrument option:selected").val());
			FedbackLayer.init();
			window.controller = new Leap.Controller();
			var currentframe = 0;
			MIDI.setVolume(0, 127);
			
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
}

window.onload = function(){
	BoxField();
	changeInstrument()
}
