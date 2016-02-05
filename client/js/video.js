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


	this.clearFeature = function() {

		console.log("video.clearFeature() is pausing the video")
		
		this.pauseVideo();

		game.playMusic();

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

	//this is basically the getFile function for video;
	//usually it returns the content, but if animated gif is paused
	//it returns the big play button

	this.getFeaturedPic = function() {

		var file = null;

		var _state = this.getState();

		var _file = this.items[ this.getIndex() ].u;

		//We don't need to do anything special for a YT file

		if (Control.isYouTubeURL(_file) == false) {

			this.isYouTube = false;

			//_file = Control.getNonYouTubeFile( _file );

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


    this.hide = function() {

        Session.set("sYouTubeOn", false);
    }

    this.show = function() {

		console.log("video.show() is turning on YT")
        
        Session.set("sYouTubeOn", true);
    }

	this.pauseVideo = function(){

		this.setState( sPaused );

		if (this.isYouTube) {

			var _file = this.items[ this.getIndex() ].u;

			if (_file == ytplayer.getVideoData()['video_id']) {

				ytplayer.pauseVideo();
			}
			else {

			  //since the video will start playing automatically ...

			  Control.stopSound("music");

			  ytplayer.loadVideoById( _file );			
			}

		}
	}


	this.playFeaturedContent = function() {

		Control.stopSound("music");

		this.setState( sPlaying );

		var _file = this.items[ this.getIndex() ].u;

		//First, is it a YT?

		if (Control.isYouTubeURL(_file)) {

			this.playYouTube( _file);

			return;

		}

		//... not YouTube, so we have a gif type.

		Session.set("sYouTubeOn", false);

		console.log("video.playFeaturedContent is playing animated gif")

		_file = Control.getNonYouTubeFile( _file );

		display.feature.loadAgain( "VIDEO" );

		//for newly-featured vids, this is redundant, but not for re-features

		Meteor.defer( function() { display.feature.draw(); } );


	},// end playFeaturedContent

	this.pauseFeaturedContent = function() {

		game.playMusic();

		//put control in pause mode 

		this.setState( sPaused );


		//We have to explicitly pause the YT file

		if (this.isYouTube ) {

		   	this.pauseVideo();
		}

	}, //end pauseMedia

	this.playNewVideo = function() {

	  if (this.isYouTube ) {

	  	ytplayer.stopVideo();

	  //set the yt flag to false, so that playMedia
	  //won't think we're resuming from a pause

		Session.set("sYouTubeOn", false);    

	  }

	  this.playFeaturedContent();

	}, //end playNewVideo

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


		//if (_file == display.feature.video ) {

		if (_file == ytplayer.getVideoData()['video_id']) {

			console.log("ytplayer resuming from pause")

			ytplayer.playVideo();

			return;

		}
		else {

		  //otherwise just load this next file into the player

		  display.feature.video = _file;  

		  console.log("video.js: ytplayer playing video")        

		  ytplayer.loadVideoById( _file );

		}

	}//end playMedia

}  //end Video constructor

Video.prototype = Control;