Template.debrief.rendered = function () {

	stopSpinner();

	if (hack.debrief.waitingNow) return;  //in this case, imagesLoaded will call draw()

	hack.debrief.draw();

  	hack.debrief.checkAudio();

  	if (hack.mode == mHackDone) Meteor.setTimeout( function() { hack.debrief.changeHeadline("CLICK ANYWHERE TO CONTINUE") }, 2000 );

}


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

	this.sound = "debrief.mp3";

/*********************************************

	DEBRIEF CODES  -- dt field in database  (which table in db uses this code; plus info about the data in the record)

common -- used by all countries

	ant = anthem, nation anthem sound file (sound: file = sound file)

	ldr = leader name & pic (image and text and debrief;  text = leader name, debrief text = leader title)
	
	cap = capital name & pic (image and text and debrief; text = capital name, image = capital pic, debrief = code only)

	cmp -- normal map pic with name of country visible (image = pic file)

	rmp -- redacted map pic with name of country obscured (image = pic file)

	map -- a map that naturally has no identifying country name on it, used as both cmp and rmp (image = pic file)


	//By convention, there is only one language sound file per country
	//and it matches whatever lng_ record is found in the debrief records

	lng = language (sound = sound file)
	
	//language name records (one per country)

	lng_o = official language name (debrief text = name)
	lng_om =  official language name, one of multiple official languages (debrief text = name)
	lng_i = indigenous language name (debrief text = name)

optional -- used by some countries

	cus, cus[X] -- "custom" debrief (could be anything)/ (image or web) + debrief (image or web = pic file, debrief text = caption text)

	hqt, hqt[X] --  "headquarters" debrief / businesses headquartered in the country / (image or web) + debrief (image or web = pic file, debrief text = caption text)

	text & image pairs -- used by some countries as debriefs / text clues and tag text.
	When used as a debrief / text clue:  text = name of entity, debrief = explanatory text, image or web = relevant image
	When used as tag text, there will be a rec (with pic) in ghTag with this code

		art -- artist (broadly speaking, could be writer, musician, actor, etc.)

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

/*

if (this.arr.length == 0 ) this.arr = db.ghDebrief.find( { cc: this.countryCode, dt: "lng_om" } ).fetch();

if (this.arr.length == 0 ) this.arr = db.ghDebrief.find( { cc: this.countryCode, dt: "lng_i" } ).fetch();

*/
		this.index = Database.getRandomValue(this.arr.length);
	}

	this.changeHeadline = function( _text) {
		
		$("#headlineText").text( "" );

		$("#headlineText").text( _text );

		this.centerHeadline();

		display.playEffect3("agentMessage2.mp3");
	}

	this.draw = function() {

		$("#debriefText").text( this.text );

		 Meteor.defer( function() { hack.debrief.finishDraw(); } );
	}

	this.finishDraw = function( ) {

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

		if (this.code == "lng") this.image = hacker.soundPlayingPic;

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

        	hack.debrief.imageSrc = display.getImageFromFile( hack.debrief.image );  

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
		else {

			display.playEffect( this.sound );
		}
	}

	this.go = function() {

  		this.waitingNow = true;

  		this.set( this.index );

  		this.checkAudio();
	}

}



Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		display.playEffect("new_feedback.mp3");

  		if (game.user.mode == uBrowseCountry) {

  			hacker.feature.resetToPrevious();

			Meteor.setTimeout( function() { FlowRouter.go("/main") }, 100 ) ;

			return;
  		}

  		Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 100 ) ;
  	},

  'click #debriefNavPrev': function (e) { 

  		e.preventDefault();

 		var debrief = hack.debrief;

  		//display.playEffect("new_feedback.mp3");

  		debrief.index--;

  		if (debrief.index == -1) debrief.index = debrief.arr.length - 1;

  		debrief.go();

  	},

  'click #debriefNavNext': function (e) { 

  		e.preventDefault();

    	var debrief = hack.debrief;

  		//display.playEffect("new_feedback.mp3");

  		debrief.index++;

  		if (debrief.index == debrief.arr.length) debrief.index =  0;

  		debrief.go();

  	},

}

Template.debrief.helpers({

    headline: function() {

    	if (game.user.mode == uBrowseCountry) {

    		return "DEBRIEFING FOR " + hack.getCountryName();
  		}
  		else {

    		return "MISSION DEBRIEFING FOR STREAM " + hack.messageID;  			
  		}
    },

    navButtonsVisible: function() {

    	if (hack.mode == mHackDone) return "hidden";

    	return "";
    }
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