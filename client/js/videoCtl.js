VideoCtl = function() {

	this.name = "VIDEO";

	this.playControlPic = Video.playControlPic;

	this.pauseControlPic = Video.pauseControlPic;

	this.iconPic = "video_icon2.png"; 

	this.scanningPic = "anim_video.gif"

	this.video = null;

	this.items = [];

	this.collection = db.ghVideo;

	this.element = "img.featuredPic";


	this.init = function() {

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}

	 this.suspend = function() {

	 	if (this.getState() == sPlaying) {

			c("videoctl is suspending the video")

	 		this.pause();

	 		this.hide()
	 	}
	 }

	this.hide = function() {

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

	this.setItems = function() {

	  	//screen out the ones used as primaries in the newBrowser

	    this.items = this.collection.find( { cc: this.countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

	},

	//Used to get the file to display in featured area.
	//Usually this returns the content, but if animated gif is paused
	//it returns the big play button

	this.getFile = function() {

		var file = null;

		var _file = this.items[ this.getIndex() ].u;

		return _file;
	}


    this.show = function() {

    	this.video.show();
    }

	this.pause = function(){

		this.setState( sPaused );

		this.video.pause();

	}


	this.play = function( _id ) {

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


}  //end Video constructor

VideoCtl.prototype = Control;