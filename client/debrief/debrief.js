
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

	this.code = "";

	this.arr = [];

	this.alreadyLoaded = false;

	this.init = function( _code ) {

		this.countryCode = _code;

		this.arr = db.ghD.find( { cc: this.countryCode } ).fetch();

		this.index = Database.getRandomValue(this.arr.length);

		this.alreadyLoaded = false;
	}

	this.draw = function() {

		$("#debriefText").text( this.text );

		 this.imageSrc = Control.getImageFromFile( this.image );  

		 Meteor.setTimeout( function() { hack.debrief.finishDraw(); }, 100);
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

		Meteor.defer( function() { this.centerHeadline(); } );
	}


	this.initForEditor = function( _type ) {

		this.countryCode = hack.countryCode;

		if (_type == undefined) return;

		this.rec = db.ghD.findOne( { cc: this.countryCode, dt: _type } );

		this.code = _type.substr(0,3);

		if (this.code == "lng") hack.playLanguageFile();	

		this.setImage();

		this.setText();
	}

	this.setImage = function() {

		this.image = "";

		if (this.code == "lng") this.image = display.soundPlayingPic;

		if (this.code == "flg")  this.image = hack.getFlagPic();

		if (this.code == "hq")  this.image = hack.getHeadquartersPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (this.code == "cus")  this.image = hack.getCustomPic( this.rec.dt );		

		if (!this.image.length) this.image = getS3URL( this.rec.f );

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
    
			if (hack.debrief.alreadyLoaded)  {

				hack.debrief.draw(); 
			}
			else {

				//in this case, template.rendered will call draw();

				hack.debrief.alreadyLoaded = true; 
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

		//the code is the first 3 letters in the field, but our headquarters code is just 2 letters

		if (this.rec.dt  == "hq") {

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

}

Template.debrief.rendered = function () {

	hack.debrief.draw();

	if (hack.debrief.code == "lng") {

		hack.playLanguageFile();	
	} 

}

Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		Control.playEffect("new_feedback.mp3");

  		if (game.user.mode == uBrowse) {

  			display.mainTemplateReady = false;

  			display.feature.resetToPrevious();

			Meteor.setTimeout( function() { FlowRouter.go("/main") }, 100 ) ;

			return;
  		}

  		Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 100 ) ;
  	},

  'click #debriefNavPrev': function (e) { 

  		e.preventDefault();

 		var debrief = hack.debrief;

  		Control.playEffect("new_feedback.mp3");

  		debrief.index--;

  		if (debrief.index == -1) debrief.index = debrief.arr.length - 1;

  		debrief.set( debrief.index );

		if (debrief.code == "lng") {

			hack.playLanguageFile();	
		} 
  	},

  'click #debriefNavNext': function (e) { 

  		e.preventDefault();

    	var debrief = hack.debrief;

  		Control.playEffect("new_feedback.mp3");

  		debrief.index++;

  		if (debrief.index == debrief.arr.length) debrief.index =  0;

  		debrief.set( debrief.index );

 		if (debrief.code == "lng") {

			hack.playLanguageFile();	
		} 
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

	arrDebrief = db.ghD.find( { } ).fetch();

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