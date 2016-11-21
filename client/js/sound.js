

  Sound = function() {

	this.name = "SOUND";

	this.iconPic = "sound_icon2.png"; 

	this.scanningPic = "anim_sound.gif"

	this.soundPlayingPic = "vu_meter1.gif";

    this.soundPausedPic = "vu_meter1_static.gif"

    this.playControlPic = "play_icon.png";

    this.pauseControlPic = "pause_icon.png";


	this.init = function() {

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}


	this.setData = function( _item) {

	  _item.setName( this.name );

	  _item.imageFile = this.soundPlayingPic;

	  _item.soundFile = this.items[ this.getIndex() ].u;

	  _item.videoFile = null;

	  _item.fileToLoad = this.soundPlayingPic;

	  this.text = "";
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


	this.play = function() {

		if (this.getState() == sPaused) hacker.feature.item.changeImage( this.soundPlayingPic )

		this.setState( sPlaying );

		this.playMedia();

	},


	this.pause = function() {

		c("SOUND pausing")

		this.setState( sPaused );

		hacker.feature.item.changeImage( this.soundPausedPic );

	    document.getElementById("soundPlayer").pause();

	},

  	this.playMedia = function() {

		var _file = this.getFile();

		if (_file == $("#soundPlayer").attr("src")) {

			c("sound.playMedia() is resuming sound play")
		
			document.getElementById("soundPlayer").play();

		}
		else {
			
			c("sound.playMedia() is playing new file")
			
			$("#soundPlayer").attr("src", _file);

			Meteor.setTimeout( function() { document.getElementById("soundPlayer").play(); }, 250);   

			game.setSoundControlListener();   

		}
	},


	this.setItems = function() {

		//don't use the anthems

		this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "ant" } } ).fetch();

		this.fullCount = this.items.length;
	},


	this.suspend = function() {
c("sound suspend")
		if (this.getState() == sPlaying) {
c("calling pause()")
			this.pause();
		}
	}
}

Sound.prototype = Control;