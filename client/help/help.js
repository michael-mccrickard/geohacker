Help = function() {

	this.video = "";

	this.playVideo = function( _which ) {

 		Session.set("sYouTubeOn", false);

        this.video = this.getVideoID( _which );

        if (Control.isYouTubeURL( this.video )) {

          if (youTubeLoaded == false) {
            
            c("calling YT.load() in Help.js")
            
            YT.load();
          }
          else {

          	c("loading YT vid by ID in Help.js")
            
            ytplayer.loadVideoById( this.video );            
          }

          Session.set("sYouTubeOn", true);
		}
	}
	

	this.getVideoID = function( _which ) {

		if (_which == "INTRO") return "04m-o9mine8";

		if (_which == "HACK") return "4xaH7b8HpAI";

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
