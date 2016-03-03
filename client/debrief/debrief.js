
var topMargin = 115;

var leftMargin = 25;

var fontWidth = 13.5;

Debrief = function() {

	//this.hack = _hack;

	this.countryCode = "";

	this.rec = null;

	this.index = 0;

	this.image = "";

	this.text = "";

/*********************************************

	DEBRIEF CODES  (dt field in database)

common -- used by all countries

	ldr = leader name & pic (image and text and debrief;  text = leader name, debrief = leader title)
	
	cap = capital name & pic (image and text and debrief)

	cmp -- normal map pic with name of country visible (image)

	rmp -- redacted map pic with name of country obscured (image)

	map -- a map that naturally has no identifying country name on it, used as both cmp and rmp (image)


	//By convention, there is only one language sound file per country
	//and it matches whatever lng_ record is found in the debrief records

	lng = language file (sound)
	
	//language name records (one per country)

	lng_o = official language name (debrief)
	lng_om =  official language name, one of multiple official languages (debrief)
	lng_i = indigenous language name (debrief)

optional -- used by some countries

	cus, cus[X] -- debrief / image or web pairs (could be anything)

	hqt, hqt[X] --  debrief / image or web pairs for businesses headquarted in the country

	text & image pairs -- used by some countries as debriefs / text clues and tag text.
	When used as a debrief / text clue:  text = name of entity, debrief = explanatory text, image or web = relevant image
	When used as tag text, there will be a rec (with pic) in ghTag with this code

		art -- artist (broadly speaking, could be writer, musician, actor, etc.)

		bus, bus[X] -- business name

		lan, lan[X] -- landmark

special cases
	agt -- agent (used in agent tags generated on the fly)

**********************************************/

	this.code = "";

	this.arr = [];

	this.waitingNow = false;

	this.init = function( _code ) {

		this.waitingNow = false;

		this.countryCode = _code;

		this.arr = db.ghDebrief.find( { cc: this.countryCode } ).fetch();

		this.index = Database.getRandomValue(this.arr.length);
	}

	this.draw = function() {

		$("#debriefText").text( this.text );

		 Meteor.defer( function() { hack.debrief.finishDraw(); } );
	}

	this.finishDraw = function() {

	    var fullScreenWidth = $(window).width();

	    var fullScreenHeight = $(window).height();

	    var container = "div.debriefBox"

	    var maxWidth = $( container ).width() * 0.85;

	    var fullHeight = $( container ).height() * 0.85;

	    var _width = (fullHeight / this.getImageHeight() ) * this.getImageWidth(); 

	    if (_width > maxWidth) _width = maxWidth;

	    var _top = $(container).offset().top;

	    var _left = ($( container ).width()/2) - (_width / 2 );

		var container = "img.debriefPicFrame";

		$( container ).css("left",  _left.toString() + "px" );  

		$( container ).css("top", "5%");

		$( container ).attr("height", fullHeight );

		$( container ).attr("width", _width );    

		$( container ).attr("src", this.image );    	

		//headline

		this.centerHeadline();

		//footer

		container = "h3.geoFont.debriefText";

		_width = $( container ).width();

		$( container ).css("left",  fullScreenWidth/2 - _width/2 );

		$( container ).css("top",  (fullScreenHeight - display.menuHeight) * 0.93 );  	

	}

	this.centerHeadline = function() {

	    var fullScreenWidth = $(window).width();

	    var fullScreenHeight = $(window).height();

		container = "div.debriefHeadline";

		_width = $( container ).width();

		$( container ).css("left",  fullScreenWidth/2 - _width/2 );

		$( container ).css("top",  (fullScreenHeight - display.menuHeight) * 0.095 );  	

	}

	this.set = function( _index ) {

		this.rec = this.arr[ _index ];

		this.code = this.rec.dt.substr(0,3);	

		this.setText();

		this.setImage();

		this.preloadImage();
	}

	//used by errors.js and editing system functions

	this.setHeadline = function( _text ) {

		$("#debriefText").text( _text );

		Meteor.defer( function() { hack.debrief.centerHeadline(); } );
	}


	this.initForEditor = function( _type ) {

		this.countryCode = hack.countryCode;

		if (_type == undefined) return;

		this.rec = db.ghDebrief.findOne( { cc: this.countryCode, dt: _type } );

		this.code = _type.substr(0,3);

		if (this.code == "lng") hack.playLanguageFile();	

		this.setImage();

		this.setText();
	}

	this.setImage = function() {

		this.image = "";

		if (this.code == "lng") this.image = display.soundPlayingPic;

		if (this.code == "flg")  this.image = hack.getFlagPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (!this.image.length) this.image = hack.getCustomPic( this.rec.dt );		

	} 

	this.getImageHeight = function() {

		return this.imageSrc.height;
	}

	this.getImageWidth = function() {

		return this.imageSrc.width;
	}	

	this.preloadImage = function() {

		$("#preloadDebrief").attr("src", this.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	hack.debrief.imageSrc = Control.getImageFromFile( hack.debrief.image );  

        	if (hack.debrief.waitingNow) {

        		hack.debrief.waitingNow = false;

        		//it takes a moment to create the off-screen image (for dimensioning)
        		//in the call the getImageFromFile() above

        		Meteor.setTimeout( function() { hack.debrief.draw(); }, 200 );
        	}

        });

	}

	this.setText = function() {

		this.text = "";

		if (this.code == "cap") {

			var capital = hack.getCapitalName();

			this.text = capital + " is the capital of " + hack.getCountryName() + ".";
		}

		if (this.code == "ldr") {

			var leaderName = hack.getLeaderName();

			var leaderType = hack.getLeaderType();

			this.text = leaderName + " is the " + leaderType + " of " + hack.getCountryName() + ".";
		}

		//the code is the first 3 letters of the field and dt is the full field

		if (this.code  == "hqt") {

			this.text = this.rec.t + " is headquartered in " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_i") {

			this.text = this.rec.t + " is one of the indigenous languages of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_o") {

			this.text = this.rec.t + " is the official language of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_om") {

			this.text = this.rec.t + " is one of the official languages of " + hack.getCountryName() + ".";
		}

		if (!this.text.length) this.text = this.rec.t;

	}

	this.checkAudio = function() {

		if (this.code == "lng") {

			hack.playLanguageFile();	
		} 
	}

	this.goNext = function() {

  		this.waitingNow = true;

  		this.set( this.index );

  		this.checkAudio();
	}

}

