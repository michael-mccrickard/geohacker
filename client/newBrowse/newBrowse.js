//newBrowse.js

Browser = function(  ) {

	this.init = function( _code ) {

		this.code = _code;

		this.videoCtl = display.ctl["VIDEO"];

		this.video = this.videoCtl.getFile();
	}

	this.draw = function(  _obj ) {

        _obj.width = $(".centerImg").outerWidth() + 16;

        _obj.height = $(".centerImg").outerHeight() + 16; 

        _obj.top  = $(".divCenterImg").position().top;

        _obj.left  = $(window).width() * .35;		
	}

	this.playVideo = function( _id ) {

		if (_id) this.video = _id;

		this.videoCtl.play();
	}

	this.playVideoByIndex = function( _index ) {

		this.videoCtl.index.set( _index );

		this.videoCtl.playNewVideo();
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

     leaderImage: function() {

    	return hack.getLeaderPic();
  	},

     leaderName: function() {

    	return hack.getLeaderName();
  	},

  	video: function() {

  		return display.browser.videoCtl.items;
  	},

  	leftEdgeVideos: function() {

  		var _count = display.browser.videoCtl.items.length;

  		var _fullWidth = _count * (120 + 8);

  		return ( $(window).width() / 2) - (_fullWidth/2);
  	}

 });

Template.newBrowse.events({

    'click .imgFlag': function(event, template) {

		game.user.browseCountry( db.getRandomRec( db.ghC ).c );
      },
 });


Template.newBrowse.rendered = function() {

	display.browser.playVideo();

	stopSpinner();
}