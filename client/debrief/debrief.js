
var topMargin = 115;

var leftMargin = 25;

var fontWidth = 13.5;

Debrief = function() {

	this.countryCode = "";

	this.rec = null;

	this.image = "";

	this.text = "";

	this.code = "";

	this.arr = [];

	//need a way for the editor to get back data from a specific (not random) record

	this.init = function() {

		this.countryCode = hack.countryCode;

		var arr = db.ghD.find( { cc: this.countryCode } ).fetch();

		this.rec = Database.getRandomElement(arr);

		this.code = this.rec.dt.substr(0,3);	

		this.setImage();

		this.setText();
	}

	this.initForEditor = function( _type ) {

		this.countryCode = hack.countryCode;

		if (_type == undefined) return;

		this.rec = db.ghD.findOne( { cc: this.countryCode, dt: _type } );

		this.code = _type.substr(0,3);	

		this.setImage();

		this.setText();
	}

	this.setImage = function() {

		this.image = "";

		if (this.code == "flg" || this.code == "lng")  this.image = hack.getFlagPic();

		if (this.code == "hq")  this.image = hack.getHeadquartersPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (this.code == "cus")  this.image = hack.getCustomPic( this.rec.dt );		

		if (!this.image.length) this.image = this.rec.f;

		this.imageSrc = Control.getImageFromFile( this.image ); 

	} 

	this.getImageHeight = function() {

		return this.imageSrc.height;
	}

	this.getImageWidth = function() {

		return this.imageSrc.width;
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

  		Meteor.setTimeout( function() { Router.go("/congrats") }, 100 ) ;
  	}
}

Template.debrief.helpers({

	debriefImage: function() {

		return hack.debrief.image;
	},

	debriefText: function() {

		return hack.debrief.text;
	},

})


refreshDebriefWindow = function() {

    var fullScreenWidth = $(window).width();

    var fullScreenHeight = $(window).height();

    var container = "div.debriefBox"

    var maxWidth = $( container ).width() * 0.85;

    var fullHeight = $( container ).height() * 0.85;

    var _width = (fullHeight / hack.debrief.getImageHeight() ) * hack.debrief.getImageWidth(); 

    if (_width > maxWidth) _width = maxWidth;

    var _top = $(container).offset().top;

    var _left = ($( container ).width()/2) - (_width / 2 );

	var container = "img.debriefPicFrame";

	$( container ).css("left",  _left );  

	$( container ).css("top", "5%");

	$( container ).attr("height", fullHeight );

	$( container ).attr("width", _width );    

	$( container ).attr("src", hack.debrief.image );    	

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