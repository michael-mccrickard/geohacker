Video = function( _file, _parent ) {

	this.element = "";

	this.isYouTube = false;

	this.isGIF = false;

	this.parent = _parent;

	display.videoParent = _parent;  //allows hacker.suspendMedia() to suspend play

	this.state = new Blaze.ReactiveVar( sNone );  //only sPlaying or sPaused once we are accessed

	if ( youtube.isFile( _file) ) {

		this.isYouTube = true;
	}
	else {

		this.isGIF = true;
	}

	this.file = _file;

	//set the GIF element to be used for display of animated gifs based on parent

	if (this.parent === display.browser) this.element = "img.video";

	if (this.parent === hacker.ctl["VIDEO"]) this.element = "img.featuredPic";

	if (this.parent === editor) this.element = "img.bigPic";
	

	this.play = function() {

		this.state.set( sPlaying );

	 	if (this.isYouTube) {

	 		if ( !youtube.loaded )  {

	 			//Video parent objects (display, display.browser, editor, intro) are responsible for setting
	 			//the appropriate videoid property on themselves, so that the onYouTubeIframeAPIReady() callback 
	 			//knows which video to play

	 			youtube.load();

	 		}
	 		else {

	 			 youtube.play( this.file ); 
	 		}
	 	}
	 	else {

	 		//it's possible the player doesn't exist yet

	 		if (youtube && ytplayer) {

		 		youtube.stop();

		 		youtube.hide();	 			
	 		}

	 		$( this.element ).attr("src", this.file );
	 	}
	 }

	 this.pause = function() {

	 	this.state.set( sPaused );

	 	if (this.isYouTube) youtube.pause();
	 }

	 this.stop = function() {

	 	if (this.isYouTube) youtube.stop();
	 }

	 this.hide = function() {

	 	if (this.isYouTube) {

	 		youtube.hide()
	 	}
	 	else {

			c("Hiding the GIF video with 'hidden' class on videoParent.element")

	 		$(this.element).addClass("hidden");
	 	}
	 }

	 this.show = function() {

	 	if (this.isYouTube) {

	 		youtube.show()
	 	}
	 	else {

			c("showing the GIF video by removing the 'hidden' class on videoParent.element")

	 		$(this.element).removeClass("hidden");
	 	}
	 }

}

Video.playControlPic = "play_icon.png";

Video.pauseControlPic = "pause_icon.png";

Video.setSize = function( _obj) {

    $("iframe#ytplayer").css("height", _obj.height );

     $("iframe#ytplayer").css("width", _obj.width );  
}

Video.setPos = function(_obj) {

    $(".featuredYouTubeVideo").css("top", _obj.top);

    $(".featuredYouTubeVideo").css("left",  _obj.left);  
}