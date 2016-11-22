/*********************************************

*****MOVE THIS TO DB_SCHEME.JS AFTER MEMES ARE IMPLEMENTED*****************************

	These data types are used across the database, in all the control tables except for ghWeb (sound, video, meme, image)

	The data type field is called "dt" in the database.
	  
	Explanantions below: (which table in db uses this code; plus info about the data in the record)

	These are also documented in editor.js in a more formal way, along with the video dt codes.

common -- used by all countries

	ant = anthem, nation anthem sound file (sound: file = sound file)

	ldr = leader name & pic (image and text and meme;  text = leader name, meme text = leader title)
	
	cap = capital name & pic (image and text and meme; text = capital name, image = capital pic, meme = code only)

	cmp -- normal map pic with name of country visible (image = pic file)

	rmp -- redacted map pic with name of country obscured (image = pic file)

	map -- a map that naturally has no identifying country name on it, used as both cmp and rmp (image = pic file)


	//By convention, there is only one language sound file per country
	//and it matches whatever lng_ record is found in the ghMeme records

	lng = language (sound = sound file)
	
	//language name records (one per country)

	lng_o = official language name (meme text = name)
	lng_om =  official language name, one of multiple official languages (meme text = name)
	lng_i = indigenous language name (meme text = name)

optional -- used by some countries

	cus, cus[X] -- "custom" meme (could be anything)/ (image or web) + meme (image or web = pic file, meme text = caption text)

	hqt, hqt[X] --  "headquarters" meme / businesses headquartered in the country / (image or web) + meme (image or web = pic file, meme text = caption text)

	text & image pairs -- used by some countries as debriefs / text clues
	When used as a debrief / text clue:  text = name of entity, meme text = explanatory text, image or web = relevant image

		art, art[X] -- artist (broadly speaking, could be writer, musician, actor, etc.)

		lan, lan[X] -- landmark

**********************************************/