Template.debrief.rendered = function () {

	if (hack.debrief.waitingNow) return;  //in this case, imagesLoaded will call draw()

	hack.debrief.draw();

  	hack.debrief.checkAudio();

}

Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		Control.playEffect("new_feedback.mp3");

  		if (game.user.mode == uBrowse) {

//  			display.mainTemplateReady = false;

  			display.feature.resetToPrevious();

			Meteor.setTimeout( function() { FlowRouter.go("/main") }, 100 ) ;

			return;
  		}

  		Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 100 ) ;
  	},

  'click #debriefNavPrev': function (e) { 

  		e.preventDefault();

 		var debrief = hack.debrief;

  		//Control.playEffect("new_feedback.mp3");

  		debrief.index--;

  		if (debrief.index == -1) debrief.index = debrief.arr.length - 1;

  		hack.debrief.goNext();

  	},

  'click #debriefNavNext': function (e) { 

  		e.preventDefault();

    	var debrief = hack.debrief;

  		//Control.playEffect("new_feedback.mp3");

  		debrief.index++;

  		if (debrief.index == debrief.arr.length) debrief.index =  0;

  		hack.debrief.goNext();

  	},

}

Template.debrief.helpers({

    headline: function() {

    	if (game.user.mode == uBrowse) {

    		return "DEBRIEFING FOR " + hack.getCountryName();
  		}
  		else {

    		return "MISSION DEBRIEFING FOR STREAM " + hack.messageID;  			
  		}
    },
})

Template.miniDebrief.helpers({

    leaderPic: function() {

    	//assuming this case for now

        return hack.getLeaderPic();  
    },
})



//temporary editing hacks



dodb = function() {

	Session.set("mode", mEdit);

	arrDebrief = db.ghDebrief.find( { } ).fetch();

	Session.set("dIndex", 0);
}

stopdb = function() {
	
	hack.mode = mNormal;
}

donext = function() {
		
	var i = Session.get("dIndex");

	i++;

	var rec = arrDebrief[i];

	hack.countryCode = rec.cc;

	Session.set("dIndex", i);
}

//end temporary editing hacks