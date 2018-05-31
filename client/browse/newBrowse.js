//newBrowse.js

Browser2 = function(  ) {

	this.updateFlag = new Blaze.ReactiveVar(false);

	this.videoBGFile = "youtube.png";

	this.index = 0;

	this.video = null;

	this.videoIndex = new Blaze.ReactiveVar( -1 );

	this.primaryItems = [];  //units, can be video or an image in this case

	this.items = [];  //array of objects from ghVideo

	this.videoFrameID = "";  //ID of the div element with the playing video

	this.countryCode = "";  //we actually use hack.countryCode throughout, but we keep a copy
							//in this.countryCode, so we can tell when the country has changed
							//upon return from the browsemap (user could have simply viewed the map)

	this.loaded = false;

	//meme related

	this.featuredMeme = null;

	this.textElement = "";

	this.imageElement = "";

	this.imageSrc = null;

	this.meme = null;

	this.leftMeme = null;

	this.leftElement = "div.divBigPic";

	this.leftTextElement = "div.browserMemeText.bigPicText";

	this.leftImageElement = "img.bigPic";
	
	this.rightMeme = null;

	this.rightElement = "div.divSmallPic";

	this.rightTextElement = "div.browserMemeText.smallPicText";

	this.rightImageElement = "img.smallPic";

	this.soundTextElement = "div.soundText";

	this.leftWidth = 0.6;

	this.leftHeight = 0.69;

	this.rightWidth = 0.34;

	this.rightHeight = 0.31;

	this.memeIndex = -1;

	this.arrMeme = [];

	this.whichSide = "right";

this.memeDelay = 2500;

	this.rotatingMemes = false;  //true when the memes are currently being rotated (i.e., we have more than 2 memes)

	this.memeToEdit = null;

	this.defaultBigFontSize = "3.0vw";

	this.defaultSmallFontSize = "1.5vw";



	this.init = function( _code ) {

		if (!editor) editor = new Editor();

		this.arrMeme = [];

		//get the array of memes for this country

		var _arr = db.ghMeme.find( { cc: hack.countryCode, dt: { $nin: ["rmp", "map", "ant", "lng_i", "lng_o", "lng_om"] } } ).fetch();

		for (var i = 0; i< _arr.length; i++) {

			this.arrMeme.push( new Meme( _arr[i], "browse" ) );

			this.arrMeme[i].init();
		}

		Database.shuffle( this.arrMeme );

		this.leftMeme = this.arrMeme[0];

		this.rightMeme = this.arrMeme[1];

		this.textElement = this.leftTextElement;  //should match default whichSide above

		this.imageElement = this.leftImageElement;  //should match default whichSide above

		//make primaries, first the map modal
		
		this.primaryItems = [];

		var _obj = new Unit("modal", "Map", hack.getCountryMapURL() );

		this.primaryItems.push( _obj );

		//prepare to create the primary video units

		var items = [];

		_items = db.ghVideo.find( { cc: hack.countryCode, dt: { $in: ["gn","sd","tt"] } } ).fetch();

		var _unit = null;

		//the videos

		this.items = db.ghVideo.find( { cc: hack.countryCode } ).fetch();  //, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } 

		this.updateContent();

	}

	this.initForEdit = function( _code ) {

		if (!editor) editor = new Editor();

      	game.user.returnRoute = "/editor";

      	game.user.returnName = "editor";

		this.arrMeme = [];

		//get the array of memes for this country

		var _arr = db.ghMeme.find( { cc: hack.countryCode, dt: { $nin: ["rmp", "map", "ant", "lng_i", "lng_o", "lng_om"] } } ).fetch();

		for (var i = 0; i< _arr.length; i++) {

			this.arrMeme.push( new Meme( _arr[i], "browse" ) );

			this.arrMeme[i].init();
		}

		this.leftMeme = this.arrMeme[0];

		this.meme = this.leftMeme;


		this.rightMeme = this.arrMeme[0];

		this.memeIndex = 0;

		this.textElement = this.leftTextElement;  //should match default whichSide above

		this.imageElement = this.leftImageElement;  //should match default whichSide above

		this.updateContent();

	}

	this.dimensionPic = function( _side) {

		this.meme = this.leftMeme;

		var _sourceWidth = this.leftMeme.imageSrc.width;

		var _sourceHeight = this.leftMeme.imageSrc.height;

		var _sourceRatio =  _sourceWidth / _sourceHeight;

		var _targetRatio = (this.leftWidth * $(window).width() ) / ( this.leftHeight * $(window).height() ); 

		var _imageElement = this.leftImageElement;

		var _element = this.leftElement;

		var _left = 0;

		var _top = 0;

		var _width = this.leftWidth;

		var _height = this.leftHeight;

		var _pixelWidth = 0;

		var _pixelHeight = 0;


		if (_side == "right") {

			this.meme = this.rightMeme;

			_sourceWidth = this.rightMeme.imageSrc.width;

			_sourceHeight = this.rightMeme.imageSrc.height;

			_sourceRatio =  _sourceWidth / _sourceHeight;

			_targetRatio = ( this.rightWidth * $(window).width() ) / ( this.rightHeight * $(window).height() ); 

			_imageElement = this.rightImageElement;		

			_element = this.rightElement;

			_width = this.rightWidth;

			_height = this.rightHeight;
		}



		if ( _sourceRatio < _targetRatio)  {//taller, more portrait-like compared to target

			$(_imageElement).css("height","100%");

			$(_imageElement).css("width","");

			$(_imageElement).offset( {top: $( _element ).offset().top } );		

			_left = $( _element ).offset().left;

			_pixelHeight = _height * $(window).height();

			_pixelWidth = _sourceWidth * (_pixelHeight / _sourceHeight);

			_width = _width * $(window).width();

			_left = _left + (_width/2) - ( _pixelWidth/ 2);

			$(_imageElement).offset( {left: _left} );	


		}
		else {

			$(_imageElement).css("width","100%");

			$(_imageElement).css("height","");		

			$(_imageElement).offset( {left: $( _element ).offset().left } );		

			_top = $( _element ).offset().top;

			_pixelWidth = _width * $(window).width();

			_pixelHeight = _sourceHeight * (_pixelWidth / _sourceWidth);	

			_height = _height * $(window).height();

			_top = _top + (_height/2) - ( _pixelHeight/ 2);

			$(_imageElement).offset( {top: _top} );	

		}

	}

	this.draw = function(  _obj ) {

        _obj.width = $("img.video").outerWidth();

        _obj.height = $("img.video").outerHeight(); 

        _obj.top  = $("img.video").position().top;

        _obj.left  =  $("img.video").position().left;
	}

	//the preload callback in meme.js calls this one, if browser.loaded is false

	this.show = function() {

/*
c("browser.show()")

c("browser.show, this.leftMeme.loaded = " + this.leftMeme.loaded)

c("browser.show, this.rightMeme.loaded = " + this.rightMeme.loaded)
*/
		if (this.loaded) return;

		if (!this.leftMeme.loaded || !this.rightMeme.loaded) return;

		this.loaded = true;


		this.dimensionPic("right");

		$(this.rightImageElement).attr("src", this.rightMeme.image);

		$(this.rightTextElement).text( this.rightMeme.text );

		Meteor.setTimeout( function() { display.browser.whichSide = "right"; display.browser.setFontSize( display.browser.rightTextElement, display.browser.rightMeme )  }, 100 );

		this.dimensionPic("left");

		$(this.leftImageElement).attr("src", this.leftMeme.image);	

		$(this.leftTextElement).text( this.leftMeme.text );

		Meteor.setTimeout( function() { display.browser.whichSide = "left"; display.browser.setFontSize( display.browser.leftTextElement, display.browser.leftMeme )  }, 150 );

if (game.user.mode == uEdit) return;

		//set rotatingMemes to false so that startMemeRotation() will know to kick off the action

		this.rotatingMemes = false;

		Meteor.setTimeout( function() { display.browser.startMemeRotation(); }, display.browser.memeDelay / 2 );
	}

	this.startMemeRotation = function() {

//c("browser.startMemeRotation")

		//Nothing to rotate if we only have two memes (and we should always have at least two ...)
		
		if (this.arrMeme.length <= 2) return;

		//if the memes are already rotating then we can just exit

		if (this.rotatingMemes) return;

		//set the flag so that we know the rotation is in progress

		this.rotatingMemes = true;

		this.memeIndex = 1;

		var _id = this.setID();

		//nextMeme will change the data on the current memes, fade out the currently displayed ones, and preload the images for the new ones
		//then the callbacks from preload will call drawNextMeme() to  draw the new ones on the screen, and then call nextMeme() (this same function)
		//with a delay starting the process all over again

		Meteor.setTimeout( function() { display.browser.nextMeme( _id ); }, display.browser.memeDelay );

	}

	this.flipSide = function() {

		if (this.whichSide == "left") {

			this.whichSide = "right"
		}
		else {

			this.whichSide = "left";
		}

		return this.whichSide;		
	}


	this.nextMeme = function( _id ) {

//c("browser.nextMeme")

		if (_id != this.ID ) return;

		var _fontSize = 0;

		var _fontFactor = 1.0;

		this.memeIndex++;

		this.flipSide();

		if (this.memeIndex == this.arrMeme.length) {

			this.memeIndex = 0;

		}

		if (this.whichSide == "left") {

			this.leftMeme =  this.arrMeme[ this.memeIndex ];

			this.meme = this.leftMeme;

			this.textElement = this.leftTextElement;

			this.imageElement = this.leftImageElement;	

			if ( $( this.textElement ).css("color") == "blue" ) this.memeToEdit = this.leftMeme;
		}


		if (this.whichSide == "right") {

			this.rightMeme = this.arrMeme[ this.memeIndex ];

			this.meme = this.rightMeme;

			this.textElement = this.rightTextElement;

			this.imageElement = this.rightImageElement;

			if ( $( this.textElement ).css("color") == "blue" ) this.memeToEdit = this.rightMeme;
		}

		this.fade( "out", this.textElement);

		this.fade( "out", this.imageElement);	

		this.clearPreloads();

		display.browser.meme.preloadImageForSidewall( this.whichSide ); //callback will trigger next function

	}

	this.drawNextMeme = function() {

//c("browser.drawNextMeme")

//c("meme (right) in drawNextMeme is " + this.meme)

		this.dimensionPic( this.whichSide )

		$(this.imageElement).attr("src", this.meme.image)

		$(this.textElement).text( this.meme.text );

		Meteor.setTimeout( function() { display.browser.updateContent(); }, 600 );

		Meteor.setTimeout( function() { display.browser.setFontSize(); }, 650 );

		Meteor.setTimeout( function() { 	

			display.browser.fade( "in", display.browser.textElement);

			display.browser.fade( "in", display.browser.imageElement);		

		}, 700 );

	 	var _id = this.setID();
		
		if (!this.suspendRotation) Meteor.setTimeout( function() { display.browser.nextMeme( _id ); }, 700 + display.browser.memeDelay );
	}


    this.setFontSize = function( _element, _meme ) {
//c("browser.setFontSize")
    	if (!_element) _element = this.textElement;

    	if (!_meme) _meme = this.meme;

		var _fontSize = 0;

		var _fontFactor = 1.0;

		if (this.whichSide == "right") {

			_fontSize = this.defaultSmallFontSize;

			_fontFactor = 0.87;   //0.67
		}

		if (this.whichSide == "left") {

			_fontSize = this.defaultBigFontSize;

			_fontFactor = 1.5;
		}	

		if ( _meme.rec.fs ) {

			_fontSize = _meme.rec.fs; 

			_fontSize = parseFloat( _fontSize.substr( 0, _fontSize.length - 2) );

			_fontSize = _fontSize * _fontFactor;

			_fontSize = _fontSize + "vw";

//c("adjusted fontsize for " + this.whichSide + " meme is " + _fontSize)

		}
		else {

//c("default fontsize for " + this.whichSide + " meme is " + _fontSize)
		}

    	$( _element ).css("font-size", _fontSize);
    },

	this.setID = function() {

		var _id = hack.countryCode + getRandomString();

		this.ID = _id;

		return (_id);
	}

	this.fade = function( _which, _element ) {

		var s = _element;

		if (_which == "in") { TweenMax.to(s, 0.5, {opacity: 1, ease:Power1.easeIn } ); }

		if (_which == "out") { TweenMax.to(s, 0.5, {opacity: 0, ease:Power1.easeIn } ); }
	}

	this.editSidewallFontSize = function(_val) {

		this.editSidewallFontSizeForSide("left", _val);

		this.editSidewallFontSizeForSide("right", _val);

	}


	this.editSidewallFontSizeForSide = function(_side, _val) {

		_val = _val * 10;

		var _textElementToEdit = this.leftTextElement;

		if (_side == "right") _textElementToEdit = this.rightTextElement;

		var _fontSize = $( _textElementToEdit ).css("font-size");

		_fontSize = _fontSize.substr(0, _fontSize.length - 2);

		_fontSize = parseFloat(_fontSize) + _val;

		_fontSize = _fontSize + "px";

		$( _textElementToEdit ).css("font-size", _fontSize );

	}

	this.setFontSizesOnMemes = function() {

		this.setFontSize( this.leftTextElement, this.leftMeme);

		this.setFontSize( this.rightTextElement, this.rightMeme);		
	}

	this.updateMemeFontSize = function() {

		var _val = $(this.leftTextElement).css("font-size");

		_val = _val.substr(0, _val.length - 2);

		_val = ( _val / $(window).width() ) * 100;

		//if (this.memeToEdit == this.leftMeme) _val = _val * 0.67;

		_val = _val * 0.67;

		//if (this.memeToEdit == this.rightMeme) _val = _val * 1.5;		

  		db.updateRecord2( cMeme, "fs", this.leftMeme.id, _val + "vw");

  		_val = _val.toString();

  		_text = $(this.leftTextElement).text();

  		showMessage("Font size updated for meme: " + _text.substr(0,12) + " -- " + _val.substr(0,4) + "vw");
	}

	this.getSidewallImage = function( _which ) {

		if (_which == "left" && this.leftMeme) return this.leftMeme.image;

		if (_which == "right" && this.rightMeme) return this.rightMeme.image;
	}

	this.getSidewallText = function( _which ) {

		if (_which == "left" && this.leftMeme) return this.leftMeme.text;

		if (_which == "right" && this.rightMeme) return this.rightMeme.text;
	}

	this.getFeaturedMemeImage = function( ) {

		return this.featuredMeme.image;
	}

	this.getFeaturedMemeText = function( ) {

		return this.featuredMeme.text;		
	}	

	this.hiliteFrame = function( _id) {

		this.resetVideoBorders();

		$("#" + _id).css("border-color","yellow");
	}



	this.playVideo = function( _videoid, _frameid ) {

		//derive the index from the frameid

		this.index = parseInt( _frameid.substr(1) );

		//reset our plain bg if we are using YouTube
		//(otherwise the src on the bg is an animated .gif file; this happens in video.js)

		if ( youtube.isFile( _videoid) ) {

			this.setVideoBG( this.videoBGFile );
		}

		this.videoFrameID = _frameid;

		this.hiliteFrame( _frameid);

		this.video = new Video( _videoid, display.browser );

		this.video.play();

		if (this.video.isGIF) game.playMusic(); 
	}

	this.playVideoByIndex = function( _index ) {

		this.index = _index;

		this.playVideo( this.items[_index].u,  "v" + _index);
	}

	this.resumeVideo = function() {

		this.playVideo( this.items[ this.index ].u,  "v" + this.index);
	}

	this.resetVideoBorders = function() {

		$(".ytthumb").css("border-color","gray");

	}

	this.restart = function() {

		display.suspendAllMedia();	

		hack.cancelSubs();

		FlowRouter.go("/waiting");

		Meteor.setTimeout( function() { hack.initForBrowse( hack.countryCode); }, 500);
	}

	this.returnToPrevious = function() {

      	display.suspendAllMedia();	

      	game.playMusic();

		_route = game.user.returnRoute;


		if (_route == "lessonMap") {

			initiateResumeLesson();

			return;
		}

		if (_route == "browseWorldMap") {

			game.user.goBrowseMap();

			return;
		}

		if (_route == "home") {

			game.user.mode = game.user.prevMode;

		}

		if (_route == "congrats") {

			game.user.mode = uHack;
		}

		FlowRouter.go( _route);
	}


	this.setVideoBG = function( _file ) {

		$("img.video").attr("src", _file);
	}

	this.showFeatured = function() {

		this.video.stop();

		this.video.hide();

		display.featuredMeme.preloadImageForDebrief();
	}

	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}

	this.clearPreloads = function() {

		$("#imgDebrief").attr("src", "");

		$("#imgDebrief2").attr("src", "");		
	}

	this.playLanguageFile = function() {

      if (youtube.loaded) {

          youtube.pause();
      }
	
		var _meme = new Meme( db.ghMeme.findOne( {cc:  this.countryCode, dt: { $in: ["lng_o", "lng_i", "lng_om"] } } ), "debrief" );

		_meme.init();

		this.setSoundText( _meme.text );

      hack.playLanguageFile( this.countryCode, true);

      Meteor.setTimeout( function() { game.pauseMusic() }, 500 );
	}

	this.playAnthem = function() {

      if (youtube.loaded) {

          youtube.pause();
      }

      hack.playAnthem( this.countryCode, true);

      this.setSoundText("Now playing: The national anthem of " + hack.getCountryName() +"." )

      Meteor.setTimeout( function() { game.pauseMusic() }, 500 );
	}

	this.setSoundText = function(_str) {

		$( this.soundTextElement ).text( _str );
	}

	this.showMap = function() {

		display.unit = new Unit("modal", hack.getCountryName(), hack.getCountryMapURL() );

		display.unit.preloadImage();
	}

	this.showGlobalPosition = function() {

		display.unit = new Unit("modal", hack.getCountryName(), db.getCountryRec( hack.countryCode ).g );

		display.unit.preloadImage();
	}

    this.soundEffectDone = function() {

    	this.setSoundText("");

    	game.playMusic();
    }

    this.switchElements = function() {

    	var _meme = this.leftMeme;

    	this.leftMeme = this.rightMeme;

    	this.rightMeme = _meme;

    	this.loaded = false;

    	this.show( true ); 
    }

	this.editNextMeme = function( _val ) {

//c("browser.editNextMeme")

		var _fontSize = 0;

		var _fontFactor = 1.0;

		this.memeIndex = this.memeIndex + _val;

		if (this.memeIndex == this.arrMeme.length) {

			this.memeIndex = 0;
		}

		if (this.memeIndex == -1) {

			this.memeIndex = this.arrMeme.length;
		}		

		this.leftMeme =  this.arrMeme[ this.memeIndex ];

		this.meme = this.leftMeme;

		this.textElement = this.leftMeme.textElement

		this.rightMeme = this.arrMeme[ this.memeIndex ]

		this.clearPreloads();

		display.browser.loaded = false;

		this.meme.preloadImagesForSidewall(); //callback will trigger next function

	}

	this.showAgentModal = function(_ID) {

      Session.set("sProfiledUserID", _ID);

      Meteor.subscribe("featuredUser", _ID, function() { 

  		$('#helperAgentBio').modal('show');

  		var _agent = Meteor.users.findOne( { _id: _ID });

  		$('h4.modal-title.modalText.helperAgentBioName').text( _agent.username.toUpperCase() );

      }); 

	}
}

