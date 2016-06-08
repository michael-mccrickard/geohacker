//TV.js

TV = function() {

	this.elementID = "#scanButtonContentA";

	this.scanClips = ["purpleScan.gif", "multiColorScan.gif", "colorStatic.gif", "colorStatic2.gif", "scanStatic1.gif", "scanStatic2.gif"];

	this.idleClips = ["static.gif", "static_warning.gif", "static2.gif",  "static3.gif",  "static4.gif",  "static5.gif",  "static6.gif",  "static7.gif", "static8.gif", "static9.gif"];

	this.scanPromptClip = "scan_click_here.gif";

	this.videoClips = [];

	this.idleMinTime = 2000;

	this.idleMaxTime = 3000;

	this.videoOn = new Blaze.ReactiveVar( false );

	this.idleState = 0;

	this.timerID = null;

	this.set = function( _type ) {

		var _file = "";

		if (_type == TV.scan) {

			this.videoOn.set ( false );	

		   _file = Database.getRandomElement( this.scanClips );
	
		}

		if (_type == TV.scanPrompt) {

			 if (this.timerID) Meteor.clearTimeout( this.timerID );

			 this.idleState = 0;

			_file = this.scanPromptClip;
		}

		if (_type == TV.idle) {

			if (this.idleState == 0) return;

			this.videoOn.set ( false );	

			_file = Database.getRandomElement( this.idleClips );

			var _time = Database.getRandomFromRange( this.idleMinTime, this.idleMaxTime);

			this.timerID = Meteor.setTimeout( function() { display.TV.set( TV.idle ); }, _time );		
		}	

		$( this.elementID ).attr("src", _file);		
	}

	this.playVideo = function( _which ) {

		this.stopIdle();

		this.videoOn.set ( true );

		this.timerID = Meteor.setTimeout( function() { display.TV.playVideo2( _which ); }, 200 );

	}

	this.playVideo2 = function( _which ) {

		$("#scannerVideo").attr("src", display.TV.videoClips[ _which ] );

		$("#scannerVideo").on('ended', function() { display.TV.videoDone(); } );
		
		$("#scannerVideo").get(0).autoplay = true;

		$("#scannerVideo").get(0).load();
	}

	this.videoDone = function() {	

		display.TV.startIdle();
	}

	this.startIdle = function() {

		this.idleState = 1;

		this.set( TV.idle );
	}

	this.stopIdle = function() {

		this.idleState = 0;
	}

}

TV.letsHack = 1;
TV.partyStarted = 2;
TV.whosThat = 3;
TV.scan = 100;
TV.idle = 101;
TV.scanPrompt = 103;