Template.debrief.rendered = function () {

	stopSpinner();

  	Meteor.setTimeout( function() { hacker.debrief.changeHeadline("CLICK ANYWHERE TO CONTINUE") }, 2000 );

}


var topMargin = 115;

var leftMargin = 25;

var fontWidth = 13.5;

DebriefCollection = function( _countryCode ) {

	this.items = [];

	var _arr = db.ghMeme.find( { cc: _countryCode } ).fetch();  

	for (var i = 0; i < _arr.length; i++) {

		this.items.push( new Debrief( _arr[i] ) );
	}

}

Debrief = function( _meme ) {

	this.sound = "debrief.mp3";

	this.meme = _meme;


	this.show = function() {

		doSpinner();

		this.preloadImage();
	}

	this.changeHeadline = function( _text) {
		
		$("#headlineText").text( "" );

		$("#headlineText").text( _text );

		this.centerHeadline();

		display.playEffect3("agentMessage2.mp3");
	}

	this.draw = function() {

		$("#debriefText").text( this.meme.text );

		 Meteor.defer( function() { hacker.debrief.finishDraw(); } );
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

		$( container ).attr("src", this.meme.image );    	

		$( container ).css("opacity", "0");

		$( container ).removeClass("hidden");

		$( container ).velocity("fadeIn", { duration: 500, display: "auto" });		


		//headline

		this.centerHeadline();

		//footer

		container = "h3#debriefText.geoFont";

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



	//used by errors.js and editing system functions

	this.setHeadline = function( _text ) {

		$("#debriefText").text( _text );

		Meteor.defer( function() { hacker.debrief.centerHeadline(); } );
	}


	this.initForEditor = function( _type ) {

		this.countryCode = hack.countryCode;

		if (!_type) return;

		var _rec = db.ghMeme.findOne( { cc: this.countryCode, dt: _type } );

		this.meme = new Meme( _rec, "debrief" );

		this.meme.init();

		if (this.meme.code == "lng") hack.playLanguageFile();	
	}



	this.getImageHeight = function() {

		return this.meme.imageSrc.height;
	}

	this.getImageWidth = function() {

		return this.meme.imageSrc.width;
	}	

	this.preloadImage = function() {

		$("#preloadDebrief").attr("src", this.meme.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	hacker.debrief.meme.imageSrc = display.getImageFromFile( hacker.debrief.meme.image );  

        	FlowRouter.go("/debrief");

        	//it takes a moment to create the off-screen image (for dimensioning)
        	//in the call the getImageFromFile() above

        	Meteor.setTimeout( function() { hacker.debrief.draw(); }, 500 );

        	Meteor.setTimeout( function() { hacker.debrief.checkAudio(); }, 501 );

        });

	}



	this.checkAudio = function() {

		if (this.meme.code.substr(0,3) == "lng") {

			hack.playLanguageFile();	
		} 
		else {

			display.playEffect( this.sound );
		}
	}

}




//temporary editing hacks



dodb = function() {

	Session.set("mode", mEdit);

	arrDebrief = db.ghMeme.find( { } ).fetch();

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