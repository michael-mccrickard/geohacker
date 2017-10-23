//TV.js

TV = function() {

	this.elementID = "#scanButtonContentA";

	this.scanClips = ["scanStatic2.gif"];

	this.idleClips = ["static_warning.gif", "static2.gif",  "static3.gif"];

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

			this.timerID = Meteor.setTimeout( function() { hacker.TV.set( TV.idle ); }, _time );		
		}	

		$( this.elementID ).attr("src", _file);		
	}

	this.playVideo = function( _which ) {

		this.stopIdle();

		this.videoOn.set ( true );

		this.timerID = Meteor.setTimeout( function() { hacker.TV.playVideo2( _which ); }, 200 );

	}

	this.playVideo2 = function( _which ) {

		$("#scannerVideo").attr("src", hacker.TV.videoClips[ _which ] );

		$("#scannerVideo").on('ended', function() { hacker.TV.videoDone(); } );
		
		$("#scannerVideo").get(0).autoplay = true;

		$("#scannerVideo").get(0).load();
	}

	this.videoDone = function() {	

		hacker.TV.startIdle();
	}

	this.startIdle = function() {

		this.idleState = 1;

		this.set( TV.idle );
	}

	this.stopIdle = function() {

c("setting idleState to zero, clearing timer and setting backdrop")
		this.idleState = 0;

		if (this.timerID) Meteor.clearTimeout( this.timerID );

		$( this.elementID ).attr("src", "featuredBackdrop.jpg");			
	}

}

TV.letsHack = 1;
TV.partyStarted = 2;
TV.whosThat = 3;
TV.scan = 100;
TV.idle = 101;
TV.scanPrompt = 103;