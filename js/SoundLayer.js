var MIDIInstrumentMapping = {
	"acoustic_grand_piano" : 0,
	"bright_acoustic_piano" :1,
	"music_box" :10,
	"fx_5_brightness" :100,
	"fx_6_goblins" :101,
	"fx_7_echoes" :102,
	"fx_8_sci-fi" :103,
	"sitar" :104,
	"banjo" :105,
	"shamisen" :106,
	"koto" :107,
	"kalimba" :108,
	"bagpipe" :109,
	"vibraphone" :11,
	"fiddle" :110,
	"shanai" :111,
	"tinkle_bell" :112,
	"agogo" :113,
	"steel_drums" :114,
	"woodblock" :115,
	"taiko_drum" :116,
	"melodic_tom" :117,
	"synth_drum" :118,
	"reverse_cymbal" :119,
	"marimba" :12,
	"guitar_fret_noise" :120,
	"breath_noise" :121,
	"seashore" :122,
	"bird_tweet" :123,
	"telephone_ring" :124,
	"helicopter" :125,
	"applause" :126,
	"gunshot" :127,
	"xylophone" :13,
	"tubular_bells" :14,
	"dulcimer" :15,
	"drawbar_organ" :16,
	"percussive_organ" :17,
	"rock_organ" :18,
	"church_organ" :19,
	"electric_grand_piano" :2,
	"reed_organ" :20,
	"accordion" :21,
	"harmonica" :22,
	"tango_accordion" :23,
	"acoustic_guitar_nylon" :24,
	"acoustic_guitar_steel" :25,
	"electric_guitar_jazz" :26,
	"electric_guitar_clean" :27,
	"electric_guitar_muted" :28,
	"overdriven_guitar" :29,
	"honky-tonk_piano" :3,
	"distortion_guitar" :30,
	"guitar_harmonics" :31,
	"acoustic_bass" :32,
	"electric_bass_finger" :33,
	"electric_bass_pick" :34,
	"fretless_bass" :35,
	"slap_bass_1" :36,
	"slap_bass_2" :37,
	"synth_bass_1" :38,
	"synth_bass_2" :39,
	"electric_piano_1" :4,
	"violin" :40,
	"viola" :41,
	"cello" :42,
	"contrabass" :43,
	"tremolo_strings" :44,
	"pizzicato_strings" :45,
	"orchestral_harp" :46,
	"timpani" :47,
	"string_ensemble_1" :48,
	"string_ensemble_2" :49,
	"electric_piano_2" :5,
	"synth_strings_1" :50,
	"synth_strings_2" :51,
	"choir_aahs" :52,
	"voice_oohs" :53,
	"synth_choir" :54,
	"orchestra_hit" :55,
	"trumpet" :56,
	"trombone" :57,
	"tuba" :58,
	"muted_trumpet" :59,
	"harpsichord" :6,
	"french_horn" :60,
	"brass_section" :61,
	"synth_brass_1" :62,
	"synth_brass_2" :63,
	"soprano_sax" :64,
	"alto_sax" :65,
	"tenor_sax" :66,
	"baritone_sax" :67,
	"oboe" :68,
	"english_horn" :69,
	"clavinet" :7,
	"bassoon" :70,
	"clarinet" :71,
	"piccolo" :72,
	"flute" :73,
	"recorder" :74,
	"pan_flute" :75,
	"blown_bottle" :76,
	"shakuhachi" :77,
	"whistle" :78,
	"ocarina" :79,
	"celesta" :8,
	"lead_1_square" :80,
	"lead_2_sawtooth" :81,
	"lead_3_calliope" :82,
	"lead_4_chiff" :83,
	"lead_5_charang" :84,
	"lead_6_voice" :85,
	"lead_7_fifths" :86,
	"lead_8_bass_+_lead" :87,
	"pad_1_new_age" :88,
	"pad_2_warm" :89,
	"glockenspiel" :9,
	"pad_3_polysynth" :90,
	"pad_4_choir" :91,
	"pad_5_bowed" :92,
	"pad_6_metallic" :93,
	"pad_7_halo" :94,
	"pad_8_sweep" :95,
	"fx_1_rain" :96,
	"fx_2_soundtrack" :97,
	"fx_3_crystal" :98,
	"fx_4_atmosphere" :99
}

var InitDropdown = function (id, init){
	var select =  $(id),
		keys = Object.keys(MIDIInstrumentMapping).sort();
	
	for (var i = 0; i < keys.length; i++) { 
		var key = keys[i],
			selected = "";
		if(key === init){
			selected = "selected";
		}
		select.append("<option value='"+MIDIInstrumentMapping[key]+"' "+selected+">"+key+"</option>");
	}	
}

var changeInstrument = function(inst){
	MIDI.loadPlugin({
		soundfontUrl: "./midi-js-soundfonts/FluidR3_GM/",
		instrument: $("#instrument option:selected").text(),
		callback: function() {
			window.piano = MIDI;
			if(inst == undefined){
				inst = "#instrument_1"
				
			}
			// actually, now that we're using up to 14 pointers, maybe we need to 
			// update all channels when we change the instrument.
			// unless we actually want to have a mix of instruments .. ooooh
			console.log($(inst +" option:selected"))
			 
			for(var i = 0; i < 14; i++) {
				piano.programChange(i,  $(inst +" option:selected").val());
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
	InitDropdown("#instrument_1", "acoustic_grand_piano");
	InitDropdown("#instrument_2", "brass_section");
	BoxField();
	changeInstrument()
}
