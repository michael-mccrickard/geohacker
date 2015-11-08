
/*  scanner.js  */
Ele = function(_name, _ID, _type ) {

	this.finished = new Blaze.ReactiveVar( false );

	this.type = _type;

	this.idlePauseTime = [];

	this.idlePlayTime = [];

	this.scanPlayTime = [];

	this.name = _name;

	this.idle = [];

	this.scan = [];

	this.index = 0;  //index into the above arrays; only one array active at a time

	this.ID = _ID;  //index in scanner.ele[]

	this.nextIdleMessage = function() {

		this.index = this.index + 1;

		if (this.index == this.idle.length) {

			this.index = 0;

		}

		//set the text

		$("." + this.name + "Text").text( this.idle[ this.index ]);		

		//show the animated gif

		$("." + this.name + "Img").attr("src", this.name + ".gif");

		//queue up the pause command

		if (this.ID == scTopLeft) Meteor.setTimeout( function() { display.scanner.pauseIdle( scTopLeft ) }, display.scanner.ele[ scTopLeft ].idlePlayTime[ display.scanner.ele[ scTopLeft ].index  ] ); 	

		if (this.ID == scTopRight) Meteor.setTimeout( function() { display.scanner.pauseIdle( scTopRight ) }, display.scanner.ele[ scTopRight ].idlePlayTime[ display.scanner.ele[ scTopRight ].index ] ); 	

		if (this.ID == scBottomLeft) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomLeft ) }, display.scanner.ele[ scBottomLeft ].idlePlayTime[ display.scanner.ele[ scBottomLeft ].index  ] ); 	

		if (this.ID == scBottomCenter) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomCenter ) }, display.scanner.ele[ scBottomCenter ].idlePlayTime[ display.scanner.ele[ scBottomCenter ].index  ] ); 

		if (this.ID == scBottomRight) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomRight ) }, display.scanner.ele[ scBottomRight ].idlePlayTime[ display.scanner.ele[ scBottomRight ].index ] ); 	

	}

	this.pauseIdle = function() {

		//show the static gif

		$("." + this.name + "Img").attr("src", this.name + "_static.gif");			
	}

	this.startScan = function() {


	}

	this.stopScan = function() {


	}	
}


