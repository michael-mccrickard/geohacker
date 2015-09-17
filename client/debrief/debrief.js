
var topMargin = 115;

var leftMargin = 25;

var fontWidth = 13.5;

Debrief = function() {

	this.countryCode = "";

	this.rec = null;

	this.index = 0;

	this.image = "";

	this.text = "";

	this.code = "";

	this.arr = [];

	this.init = function() {

		this.countryCode = hack.countryCode;

		this.arr = db.ghD.find( { cc: this.countryCode } ).fetch();

		this.index = Database.getRandomValue(this.arr.length);
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

		container = "div.debriefHeadline";

		_width = $( container ).width();

		$( container ).css("left",  fullScreenWidth/2 - _width/2 );

		$( container ).css("top",  (fullScreenHeight - display.menuHeight) * 0.095 );  	


		//footer

		container = "h3.geoFont.debriefText";

		_width = $( container ).width();

		$( container ).css("left",  fullScreenWidth/2 - _width/2 );

		$( container ).css("top",  (fullScreenHeight - display.menuHeight) * 0.93 );  	

	}

	this.set = function( _index ) {

		this.rec = this.arr[ _index ];

		this.code = this.rec.dt.substr(0,3);	

		if (this.code == "lng") hack.playLanguageFile();	

		this.setText();

		this.setImage();

		this.preloadImage();
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

		if (this.code == "lng") this.image = display.ctl["SOUND"].soundPlayingPic;

		if (this.code == "flg")  this.image = hack.getFlagPic();

		if (this.code == "hq")  this.image = hack.getHeadquartersPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (this.code == "cus")  this.image = hack.getCustomPic( this.rec.dt );		

		if (!this.image.length) this.image = this.rec.f;

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
    
          //now that the image is loaded ...
		  
		  hack.debrief.draw();

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

Template.debrief.events = {

  'click #divDebrief': function (e) { 

  		e.preventDefault();

  		Control.playEffect("new_feedback.mp3");

  		if (hack.mode == mBrowse) {

			Meteor.setTimeout( function() { FlowRouter.go("/main") }, 100 ) ;

			return;
  		}

  		Meteor.setTimeout( function() { FlowRouter.go("/congrats") }, 100 ) ;
  	},

  'click #debriefNavPrev': function (e) { 

  		e.preventDefault();

  		Control.playEffect("new_feedback.mp3");

  		hack.debrief.index--;

  		if (hack.debrief.index == -1) hack.debrief.index = hack.debrief.arr.length - 1;

  		hack.debrief.set( hack.debrief.index );
  	},

  'click #debriefNavNext': function (e) { 

  		e.preventDefault();

  		Control.playEffect("new_feedback.mp3");

  		hack.debrief.index++;

  		if (hack.debrief.index == hack.debrief.arr.length) hack.debrief.index =  0;

  		hack.debrief.set( hack.debrief.index );
  	},

}

Template.debrief.rendered = function () {

	refreshWindow("router-debrief");
}

Template.miniDebrief.helpers({

    leaderPic: function() {

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