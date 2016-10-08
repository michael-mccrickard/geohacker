HelpVideo = function() {

	this.file = "";

	this.play = function( _ID ) {

 		Session.set("sYouTubeOn", false);

        this.file = _ID;

        if (Control.isYouTubeURL( this.file )) {

          if (youTubeLoaded == false) {
            
            c("calling YT.load() in HelpVideo")
            
            YT.load();
          }
          else {

          	c("loading YT vid by ID in Helpvideo")
            
            ytplayer.loadVideoById( this.file );            
          }

          Session.set("sYouTubeOn", true);
		}
	}
	

	this.getID = function( _which ) {

		if (_which == "INTRO") return "04m-o9mine8";

		if (_which == "HACK") return "4xaH7b8HpAI";

		if (_which == "EXPLORE") return "3k01PSvD5F8";

		if (_which == "CUSTOMIZE") return "o0k4cwGuOHI";
	}

	this.draw = function(_obj) {

		 _obj.top = 100;

		 _obj.left = 32;

		 _obj.width = $(window).height() * 0.85;

		 _obj.height = _obj.width * 16/9;

	}
} 