Meme = function( _rec, _type )  {

	this.type = "";

	if (_type) {

		this.type = _type;

	}	

	this.rec = null;

	this.id = "";

	if (_rec) {

		this.rec = _rec;

		this.id = _rec._id

	}


	this.image = "";

	this.imageSrc = null;

	this.text = "";

	this.s = "";  //source, not used yet

	this.element = "div.divMeme";

	this.textElement = "div.memeText";

	this.imageElement = "img.memePicFrame";


	this.init = function() {

		if (this.rec.dt) this.code = this.rec.dt.substr(0,3);	

		this.setText();

		this.setImage();
	}

	this.setImage = function() {

		this.image = "";

		if (this.code == "lng") this.image = hacker.soundPlayingPic;

		if (this.code == "flg")  this.image = hack.getFlagPic();

		if (this.code == "ldr")  this.image = hack.getLeaderPic();

		if (this.code == "cap")  this.image = hack.getCapitalPic();

		if (!this.image.length) this.image = hack.getCustomPic( this.rec.dt );		

	} 

	this.setText = function() {

		this.text = "";

		var _type = this.type;

		//if (!_type) _type = this.type;

		if (this.code == "cap") {

			var capital = hack.getCapitalName();

			if ( _type == "debrief" ) this.text = capital + " is the capital of " + hack.getCountryName() + ".";

			if ( _type == "browse"  || _type == "hacker" ) this.text = capital;
		}

		if (this.code == "ldr") {

			var leaderName = hack.getLeaderName();

			var leaderType = hack.getLeaderType();

			if ( _type == "debrief" ) this.text = leaderName + " is the " + leaderType + " of " + hack.getCountryName() + ".";

			if ( _type == "browse" || _type == "hacker" ) this.text = leaderType + " " + leaderName;			
		}

		//the code is the first 3 letters of the field and dt is the full field

		if (this.code  == "hqt") {

			if ( _type == "debrief") this.text = this.rec.t + " is headquartered in " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_i") {

			if ( _type == "debrief" ) this.text = this.rec.t + " is one of the indigenous languages of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_o") {

			if ( _type == "debrief" ) this.text = this.rec.t + " is the official language of " + hack.getCountryName() + ".";
		}

		if (this.rec.dt  == "lng_om") {

			if ( _type == "debrief" ) this.text = this.rec.t + " is one of the official languages of " + hack.getCountryName() + ".";
		}

		if (!this.text.length) {

			this.text = this.rec.t;

			if ( _type == "browse" || _type == "hacker") {

				//use the clue version, if it exists

				if (this.rec.tc) this.text = this.rec.tc;		

			}

			if ( _type == "helper") {

				if (this.rec.ac) this.text = this.rec.ac;		

			}
		}
	}

	this.preloadImageForFeature = function() {

		//borrow the debrief preload element

		$("#preloadDebrief").attr("src", this.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	display.browser.featuredMeme.imageSrc = display.getImageFromFile( display.browser.featuredMeme.image );  

        	FlowRouter.go("/meme");

        	//it takes a moment to create the off-screen image (for dimensioning)
        	//in the call the getImageFromFile() above

        	Meteor.setTimeout( function() { display.browser.featuredMeme.drawFeatured(); }, 200 );

        });

	}

	this.preloadImageForSidewall = function() {

		//borrow the debrief preload element

		$("#preloadDebrief").attr("src", this.image );

        imagesLoaded( document.querySelector('#preloadDebrief'), function( instance ) {

        	//anything we need to do here?

        });

	}

	this.dim = function() {

		if ( $( this.imageElement).css("opacity") == "1" ) $("img.memePicFrame" ).velocity( { opacity: 0.3, duration: 300 });

		if ( $( this.textElement ).css("opacity") == "1" ) $("div.memeText" ).velocity( { opacity: 0.3, duration: 300 });

	}

	  this.show = function() {

	      $( this.imageElement ).css("opacity", 1);

	      $( this.textElement ).css("opacity", 1);

	  }

	  this.hide = function() {

	      $( this.imageElement ).css("opacity", 0);

	      $( this.textElement ).css("opacity", 0);
	  }


	this.drawFeatured = function( ) {

		$("div.memeText").text( this.text );

	    var fullScreenWidth = $(window).width();

	    var fullScreenHeight = $(window).height();

	    var maxWidth = fullScreenWidth;

	    var fullHeight = fullScreenHeight * 0.85;

	    var _width = (fullHeight / this.imageSrc.height ) * this.imageSrc.width; 

	    if (_width > maxWidth) _width = maxWidth;

	    var _left = (maxWidth/2) - (_width / 2 );

		var container = "img.memePicFrame";

		$( container ).css("left",  _left + "px" );  

		$( container ).css("top", "65px");

		$( container ).attr("height", fullHeight );

		$( container ).attr("width", _width );  

		$( container ).attr("src", this.image );
		

		var container = "div.memeText";

		$( container ).css("width", _width );  
		
		$( container ).css("left", _left );  


		this.show();
	}

	this.dimensionForHack = function( ) {

		this.imageSrc = hacker.feature.item.imageSrc;

		$("div.memeText").text( this.text );

	    var fullScreenWidth = $(window).width();

	    var fullBackdropWidth = $("img.featuredBackdrop").width();

	    var maxWidth = fullBackdropWidth;

        var fullHeight = $("img.featuredBackdrop").height();

	    var _width = (fullHeight / this.imageSrc.height ) * this.imageSrc.width; 

	    if (_width > maxWidth) _width = maxWidth;

	    var _left = (maxWidth/2) - (_width / 2 );

		var container = "img.memePicFrame";

		$( container ).css("left",  _left + "px" );  

		$( container ).css("top", display.menuHeight + "px");

		$( container ).attr("height", fullHeight );

		$( container ).attr("width", _width );  

		$( container ).attr("src", this.image );
		

		var container = "div.memeText";

		$( container ).css("width", _width );  
		
		$( container ).css("left", _left );  


		var _fontSize = "3.0vh";

		if (this.rec.fs) _fontSize = this.rec.fs * 1.5;

		$ ( container ).css("font-size", _fontSize);


		var _height = $ ( container ).innerHeight();

		var _top = fullHeight + display.menuHeight - _height;

		$( container ).css("top", _top );  

		hacker.ctl["MEME"].show();

		container = "img.memePicFrame";

		if ( $( container ).css("opacity") == 0 ) $( container ).velocity("fadeIn", { duration: 500, display: "auto" });	

		container = "div.memeText";

		if ( $( container ).css("opacity") == 0 ) $( container ).velocity("fadeIn", { duration: 500, display: "auto" });	
	}


}