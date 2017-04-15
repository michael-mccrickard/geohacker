//newBrowse.js

Browser2 = function(  ) {

	this.updateFlag = new Blaze.ReactiveVar(false);

	this.videoBGFile = "featuredBackdrop.jpg";

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

	this.leftWidth = 0.6;

	this.leftHeight = 0.69;

	this.rightWidth = 0.34;

	this.rightHeight = 0.31;

	this.memeIndex = -1;

	this.arrMeme = [];

	this.whichSide = "right";

	this.memeDelay = 5000;

	this.rotatingMemes = false;

	this.suspendRotation = false;

	this.memeToEdit = null;

	this.defaultBigFontSize = "4.0vw";

	this.defaultSmallFontSize = "3.5vw";


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


		//named primary videos

		var _arrCode = ["gn", "sd", "tt"];

		var _arrName = ["Geography Now", "Seeker Daily", "Top Ten Archive"];

		for (var i = 0; i < _arrCode.length; i++) {

			_index = Database.getObjectIndexWithValue( _items, "dt", _arrCode[i] );

			if (_index != -1) {

				_obj = _items[ _index ];

				_unit = new Unit("video", _arrName[i], "http://img.youtube.com/vi/" + _obj.u + "/default.jpg", _obj.u);

				this.primaryItems.push(_unit);
			}

		}

		//Other primaries

		_items = db.ghVideo.find( { cc: hack.countryCode, s: "p" }  ).fetch();

		var _unit = null;

		var _name = "";

		for (var i = 0; i < _items.length; i++) {

			_obj = _items[ i ];

	  		_index = editor.arrCode.indexOf( _obj.dt );

	  		if ( _index != -1) {

	  			_name = editor.arrCodeText[ _index ];
	  		}
	  		else {

	  			_name = "Info";
	  		}

			_unit = new Unit("video", _name, "http://img.youtube.com/vi/" + _obj.u + "/default.jpg", _obj.u);

			this.primaryItems.push(_unit);
		}

		//finally the regular videos (non-primary)

		this.items = db.ghVideo.find( { cc: hack.countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

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

if (this.meme) {

	c("meme follows")

	c( this.meme)
}

c("variable width, height is 100%")

c("pixelWidth is " + _pixelWidth)

c("width is " + _width)

c("pixelHeight is " + _pixelHeight)

_height = _height * $(window).height();

c("height is " + _height)

			_left = _left + (_width/2) - ( _pixelWidth/ 2);

c("_left is " + _left)

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

if (this.meme) {

	c("meme follows")

	c( this.meme)
}

c("variable height, width is 100%")

c("height is " + _height)
			_top = _top + (_height/2) - ( _pixelHeight/ 2);
c("top is " + _top)
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

		if (!this.leftMeme.loaded || !this.rightMeme.loaded) return;

		this.loaded = true;


		this.dimensionPic("right");

		$(this.rightImageElement).attr("src", this.rightMeme.image);

		this.dimensionPic("left");

		$(this.leftImageElement).attr("src", this.leftMeme.image);		

		//this.startMemeRotation();

		this.rotatingMemes = false;

		Meteor.setTimeout( function() { display.browser.startMemeRotation(); }, display.browser.memeDelay );
	}

	this.startMemeRotation = function() {

		if (this.arrMeme.length <= 2) return;

		if (this.rotatingMemes) return;

		this.rotatingMemes = true;

		this.memeIndex = 1;

		var _id = this.setID();

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

		if (_id != this.ID ) return;

		var _fontSize = 0;

		var _fontFactor = 1.0;

		this.memeIndex++;

		this.flipSide();

		if (this.memeIndex == this.arrMeme.length) {

			this.memeIndex = 0;

			//change up the order, if we are editing 

			if (gEditSidewallsMode && this.arrMeme.length != 3) this.flipSide();
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

//c("meme (right) in drawNextMeme is " + this.meme)

		var _fontSize = 0;

		var _fontFactor = 1.0;

		if (this.whichSide == "right") {

			_fontSize = this.defaultSmallFontSize;

			_fontFactor = 2.0;
		}

		if (this.whichSide == "left") {

			_fontSize = this.defaultBigFontSize;

			_fontFactor = 4.0;
		}	

		if ( this.meme.rec.fs ) {

			_fontSize = _fontFactor * parseFloat( this.meme.rec.fs );
		}

		this.dimensionPic( this.whichSide )

		$(this.imageElement).attr("src", this.meme.image)


		Meteor.setTimeout( function() { display.browser.updateContent(); }, 600 );

		Meteor.setTimeout( function() { display.browser.setFontSize( _fontSize ); }, 650 );

		Meteor.setTimeout( function() { 	

			display.browser.fade( "in", display.browser.textElement);

			display.browser.fade( "in", display.browser.imageElement);		

		}, 700 );

	 	var _id = this.setID();

		if (!this.suspendRotation) Meteor.setTimeout( function() { display.browser.nextMeme( _id ); }, 700 + display.browser.memeDelay );
	}


    this.setFontSize = function( _val ) {

    	$( this.textElement ).css("font-size", _val + "vh");
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

		var _fontSize = $( this.textElement ).css("font-size");

		_fontSize = _fontSize.substr(0, _fontSize.length - 2);

		_fontSize = parseFloat(_fontSize) + _val;

		_fontSize = _fontSize + "px";

		$( this.textElement ).css("font-size", _fontSize );

	}

	this.markNextSidewall = function() {

		var _which = this.flipSide();

		$( this.leftTextElement ).css("background-color","red");

		$( this.rightTextElement ).css("background-color","red");

		if (_which == "left") {

			$( this.leftTextElement ).css("background-color","blue");

			this.memeToEdit = this.leftMeme;

			this.textElement = this.leftTextElement;
		}


		if (_which == "right") {

			$( this.rightTextElement ).css("background-color","blue");

			this.memeToEdit = this.rightMeme;

			this.textElement = this.rightTextElement;
		}
	}

	this.setFontSizesOnMemes = function() {

		if ( this.leftMeme.rec.fs ) {

			$( this.leftTextElement ).css("font-size", this.leftMeme.rec.fs);
		}


		if ( this.rightMeme.rec.fs ) {

			$( this.rightTextElement ).css("font-size", this.rightMeme.rec.fs);
		}
	}

	this.updateMemeFontSize = function() {

		var _val = $(this.textElement).css("font-size");

		_val = _val.substr(0, _val.length - 2);

		_val = parseFloat(_val) / $(window).width() * 100;

  		db.updateRecord2( cMeme, "fs", this.memeToEdit.id, _val + "vw");

  		_val = _val.toString();

  		_text = $(this.textElement).text();

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

		$(".imgPrimaryThumb").css("border-color","gray");
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

		$(".centerImg").attr("src", _file);
	}

	this.setFeatured = function( _val ) {

		this.featuredMeme = this.arrMeme[ _val ];
	}

	this.showFeatured = function() {

		this.video.stop();

		this.video.hide();

display.featuredMeme.preloadImageForFeature();
	}

	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}

	this.clearPreloads = function() {

		$("#imgDebrief").attr("src", "");

		$("#imgDebrief2").attr("src", "");		
	}
}