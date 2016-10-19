//newBrowse.js

Browser = function(  ) {

	this.updateFlag = new Blaze.ReactiveVar(false);

	this.videoBGFile = "featuredBackdrop.jpg";

	this.index = 0;

	this.video = null;

	this.videoIndex = new Blaze.ReactiveVar( -1 );

	this.primaryItems = [];  //memes, can be video or an image in this case

	this.items = [];  //array of objects from ghVideo

	this.videoFrameID = "";  //ID of the div element with the playing video

	this.countryCode = "";  //we actually use hack.countryCode throughout, but we keep a copy
							//in this.countryCode, so we can tell when the country has changed
							//upon return from the browsemap (user could have simply viewed the map)

	this.init = function( _code ) {

		if (!editor) editor = new Editor();
		
		this.primaryItems = [];


		//make primaries, first the map modal

		var _obj = new Meme("modal", "Map", hack.getCountryMapURL() );

		this.primaryItems.push( _obj );

		//prepare to create the primary video memes

		var items = [];

		_items = db.ghVideo.find( { cc: hack.countryCode, dt: { $in: ["gn","sd","tt"] } } ).fetch();

		var _meme = null;


		//named primary videos

		var _arrCode = ["gn", "sd", "tt"];

		var _arrName = ["Geography Now", "Seeker Daily", "Top Ten Archive"];

		for (var i = 0; i < _arrCode.length; i++) {

			_index = Database.getObjectIndexWithValue( _items, "dt", _arrCode[i] );

			if (_index != -1) {

				_obj = _items[ _index ];

				_meme = new Meme("video", _arrName[i], "http://img.youtube.com/vi/" + _obj.u + "/default.jpg", _obj.u);

				this.primaryItems.push(_meme);
			}

		}

		//Other primaries

		_items = db.ghVideo.find( { cc: hack.countryCode, s: { $in: ["p"] } } ).fetch();

		var _meme = null;

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

			_meme = new Meme("video", _name, "http://img.youtube.com/vi/" + _obj.u + "/default.jpg", _obj.u);

			this.primaryItems.push(_meme);
		}

		//finally the regular videos (non-primary)

		this.items = db.ghVideo.find( { cc: hack.countryCode, dt: { $nin: ["gn","sd","tt"] },  s: { $nin: ["p"] } } ).fetch();

		this.updateContent();

	}

	this.draw = function(  _obj ) {

        _obj.width = $(".centerImg").outerWidth() + 16;

        _obj.height = $(".centerImg").outerHeight() + 16; 

        _obj.top  = $(".divCenterImg").position().top;

        _obj.left  = $(window).width() * .3467;		
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

c("about to hilite frame id " + _frameid)

		this.hiliteFrame( _frameid);

		this.video = new Video( _videoid, display.browser );

		this.video.play();
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

	this.returnToPrevious = function() {

      	display.suspendMedia();	

      	game.playMusic();

		_route = game.user.returnRoute;

c("route in returnToPrevious is " + _route)

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

	this.updateContent = function() {

		var _val = this.updateFlag.get();

		this.updateFlag.set( !_val );
	}
}