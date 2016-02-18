Video = function() {

	this.name = "VIDEO";


	this.playControlPic = "play_icon.png";

	this.pauseControlPic = "pause_icon.png";

	this.iconPic = "video_icon2.png"; 

	this.scanningPic = "anim_video.gif"

	this.isYouTube = false;  //boolean, is the current video a YT?

	this.youTubeWaiting = new Blaze.ReactiveVar( false );  //are waiting on the YT player to load?


	this.init = function() {

		this.index = new Blaze.ReactiveVar(0);

		this.state = new Blaze.ReactiveVar(0);
	}

	this.suspend = function() {

		console.log("video.suspend() is pausing the video")
		
		this.pause();

		this.hide();
		 
	}

	this.hide = function() {

		Session.set("sYouTubeOn", false);   
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

	//Used to get the file to display in featured area.
	//Usually this returns the content, but if animated gif is paused
	//it returns the big play button

	this.getFile = function() {

		var file = null;

		var _state = this.getState();

		var _file = this.items[ this.getIndex() ].u;

		//We don't need to do anything special for a YT file

		if (Control.isYouTubeURL(_file) == false) {

			this.isYouTube = false;


			//Non-YT file, so if we're paused, we just show the big play button

			if ( _state == sPaused ) {

				_file = this.playControlPic;
			}

		}
		else {

			this.isYouTube = true;
		}

		return _file;
	}


    this.show = function() {

    	if (!this.isYouTube) return;

		console.log("video.show() is turning on YT")
        
        Session.set("sYouTubeOn", true);
    }

	this.pause = function(){

		this.setState( sPaused );

		if (this.isYouTube) {

			var _file = this.items[ this.getIndex() ].u;

			ytplayer.pauseVideo();
		}
		else {
			display.feature.setImage("VIDEO");
		}
	}


	this.play = function() {

		this.setState( sPlaying );

		var _file = this.items[ this.getIndex() ].u;

		//First, is it a YT?

		if (Control.isYouTubeURL(_file)) {

			this.playYouTube( _file);

			return;

		}

		//... not YouTube, so we have a gif type.

		Session.set("sYouTubeOn", false);

		this.isYouTube = false; 

		if (game.user.mode == uBrowse) {

			display.feature.load( "VIDEO" );  //the imagesLoaded callback will update the screen

			return;
		}	

		//Not browse mode, not youtube

		//display.feature.setImageSource("VIDEO");


	},// end play

	this.pause = function() {

		//put control in pause mode 

		this.setState( sPaused );

		//how does display.feature get the big pause button displayed if file is GIF?

		//We have to explicitly pause the YT file

		if (this.isYouTube ) {

		   	ytplayer.pauseVideo();
		}

	}, //end pauseMedia

	this.playNewVideo = function() {

	  if (this.isYouTube ) {

	  	ytplayer.stopVideo();

	  //set the yt flag to false, so that playMedia
	  //won't think we're resuming from a pause

		//Session.set("sYouTubeOn", false);    

	  }

	  this.play();

	}, //end playNewVideo

	this.playAnotherVideo = function(_val) {

		this.index.set( this.index + _val);

		this.play();
	}

	this.playYouTube = function( _file) {

		this.setState( sPlaying );

		console.log("video.playYouTube is setting sYouTubeOn to true")
		
		Session.set("sYouTubeOn", true);    

		this.isYouTube = true;

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


		if (_file == ytplayer.getVideoData()['video_id']) {

			console.log("ytplayer resuming from pause")

			ytplayer.playVideo();

			return;

		}
		else {

		  //otherwise just load this next file into the player

		  display.feature.video = _file;  

		  console.log("video.js: ytplayer playing new video")        

		  ytplayer.loadVideoById( _file );

		}

	}//end playYouTube


}  //end Video constructor

Video.prototype = Control;