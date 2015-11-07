
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

	this.index = new Blaze.ReactiveVar( 0 );  //index into the above arrays; only one array active at a time

	this.ID = _ID;  //index in scanner.ele[]

	this.nextIdleMessage = function() {

		this.index.set( this.index.get() + 1);

		if (this.index.get() == this.idle.length) {

			this.stopIdle();

			return;
		}

		//show the animated gif

		$("." + this.name + "Img").attr("src", this.name + ".gif");

		Meteor.setTimeout( function() { display.scanner.ele[ this.ID ].pauseIdle() }, display.scanner.ele[ this.ID ].idlePlayTime[ display.scanner.ele[ this.ID ].index.get() ] ); 		

	}

	this.startIdle = function() {

		//show the animated gif

		$("." + this.name + "Img").attr("src", this.name + ".gif");

		this.index.set( 0 );

		Meteor.setTimeout( function() { display.scanner.ele[ this.ID ].pauseIdle() }, display.scanner.ele[ this.ID ].idlePlayTime[ display.scanner.ele[ this.ID ].index.get() ] ); 
	}

	this.stopIdle = function() {

		//show the static gif

		$("." + this.name + "Img").attr("src", this.name + "_static.gif");	

	}

	this.pauseIdle = function() {

		//show the static gif

		$("." + this.name + "Img").attr("src", this.name + "_static.gif");	

		Meteor.setTimeout( function() { display.scanner.ele[ this.ID ].nextIdleMessage() }, display.scanner.ele[ this.ID ].idlePauseTime[ display.scanner.ele[ this.ID ].index.get() ] ); 		
	}

	this.startScan = function() {


	}

	this.stopScan = function() {


	}	
}


Scanner = function() {

	this.ele = [];

	this.maxIdlePause = 200;

	this.minIdlePause = 50;

	this.minIdlePlay = 100;

	this.maxIdlePlay = 200;

	this.maxScanPlay = 50;

	this.ele.push( new Ele("scanTopLeft", scTopLeft, "multi") );

	this.ele[ scTopLeft ].scan = ["Initializing scan protocol ...", "Stream detection started ...", "Downloading message headers ...", "Filtering message headers ...", "Downloading stream ...", "Decrypting stream ...", "Chunking messaages ...", "Loading message ..."];

	this.ele[ scTopLeft ].idle = ["System idle ...", "Initiating back-ups ...", "Verifying latest build ...", "Polling clients ..."];	

	this.ele.push( new Ele("scanTopRight", scTopRight, "single") );

	this.ele[ scTopRight ].scan = ["Verifying mission parameters ...", "Isolating streams ...", "Deleting corrupt headers ...", "Throttling download speed ...", "Scanning cache ...", "Verifying chunks ...", "Verifying message ..."];

	this.ele[ scTopRight ].idle = ["Allocating sub-system resources ...", "Verifying credentials ...", "Tesing ports ...", "Testing sockets ...", "Flushing cache ..."];

	this.ele.push( new Ele("scanBottomLeft", scBottomLeft, "single") );

	//this.ele.push( new Ele("scanBottomCenter", scBottomCenter, "single") );

	this.ele.push( new Ele("scanBottomRight", scBottomRight, "single") );


this.eleLimit = scTopRight;

	this.startIdle = function() {

		for (var i = 0; i < this.eleLimit;  i++) {

			for (var j= 0; j < this.ele[ i ].idle.length; j++ ) {

				this.ele[ i ].idlePauseTime[ j ] = Database.getRandomFromRange( this.minIdlePause, this.maxIdlePause ); 				

				this.ele[ i ].idlePlayTime[ j ] = Database.getRandomFromRange( this.minIdlePlay, this.maxIdlePlay ); 

				this.ele[ i ].startIdle();
			}
		}

	}

	this.startScan = function() {


	}

	this.stopIdle = function() {

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

	    $("div.divAnalyzeStream").css("top", vertSpacer * 32 + "px" );

	   $("div.scanTopRight").css("left", fullBackdropWidth - $("div.scanTopRight").outerWidth() - horizSpacer / 2 +"px" );

	    $("div.scanTopRight").css("top", $("img.featuredBackdrop").position().top + vertSpacer*1.5 + "px" );

	   $("div.scanTopLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("div.scanTopLeft").css("top", $("img.featuredBackdrop").position().top + vertSpacer*1.5 + "px" );

	   $("div.scanBottomLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("div.scanBottomLeft").css("top", (fullHeight) - 64 - vertSpacer + "px" );

	    $("div.scanBottomCenter").css("left", (fullBackdropWidth/2) - $(".scanBottomCenter").outerWidth() / 2 + "px");

	    $("div.scanBottomCenter").css("top", (fullHeight) - $("div.scanBottomCenter").outerHeight() - vertSpacer  + "px" );

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


