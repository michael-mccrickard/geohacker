/*

  class Sound extends Set {

  	constructor() {

  		super("SOUND");

		this.name = "SOUND";

		this.soundPlayingPic = "vu_meter1.gif";

	    this.soundPausedPic = "vu_meter1_static.gif"


		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}


	setData( _item) {

	  _item.setName( this.name );

	  _item.imageFile = this.soundPlayingPic;

	  _item.soundFile = this.items[ this.getIndex() ].u;

	  _item.videoFile = null;

	  _item.fileToLoad = this.soundPlayingPic;

	  this.text = "";
	}

	play() {

		if (this.getState() == sPaused) hacker.feature.item.changeImage( this.soundPlayingPic )

		this.setState( sPlaying );

		this.playMedia();

	}


	pause() {

		c("SOUND pausing")

		this.setState( sPaused );

		hacker.feature.item.changeImage( this.soundPausedPic );

	    document.getElementById("soundPlayer").pause();

	}

  	playMedia() {

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
	}


	setItems() {

		//don't use the anthems

		this.items = this.collection.find( { cc: this.countryCode, dt: { $ne: "ant" } } ).fetch();

		this.fullCount = this.items.length;
	}


	suspend() {

		if (this.getState() == sPlaying) {

			this.pause();
		}
	}
}

*/