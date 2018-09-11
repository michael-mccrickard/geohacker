Help = function() {

	this.video = null;

	this.playVideo = function( _which ) {

 		youtube.hide();

        this.videoid = this.getVideoID( _which );

        this.video = new Video( this.videoid, display.help);

        this.video.play();

        refreshWindow("help");
	
	}
	

	this.getVideoID = function( _which ) {

		//if (_which == "INTRO") return "BS1rWxgRdqM";

		if (_which == "HACK") return "xWMzzysh44s";

		if (_which == "EXPLORE") return "3k01PSvD5F8";

		if (_which == "CUSTOMIZE") return "o0k4cwGuOHI";
	}

	this.drawVideo = function(_obj) {

		 _obj.top = 116;

		 _obj.left = 32;

		 _obj.width = $(window).width() * 0.85;

		 _obj.height = _obj.width * 9/16;

	}
} 
