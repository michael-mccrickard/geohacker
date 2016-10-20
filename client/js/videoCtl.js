VideoCtl = function() {

	this.name = "VIDEO";

	this.playControlPic = Video.playControlPic;

	this.pauseControlPic = Video.pauseControlPic;

	this.iconPic = "video_icon2.png"; 

	this.scanningPic = "anim_video.gif"

	this.video = null;

	this.items = [];

	this.collection = db.ghVideo;


	this.init = function() {

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}

	this.suspend = function() {

		console.log("video.suspend() is pausing the video")
		
		this.video.pause();

		this.setState( sPaused );

		this.hide();
		 
	}

	this.hide = function() {

		youtube.hide(); 
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

    	if (!this.video.isYouTube) return;

		console.log("videoCtl.show() is showing youtube")
        
        youtube.show();
    }

	this.pause = function(){

		this.setState( sPaused );

		this.video.pause();

	}


	this.play = function( _id ) {

		this.setState( sPlaying );

		var _file = this.getFile();

		if (_id) _file = _id;

c("new video in videoCtl with " + _file)

		this.video = new Video(_file, this);

		this.video.play();

	},// end play

	this.playNewVideo = function(_id) {

youtube.hide();

	  if (this.video) this.video.stop();

	  this.play( _id );

	} //end playNewVideo

/*

how to find the id for the current YT vid:

if (_file == ytplayer.getVideoData()['video_id'])

*/

	this.switch = function() {



		if (this.getState() == sPlaying) {
c("pausing in vc.switch")
			this.pause();

			return;
		}
		if (this.getState() == sPaused || this.getState() == sLoaded) {
c("plyaing in vc.switch")
			this.play();
		}
	}



}  //end Video constructor

VideoCtl.prototype = Control;