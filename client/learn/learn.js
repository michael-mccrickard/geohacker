//learn.js


Template.learnCountry.rendered = function() {

}

Template.learnCountry.onCreated(function () {

  // Use this.subscribe inside onCreated callback
  this.subscribe("allLeaders");
  this.subscribe("allCapitals");
  this.subscribe("allFlags");  

});

var fullWidth = 1700;


function scaleMe( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return _val + "px";

}

function scaleMe2( _val ) {

   var _w = $(window).width();

   _val = _val * (_w / fullWidth);

   return (_val * 0.95) + "px";

}

Template.learnCountry.helpers({

	LCWidth: function() {

		return scaleMe( 400 );

	},

	LCHeight: function() {

		return scaleMe( 222.22 );
	},  

	HTBaseFontSize: function() {

		return scaleMe( 31.11 );
	},

	capitalWidth: function() {

		return scaleMe( 257.77 );
	},

	learnRightWidth: function() {

		return scaleMe( 106.66 );
	}, 

	flagHeight: function() {

		return scaleMe( 64.44 );
	},  

	leaderHeight: function() {
		return scaleMe( 142.22 );
	},  

	capitalMarginTop: function() {
		return scaleMe( 8.88 );
	}, 

	capitalFontSize: function() {
		return scaleMe( 20 );
	}, 

	TTSize: function() {

		if (this.tts) return scaleMe(this.tts);

		return scaleMe( 20 )
	},

	HTSize: function() {

		if (this.hts) return scaleMe(this.hts);

		return scaleMe(31.11);
	},

	HTMarginLeft: function() {

		if (this.htl) return scaleMe2( this.htl );

		return scaleMe( -148.88);
	},

	/*  end scaled values */

	country: function() {

		var _val = game.lesson.updateFlag.get();

		return db.getCountryRec( hack.countryCode );

	},

	countryColor: function() {

		return this.co;
	},

	homelandText: function() {

		return this.ht;
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

     capitalOpacity: function() {

		if (this.hto) return this.hto;

		return "1.0";
  	},

    capitalTextColor: function() {

    	//the white text on a light-colored bg is problematic

		if (this.co == "#FFD700" || this.co == "#FFFF00" || this.co == "#33FFFF" || this.co == "#7FFFD4" || this.co == "#00FFFF" || this.co=="#87CEFA" || this.co == "#66FFFF") return "black"

		return "white";
  	},


     flagImage: function() {

    	return hack.getFlagPic();
  	},

     leaderImage: function() {

    	return hack.getLeaderPic();
  	},

     leaderName: function() {

    	return hack.getLeaderName();
  	}

 });


/*

var scaleFactorSmall = 216/360;

var scaleFactorMedium = 266/360;

var scaleFactorLarge = 316/360;

var scaleFactorXLarge = 346/360;

var widthBreakpointSmall = 1231;

var widthBreakpointMedium = 1341;

var widthBreakpointLarge = 1551;

var widthBreakpointXLarge = 1651;



function scaleMe( _val ) {

   var _w = $(window).width();

   if (_w < widthBreakpointSmall) return (scaleFactorSmall * _val) + "px";

   if (_w < widthBreakpointMedium) return (scaleFactorMedium * _val) + "px";

    if (_w < widthBreakpointLarge) return (scaleFactorLarge * _val) + "px";

   if (_w < widthBreakpointXLarge) return (scaleFactorXlarge * _val) + "px";


   return _val + "px";

}

function scaleMe2( _val ) {

   var _w = $(window).width();

   if (_w < widthBreakpointSmall) return (scaleFactorSmall * _val * 0.95) + "px";

   if (_w < widthBreakpointMedium) return (scaleFactorMedium * _val * 0.95) + "px";

    if (_w < widthBreakpointLarge) return (scaleFactorLarge * _val * 0.95) + "px";

   if (_w < widthBreakpointXLarge) return (scaleFactorXlarge * _val * 0.95) + "px";

   return (_val * 0.95) + "px";

}
*/