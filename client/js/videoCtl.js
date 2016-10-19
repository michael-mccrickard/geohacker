VideoCtl = function() {

	this.name = "VIDEO";

	this.playControlPic = Video.playControlPic;

	this.pauseControlPic = Video.pauseControlPic;

	this.iconPic = "video_icon2.png"; 

	this.scanningPic = "anim_video.gif"

	this.video = null;

	this.items = [];


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

		var _state = this.getState();

		var _file = this.items[ this.getIndex() ].u;

		//We don't need to do anything special for a YT file

		if (youtube.isFile(_file) == false) {

			//Non-YT file, so if we're paused, we just show the big play button

			if ( _state == sPaused ) {

				_file = this.playControlPic;
			}

		}

		return _file;
	}


    this.show = function() {

    	if (!this.video.isYouTube) return;

		console.log("video.show() is turning on YT")
        
        youtube.show();
    }

	this.pause = function(){

		this.setState( sPaused );

		this.video.pause();

		display.feature.setImage("VIDEO");

	}


	this.play = function( _id ) {

		this.setState( sPlaying );

		var _file = this.items[ this.getIndex() ].u;

		if (_id) _file = _id;

		//First, is it a YT?

		if (youtube.isFile(_file)) {

			this.video.play();

			return;

		}

	

	},// end play

	this.playNewVideo = function(_id) {

	  if (this.isYouTube ) {

	  	if (ytplayer) ytplayer.stopVideo();

	  //set the yt flag to false, so that playMedia
	  //won't think we're resuming from a pause

		Session.set("sYouTubeOn", false);    

	  }

	  this.play( _id );

	}, //end playNewVideo


	this.playAnotherVideo = function(_val) {

		this.index.set( this.index + _val);

		this.play();
	}

	this.playYouTube = function( _file) {

		this.setState( sPlaying );

		//if the YT player doesn't exist, then create it
		//and the onYouTubeIframeAPIReady() function will load the correct
		//file for us 

		if (youTubeLoaded == false) {
		  
		  console.log("ytplayer being created")

		  display.feature.video = _file;  

		  this.youTubeWaiting.set( true );
		  
		  //in this case, we let onYouTubeIframeAPIReady() load the correct file and play it
		  //it will also set youTubeLoaded

		  YT.load();

		  return;
		}

		this.isYouTube = true;

		if (_file == ytplayer.getVideoData()['video_id']) {

			console.log("ytplayer resuming from pause")

			ytplayer.playVideo();

		}
		else {

		  //otherwise just load this next file into the player

		  display.feature.video = _file;  

		  console.log("video.js: ytplayer playing new video")        

		  ytplayer.loadVideoById( _file );

		}

		c("video.playYouTube is setting sYouTubeOn to true")

		Session.set("sYouTubeOn", true); 

	}//end playYouTube


}  //end Video constructor

Video.prototype = Control;