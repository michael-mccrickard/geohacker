//newBrowse.js

Browser = function(  ) {

	this.updateFlag = new Blaze.ReactiveVar(false);

	this.videoBGFile = "featuredBackdrop.jpg";

	this.init = function( _code ) {
		
		this.primary = [];

		this.code = _code;

		this.videoCtl = display.ctl["VIDEO"];

		this.video = this.videoCtl.getFile();

		//make primaries

		var _obj = new Meme( "Map", hack.getCountryMapURL() );

		this.primary.push( _obj );
	

		_obj = new Meme("Anthem", display.ctl["SOUND"].playControlPic);

		_obj.soundFile = hack.getAnthemFile();

		this.primary.push( _obj);	
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

		this.videoCtl.playNewVideo();


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

var fullWidth = 1500;


function scaleMe( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return _val + "px";

}

Template.newBrowse.helpers({

	country: function() {

		//var _val = game.lesson.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;
	},

	homelandText: function() {

		return this.ht;
	},

	TTSize: function() {

		if (this.tts) return scaleMe(this.tts);

		return scaleMe(20);
	},

	HTSize: function() {

		if (this.hts) return scaleMe(this.hts);

		return scaleMe(31.11);
	},

	TTColor: function() {

		if (this.ttc) return this.ttc;

		return "yellow";
	},	

	HTColor: function() {

		if (this.htc) return this.htc;

		return "white";
	},	

	countryName: function() {

		return hack.getCountryName();
	},

    capitalImage: function() {

    	return hack.getCapitalPic();
  	},

     capitalName: function() {

    	return hack.getCapitalName();
  	},

     flagImage: function() {

    	return hack.getFlagPic();
  	},

  	flagMaxHeight: function() {

  		return $(window).height() * 0.08;
  	},

  	flagMaxWidth: function() {

  		return $(window).width() * 0.117;
  	},

     leaderImage: function() {

    	return hack.getLeaderPic();
  	},

     leaderName: function() {

    	return hack.getLeaderName();
  	},

  	video: function() {

  		return display.browser.videoCtl.items;
  	},

  	videoThumbnailOrFile: function() {

   		display.browser.updateFlag.get(); 		

  		if ( Control.isYouTubeURL(this.u) ) {

  			return ("http://img.youtube.com/vi/" + this.u + "/default.jpg");
  		}
  		else {

			return display.browser.videoCtl.playControlPic;
		}
  	},

  	leftEdgeVideos: function() {

  		display.browser.updateFlag.get();

  		var _count = display.browser.videoCtl.items.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2);
  	},

  	primary: function() {

  		return display.browser.primary;
  	},

   	leftPrimaryEdge: function( _index ) {

  		display.browser.updateFlag.get();

  		var _count = display.browser.primary.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2) + (_index * (120 + 8) );
  	},

   	leftVideoEdge: function( _index ) {

  		display.browser.updateFlag.get();

  		var _count = display.browser.videoCtl.items.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2) + (_index * (120 + 8) );
  	},

 });

Template.newBrowse.events({

    'click .imgFlag': function(event, template) {

		game.user.browseCountry( db.getRandomRec( db.ghC ).c );
      },

    'click .imgPrimaryThumb': function(event, template) {

		var _p = event.target.id;

		$('#zoomInModal').modal('show');

		if ( _p == "Map" ) {

			display.meme.preloadImage( hack.getCountryMapURL() );
		}


      },
 });


Template.newBrowse.rendered = function() {

	display.browser.playVideoByIndex(0);

	//if ( !Control.isYouTubeURL( display.browser.video) ) display.browser.setCurrentThumbToPause();

	stopSpinner();
}