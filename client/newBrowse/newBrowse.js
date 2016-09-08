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

	this.playVideo = function( _id ) {

		if (_id) this.video = _id;

		//reset our plain bg if we are using YouTube
		//(otherwise the src on the bg is an animated .gif file; this happens in video.js)

		if ( Control.isYouTubeURL( _id) ) {

			this.setVideoBG( this.videoBGFile );
		}

		this.videoCtl.playNewVideo();
	}

	this.playVideoByIndex = function( _index ) {

		this.videoCtl.index.set( _index );

		this.playVideo( this.videoCtl.items[_index].u );
	}

	this.setVideoBG = function( _file ) {

		$(".centerImg").attr("src", _file);
	}

	this.setVideoSize = function( _obj ) {

          $("iframe#ytplayer").css("height", _obj.height );

          $("iframe#ytplayer").css("width", _obj.width );  
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

		return this.n;
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

  			if (display.browser.videoCtl.state.get() == sPlaying && !Control.isYouTubeURL(display.browser.video) ) {

  				return display.browser.videoCtl.pauseControlPic;
  			}
  			else {

  				return display.browser.videoCtl.playControlPic;
  			}
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

	display.browser.playVideo();

	stopSpinner();
}