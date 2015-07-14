

  Sound = function() {

	this.name = "SOUND";

	this.iconPic = "sound_icon2.png"; 

	this.scanningPic = "anim_sound.gif"

	this.soundPlayingPic = "vu_meter1.gif";

    this.playControlPic = "play_icon.png";

    this.pauseControlPic = "pause_icon.png";


	this.init = function() {

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}
    

    //This supplies the appropriate picture file for the control

  	this.getControlPic = function() {

	    var pic = "";
	     
	    if (this.getState() == sLoaded || this.getState() == sPaused) pic = this.playControlPic;

	    if (this.getState() == sPlaying) pic = this.pauseControlPic;

	    if (this.getState() == sIcon) pic = this.iconPic;

	    if (this.getState() == sScanning) pic = this.scanningPic;

	    return pic;
  	},


	this.playFeaturedContent = function() {

		game.pauseMusic();

		this.setState( sPlaying );

		this.playMedia();

	},

	this.getFeaturedPic = function() {

		var pic = null;

		var _state = this.getState();

		if ( _state == sPaused ) pic = this.playControlPic;

		//getFeaturedPic is called for the newly selected (by newLoader.js) control,
		//so if we're in the scanning state, we know that file is about to automatically play
		//so we use the playing state picture

		if ( _state == sPlaying || _state == sScanning )  pic = this.soundPlayingPic;

		return pic;
	}

	this.pauseFeaturedContent = function() {

		//if (this.getState() != sPlaying ) return;

		c("SOUND pausing")

		this.setState( sPaused );

	    document.getElementById("soundPlayer").pause();

	    game.playMusic();
	},

  	this.playMedia = function() {
		
		c("SOUND playing")

		var _file = this.items[ this.getIndex() ].f;

		if (_file == $("#soundPlayer").attr("src")) {

			c("resuming sound play")
		
			document.getElementById("soundPlayer").play();

		}
		else {
			
			c("starting sound play of new file")
			
			$("#soundPlayer").attr("src", _file);

			Meteor.setTimeout( function() { document.getElementById("soundPlayer").play(); }, 250);   

			game.setSoundControlListener();   

		}
	},

	this.clearFeature = function( _newControlName ) {

		if ( _newControlName  ) {

			if (_newControlName == "VIDEO") {

				this.pauseFeaturedContent(); 
			}
			else {

				return;
			}
		}
		
		this.pauseFeaturedContent(); 
		
	},

	this.setItems = function() {

		//don't use the anthems

		this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "ant" } } ).fetch();
	},


	this.suspend = function() {

		if (this.getState() == sPlaying) {

			this.setState( sSuspend );

	    	document.getElementById("soundPlayer").pause();
		}
	}
}

Sound.prototype = Control;