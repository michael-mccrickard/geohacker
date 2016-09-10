//newBrowse.js

Browser = function(  ) {

	this.updateFlag = new Blaze.ReactiveVar(false);

	this.videoBGFile = "featuredBackdrop.jpg";

	this.index = 0;

	this.init = function( _code ) {

		if (!editor) editor = new Editor();
		
		this.primary = [];

		this.code = _code;

		this.videoCtl = display.ctl["VIDEO"];

		this.video = this.videoCtl.getFile();

		//make primaries

		this.primaryItems = [];

		var _obj = new Meme("modal", "Map", hack.getCountryMapURL() );

		this.primaryItems.push( _obj );

	
		var _items = db.ghVideo.find( { cc: hack.countryCode, dt: { $in: ["gn","sd","tt"] } } ).fetch();

		var _meme = null;


		//primary videos

		var _arrCode = ["gn", "sd", "tt"];

		var _arrName = ["Geography Now", "Seeker Daily", "Top Ten Archive"];

		for (var i = 0; i < _arrCode.length; i++) {

			_index = Database.getObjectIndexWithValue( _items, "dt", _arrCode[i] );

			if (_index != -1) {

				_obj = _items[ _index ];

				_meme = new Meme("video", _arrName[i], "http://img.youtube.com/vi/" + _obj.u + "/default.jpg", _obj.u);

				this.primaryItems.push(_meme);
			}

		}

	}

	this.draw = function(  _obj ) {

        _obj.width = $(".centerImg").outerWidth() + 16;

        _obj.height = $(".centerImg").outerHeight() + 16; 

        _obj.top  = $(".divCenterImg").position().top;

        _obj.left  = $(window).width() * .35;		
	}

	this.playVideo = function( _id, _index ) {

		//reset our plain bg if we are using YouTube
		//(otherwise the src on the bg is an animated .gif file; this happens in video.js)

		if ( Control.isYouTubeURL( _id) ) {

			this.setVideoBG( this.videoBGFile );
		}
		else {

			//for a non-youtube video ( a .gif), we have to flip the button image from pause to play
			//if they clicked the video button while it was playing (pausing the video)

			if (this.videoCtl.state.get() == sPlaying) {

				if (_id == this.video) {

					this.videoCtl.pause();

					this.setThumbForGIF(_index, this.videoCtl.playControlPic )

					return;
				}
			}

		}

		this.video = _id;

		//If we are playing this .gif and not pausing it, then we have to change the button image to pause

		if ( !Control.isYouTubeURL(_id) ) this.setThumbForGIF(_index, this.videoCtl.pauseControlPic )

		this.videoCtl.playNewVideo( _id );


	}

	this.playVideoByIndex = function( _index ) {

		//are they clicking a different video?

		if (_index != this.videoCtl.index.get() ) {

			//is there a video currently playing

			if (this.videoCtl.state.get() == sPlaying ) {

				//if the current video is a gif, then switch its picture to the play button, since we are about to "auto-pause" it

				if ( !Control.isYouTubeURL( this.video) )  this.setThumbForGIF( this.videoCtl.index.get(), this.videoCtl.playControlPic )
			}
			
		}

		this.videoCtl.index.set( _index );

		this.playVideo( this.videoCtl.items[_index].u, _index );
	}

	this.setVideoBG = function( _file ) {

		$(".centerImg").attr("src", _file);
	}

	this.setThumbForGIF = function(_index, _file) {

		$("#video" + _index).attr("src", _file);
	}

	this.setVideoSize = function( _obj ) {

          $("iframe#ytplayer").css("height", _obj.height );

          $("iframe#ytplayer").css("width", _obj.width );  
	}

	this.setCurrentThumbToPause = function() {

		var _index = this.videoCtl.index.get();

		this.setThumbForGIF( _index, this.videoCtl.pauseControlPic);
	}

	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}
}