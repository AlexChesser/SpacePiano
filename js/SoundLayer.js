var SoundLayer = {
	init : function(){


		MIDI.loadPlugin(function() {
			MIDI.noteOn(0, 100, 127, 0); // plays note once loaded
		}, "MIDI.js/soundfont/acoustic_grand_piano-ogg.js");
	}
	
	
}