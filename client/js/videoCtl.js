/*
class VideoCtl extends Set {

	constructor( _name ) {

		super("VIDEO");

		this.name = "VIDEO";

		this.video = null;

		this.items = [];

		this.collection = db.ghVideo;

		this.element = "img.featuredPic";		

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}


	setData( _item) {

		_item.setName( this.name );

		_item.imageFile = "";

		_item.soundFile = "";

		this.video = new Video( this.getFile(), this );

		if ( this.video.isGIF ) {

			_item.imageFile = this.video.file;

			_item.fileToLoad = this.video.file;
		}
		
		this.text = "";
	}

	suspend() {

	 	if (this.getState() == sPlaying) {

			c("videoctl is suspending the video")

	 		this.pause();

	 		this.hide()
	 	}
	 }

	hide() {

		this.video.hide();
	}

	//return the pic that should be displayed in the small control box
	//based on state


	this.getControlPic = function() {

	  var pic = "";
	 
	  var _state = this.getState();

	  if (_state == sIcon) pic = this.iconPic;

	  if (_state == sScanning) pic = this.scanningPic;

	  if (_state == sLoaded || _state == sPaused) pic = this.playControlPic;

	  if (_state == sPlaying) pic = this.pauseControlPic;

	  return pic;

	}, //end getControlPic


	setItems() {

	  	//screen out the ones used as primaries in the newBrowser

	    this.items = this.collection.find( { cc: this.countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

	    this.fullCount = this.items.length;

	}

	//Used to get the file to display in featured area.
	//Usually this returns the content, but if animated gif is paused
	//it returns the big play button

	getFile() {

		var file = null;

		var _file = this.items[ this.getIndex() ].u;

		return _file;
	}


    show() {

    	this.video.show();
    }

	pause() {

		this.setState( sPaused );

		this.video.pause();

	}


	play( _id ) {

		this.setState( sPlaying );

		var _file = this.getFile();

		if (_id) _file = _id;

		if (this.video) {

			if (this.video.file == _file) {

				this.video.play();

				return;
			}
		}

		c("new video in videoCtl with " + _file)

		this.video = new Video(_file, this);

		this.video.play();

	}// end play


}  //end Video object
*/