Scanner = function() {

	this.ele = [];

	this.maxIdlePause = 3000;

	this.minIdlePause = 500;

	this.minIdlePlay = 1000;

	this.maxIdlePlay = 3000;

	this.maxScanPlay = 50;

	this.ele[ scTopLeft ] = new Ele("scanTopLeft", scTopLeft, "multi");

	this.ele[ scTopLeft ].scan = ["Initializing scan protocol ...", "Stream detection started ...", "Downloading message headers ...", "Filtering message headers ...", "Downloading stream ...", "Decrypting stream ...", "Chunking messaages ...", "Loading message ..."];

	this.ele[ scTopLeft ].idle = ["System idle ...", "Initiating back-ups ...", "Verifying latest build ...", "Polling clients ..."];	

	this.ele[ scTopRight ] = new Ele("scanTopRight", scTopRight, "single");

	this.ele[ scTopRight ].scan = ["Verifying mission parameters ...", "Isolating streams ...", "Deleting corrupt headers ...", "Throttling download speed ...", "Scanning cache ...", "Verifying chunks ...", "Verifying message ..."];

	this.ele[ scTopRight ].idle = ["Allocating sub-system resources ...", "Verifying credentials ...", "Testing ports ...", "Testing sockets ...", "Flushing cache ..."];

	this.ele[ scBottomLeft ] =  new Ele("scanBottomLeft", scBottomLeft, "single");

	this.ele[ scBottomLeft ].idle = ["Analyzing port usage", "Testing RAM", "Checking peripherals", "Measuring CPU usage", "Indexing intercepts"];

	this.ele[ scBottomCenter ] =  new Ele("scanBottomCenter", scBottomCenter, "single");

	this.ele[ scBottomCenter ].idle = ["Incoming satellite signals", "CPU activity", "RAM utilization", "Outgoing intercept probes", "Pinging satellites"];

	this.ele[ scBottomRight ] =  new Ele("scanBottomRight", scBottomRight, "single");

	this.ele[ scBottomRight ].idle = ["securing open sockets", "sniffing ports", "checking new virus definitions", "verifying incoming connections", "checking for exploit signatures"];

	this.eleLimit = scBottomRight;


	this.startIdle = function() {

		for (var i = 0; i <= this.eleLimit;  i++) {

			for (var j= 0; j < this.ele[ i ].idle.length; j++ ) {

				this.ele[ i ].idlePauseTime[ j ] = Database.getRandomFromRange( this.minIdlePause, this.maxIdlePause ); 				

				this.ele[ i ].idlePlayTime[ j ] = Database.getRandomFromRange( this.minIdlePlay, this.maxIdlePlay ); 
			 			
			}

			this.ele[ i ].index = -1;

			this.ele[ i ].nextIdleMessage();  //sets the text and starts the gif
		}

	}

	this.pauseIdle = function( _ID) {

		this.ele[ _ID ].pauseIdle();

		if (_ID == scTopLeft) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scTopLeft ) }, display.scanner.ele[ scTopLeft ].idlePauseTime[ display.scanner.ele[ scTopLeft ].index ] ) ; 	

		if (_ID == scTopRight) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scTopRight ) }, display.scanner.ele[ scTopRight ].idlePauseTime[ display.scanner.ele[ scTopRight ].index ] ) ; 

		if (_ID == scBottomLeft) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomLeft ) }, display.scanner.ele[ scBottomLeft ].idlePauseTime[ display.scanner.ele[ scBottomLeft ].index ] ) ; 	

		if (_ID == scBottomCenter) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomCenter ) }, display.scanner.ele[ scBottomCenter ].idlePauseTime[ display.scanner.ele[ scBottomCenter ].index ] ) ; 

		if (_ID == scBottomRight) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomRight ) }, display.scanner.ele[ scBottomRight ].idlePauseTime[ display.scanner.ele[ scBottomRight ].index ] ) ; 
	}

	this.nextIdleMessage = function(_ID) {
		
		this.ele[ _ID ].nextIdleMessage();
	}

	this.stopScan = function() {


	}

	this.draw = function() {

	    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

	    var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

	    var horizSpacer = fullBackdropWidth * 0.01;

	    var vertSpacer = fullHeight * 0.01;

	   $("div.scanCenter").css("left", (fullBackdropWidth/2) - $(".scanCenter").outerWidth() / 2 + "px");

	    $("div.scanCenter").css("top", vertSpacer * 17 + "px" );

	   $("div.divAnalyzeStream").css("left", horizSpacer * 7 + "px" );

	    $("div.divAnalyzeStream").css("top", fullHeight * 0.4 + "px" );

	   $("div.scanTopRight").css("left", fullBackdropWidth - $("div.scanTopRight").outerWidth() - horizSpacer / 2 +"px" );

	    $("div.scanTopRight").css("top", $("img.featuredBackdrop").position().top + vertSpacer*1.5 + "px" );

	    $("img.scanTopRightImg").css("width", fullBackdropWidth * 0.025 + "px" );

	   $("div.scanTopLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("div.scanTopLeft").css("top", $("img.featuredBackdrop").position().top  + "px" );

	    $("img.scanTopLeftImg").css("width", fullBackdropWidth * 0.025 + "px" );

	   $("div.scanBottomLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("div.scanBottomLeft").css("top", (fullHeight) - 64 - vertSpacer + "px" );

	    $("div.scanBottomCenter").css("left", (fullBackdropWidth/2) - $(".scanBottomCenter").outerWidth() / 2 + "px");

	    $("div.scanBottomCenter").css("top", (fullHeight) - $("div.scanBottomCenter").outerHeight() - vertSpacer*2  + "px" );

	    $("div.scanBottomRight").css("left", (fullBackdropWidth * 0.995) - $("div.scanBottomRight").outerWidth() + "px");

	    $("div.scanBottomRight").css("top", (fullHeight) - $("div.scanBottomRight").outerHeight() - vertSpacer  + "px" );

	    $("img.imgScanGridGlobe").css("left", (fullBackdropWidth * 0.98) - $(".imgScanGridGlobe").outerWidth()  + "px");

	    $("img.imgScanGridGlobe").css("top", (fullHeight * 0.40) - $(".imgScanGridGlobe").outerHeight() / 2 + "px" );

	    $("div.divScanGridGlobe").css("left", (fullBackdropWidth * 0.99)  - $(".divScanGridGlobe").outerWidth() + "px");

	    $("div.divScanGridGlobe").css("top", (fullHeight * 0.40) - $(".divScanGridGlobe").outerHeight() / 2 + "px" );

	    $("div.divNormalGlobe").css("left", (fullBackdropWidth * 0.99) - $(".divNormalGlobe").outerWidth() + "px");

	    $("div.divNormalGlobe").css("top", (fullHeight * 0.7) - $(".divNormalGlobe").outerHeight() / 2 + "px" ); 
	}	
}


