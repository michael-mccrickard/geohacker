
/*  scanner.js  */

gDate = new Date();

Scanner = function() {

	this.ele = [];

	//this is the only time we set centerState to idle, b/c after this we are either scanning or loaded

	this.centerState = new Blaze.ReactiveVar("idle");  //off, scan, idle, loaded  

	this.mode = "idle";   //off, idle, scan, rescan

	this.visible =  new Blaze.ReactiveVar( true );

	this.totalTime = new Blaze.ReactiveVar( 0.0 );

	this.networkIntegrity =  new Blaze.ReactiveVar( 100 );	

	this.networkIntegrityOn = false;

	this.progress = new Blaze.ReactiveVar( 0.0 );	

	this.progressID = null;

	this.progressLastTime = 0.0;

	this.progressEndTime = 0;

	this.progressInterval = 0.0;

	this.progressLimit = 360;

	this.streamAnalyzerCount = 0;

	this.maxIdlePause = 9000;

	this.minIdlePause = 5000;

	this.minIdlePlay = 1000;

	this.maxIdlePlay = 3000;

	this.minScanPlay = 200;

	this.maxScanPlay = 500;

	this.ele[ scTopLeft ] = new Ele("scanTopLeft", scTopLeft, "multi");

	this.ele[ scTopLeft ].scan = ["Initializing scan protocol ...", "Stream detection started ...", "Downloading message headers ...", "Filtering message headers ...", "Downloading stream ...", "Decrypting stream ...", "Chunking messages ...", "Loading message ..."];

	this.ele[ scTopLeft ].idle = ["System idle ...", "Initiating back-ups ...", "Verifying latest build ...", "Polling clients ..."];	

	this.ele[ scTopRight ] = new Ele("scanTopRight", scTopRight, "single");

	this.ele[ scTopRight ].scan = ["Verifying mission parameters ...", "Isolating streams ...", "Deleting corrupt headers ...", "Throttling download speed ...", "Scanning cache ...", "Verifying chunks ...", "Verifying message ..."];

	this.ele[ scTopRight ].idle = ["Allocating sub-system resources ...", "Verifying credentials ...", "Testing ports ...", "Testing sockets ...", "Flushing cache ..."];

	this.ele[ scBottomLeft ] =  new Ele("scanLowerLeft", scBottomLeft, "single");

	this.ele[ scBottomLeft ].idle = ["Analyzing port usage", "Testing RAM", "Checking peripherals", "Measuring CPU usage", "Indexing intercepts"];

	this.ele[ scBottomLeft ].scan = ["Listening for streams", "Verfiying headers", "Rejecting bad headers", "Measuring download speed", "Caching intercepts"];

	this.ele[ scBottomCenter ] =  new Ele("scanBottomCenter", scBottomCenter, "single");

	this.ele[ scBottomCenter ].idle = ["Incoming satellite signals", "CPU activity", "RAM utilization", "Outgoing intercept probes", "Pinging satellites"];

	this.ele[ scBottomCenter ].scan = ["Raw streams", "Header detection", "CPU overclocking", "Peer to peer connections", "Defragmentation"]; 

	this.ele[ scBottomRight ] =  new Ele("scanBottomRight", scBottomRight, "single");

	this.ele[ scBottomRight ].idle = ["securing open sockets", "configuring proxy server", "checking new virus definitions", "Testing alternate gateways", "checking for exploit signatures"];

	this.ele[ scBottomRight ].scan = ["Securing all ports", "Encrypting requests", "Scanning headers", "Quaratining suspect streams", "Approving stream "];

	this.intercept_sound_file = "new_feedback.mp3";

	this.fadeInSound = "notify.mp3";

	this.eleLimit = scBottomRight;

 	this.count = 0;

	this.ready = true;

	this.startIdle = function() {

		if (this.visible.get() == false) return;

		this.draw();

		this.fadeIn();

		this.mode = "idle";

		this.streamAnalyzerIdle();

		this.startNetworkAnalyzer();

		for (var i = 0; i <= this.eleLimit;  i++) {

			for (var j= 0; j < this.ele[ i ].idle.length; j++ ) {

				this.ele[ i ].idlePauseTime[ j ] = Database.getRandomFromRange( this.minIdlePause, this.maxIdlePause ); 				

				this.ele[ i ].idlePlayTime[ j ] = Database.getRandomFromRange( this.minIdlePlay, this.maxIdlePlay ); 
			 			
			}

			this.ele[ i ].index = -1;

			this.ele[ i ].clearText(); 

			this.ele[ i ].nextIdleMessage();  //sets the text and starts the gif
		}

	}

	this.startScan = function(_which) {

		this.show();

		this.draw();

		this.fadeIn();

		this.centerState.set("scan");

		if ( hacker.feature.on() ) {

			var _name = hacker.feature.item.getName();

			if (_name != "TEXT" && _name != "VIDEO"  && _name != "MAP") this.hideBG();
		}

		this.mode = _which;

		this.streamAnalyzer();


		for (var i = 0; i <= this.eleLimit;  i++) {

			this.ele[ i ].totalScanPlayTime = 0.0;

			var startIndex = 0;

			if (this.mode == "rescan") startIndex = Math.floor( this.ele[i].scan.length / 2);

			for (j = startIndex; j < this.ele[ i ].scan.length; j++ ) {			

				this.ele[ i ].scanPlayTime[ j ] = Database.getRandomFromRange( this.minScanPlay, this.maxScanPlay ); 

				this.ele[ i ].totalScanPlayTime += this.ele[ i ].scanPlayTime[ j ];
			 			
			}

			this.ele[ i ].index = -1;

			this.ele[ i ].finished = false;			

			this.ele[ i ].clearText(); 

			if (this.mode == "rescan") startIndex--;  //

			this.ele[ i ].nextScanMessage( startIndex );  //sets the text and starts the gif
		}

		this.drawCenter();

		this.totalTime.set( Math.floor( this.highestScanTime() ) );

		this.startProgressMeter();

		hacker.TV.set( TV.scan );

		var soundTime = 4;

		if (this.mode == "rescan") soundTime = 2;

		display.playEffect2( "scanner.mp3" );

		this.playScanSound( soundTime );

		hacker.loader.go();

	}

	this.hideBG = function() {

		$("img.imgScanBackdrop").css("opacity", 0.0);
	}

	this.showBG = function() {

		$("img.imgScanBackdrop").css("opacity", 1.0);
	}

	this.hide = function() {

		this.visible.set( false );

		$("div.scanScreen").css("visibility", "hidden");
	}

	this.show = function() {

		this.visible.set( true );

		$("div.scanScreen").css("visibility", "visible");
	}



	this.fadeIn = function( _time ) {

		this.show();

		if ( $(".scanScreen").css("opacity") == "0" ) {
			
			display.playEffect( this.fadeInSound );

			$(".scanScreen" ).velocity("fadeIn", { duration: _time });
		}
	}

	this.fadeOut = function( _time ) {

		if ( $(".scanScreen").css("opacity") == "1" ) {

			$(".scanScreen" ).velocity("fadeOut", { 

				duration: _time, 
				display: "auto", 
				complete: function() { hacker.scanner.hide();  },  
			});
		}

		//this.hide();
	}

	this.highestScanTime = function() {

		var _highest = 0.0;

		for (var i = 0; i <= this.eleLimit;  i++) {

			if (this.ele[i].totalScanPlayTime > _highest) _highest = this.ele[i].totalScanPlayTime;

		}

		return _highest;
	}

	this.playScanSound = function( _duration ) {

		var s = "scan" + _duration + "_" + Database.getRandomFromRange(1,5) + ".mp3";

		display.playEffect( s );
	}

	this.pauseIdle = function( _ID) {

		this.ele[ _ID ].pause();

		if (_ID == scTopLeft) Meteor.setTimeout( function() { hacker.scanner.nextIdleMessage( scTopLeft ) }, hacker.scanner.ele[ scTopLeft ].idlePauseTime[ hacker.scanner.ele[ scTopLeft ].index ] ) ; 	

		if (_ID == scTopRight) Meteor.setTimeout( function() { hacker.scanner.nextIdleMessage( scTopRight ) }, hacker.scanner.ele[ scTopRight ].idlePauseTime[ hacker.scanner.ele[ scTopRight ].index ] ) ; 

		if (_ID == scBottomLeft) Meteor.setTimeout( function() { hacker.scanner.nextIdleMessage( scBottomLeft ) }, hacker.scanner.ele[ scBottomLeft ].idlePauseTime[ hacker.scanner.ele[ scBottomLeft ].index ] ) ; 	

		if (_ID == scBottomCenter) Meteor.setTimeout( function() { hacker.scanner.nextIdleMessage( scBottomCenter ) }, hacker.scanner.ele[ scBottomCenter ].idlePauseTime[ hacker.scanner.ele[ scBottomCenter ].index ] ) ; 

		if (_ID == scBottomRight) Meteor.setTimeout( function() { hacker.scanner.nextIdleMessage( scBottomRight ) }, hacker.scanner.ele[ scBottomRight ].idlePauseTime[ hacker.scanner.ele[ scBottomRight ].index ] ) ; 
	}

	this.nextIdleMessage = function(_ID) {

		if (this.mode != "idle" || this.visible.get() == false) return;

		this.count = this.count + 1;

		if (this.count == 10) {

			var s = "idle" + "_" + Database.getRandomFromRange(1,5) + ".mp3";

			display.playEffect( s );

			this.count = 0;
		}
		
		this.ele[ _ID ].nextIdleMessage();
	}

	this.nextScanMessage = function(_ID) {

		if (this.mode != "scan" && this.mode != "rescan") return;
		
		this.ele[ _ID ].nextScanMessage();
	}


	this.stopScan = function() {

		for (var i = 0; i <= this.eleLimit;  i++) {

			this.ele[ i ].pause();			
		}

		hacker.loader.showLoadedControl();  //shows the appropriate pic in the control button

		this.centerState.set("loaded");

		this.mode = "off";

		this.showBG();

		if ( hacker.moreDataAvailable() ) hacker.TV.startIdle();

		display.playEffect( this.intercept_sound_file );

		//set the reactive var so that the scanner template will hide the center img

		this.centerState.set("off");

		this.fadeOut(300);

		hacker.feature.switchToNext();

		Meteor.setTimeout( function() { hacker.scanner.startIdle() }, 2000 );		
	}

	this.startNetworkAnalyzer = function() {

		if (this.networkIntegrityOn) return;

		this.networkIntegrityOn = true;

		Meteor.setTimeout( function() { hacker.scanner.networkAnalyzer() }, Database.getRandomFromRange(3000, 10000) );
	}

	this.networkAnalyzer = function() {

		var _amt = Database.getRandomFromRange(910, 1000);

		this.networkIntegrity.set( _amt/10 );

		Meteor.setTimeout( function() { hacker.scanner.networkAnalyzer() }, Database.getRandomFromRange(3000, 10000) );

	}

	this.streamAnalyzer = function() {

		if (this.mode == "idle"  || this.mode == "off") {

			return;
		}

		var limit = 11;

		var delay = 100;

		var lineCharCount = 26;

		this.streamAnalyzerCount++;

		var _text = document.getElementById("streamAnalyzerID").innerHTML;

		var _newline = getChars( 22 ) + "<br>";

		_text = _newline + _text;

		if (this.streamAnalyzerCount == limit) {

			_text = _text.substring(0, _text.length - lineCharCount);

			this.streamAnalyzerCount--;
		} 

		document.getElementById("streamAnalyzerID").innerHTML = _text;

		Meteor.setTimeout( function() { hacker.scanner.streamAnalyzer(); }, delay);

	}

	this.streamAnalyzerIdle = function() {

		document.getElementById("streamAnalyzerID").innerHTML = "(no streams detected)";
	}

	this.startProgressMeter = function(  ) {

		this.progressInterval = this.totalTime.get() / this.progressLimit;

		this.progress.set( 0 );

		this.progressLastTime = new Date().getTime();

		this.progressEndTime = this.progressLastTime + this.totalTime.get();

		Meteor.setTimeout( function () {

			hacker.scanner.advanceProgressMeter();
 
		}, hacker.scanner.progressInterval);

		Meteor.defer( function() { hacker.scanner.drawCenter() } );
	}

	this.advanceProgressMeter = function() {

			var s = hacker.scanner;

			var temp = s.progress.get();

			if (temp == s.progressLimit) return;			

		 	s.progress.set( temp + 1 ); 

		 	var lastTime =  s.progressLastTime;

		 	var timeNow = new Date().getTime();

		 	var remainder = s.progressEndTime - timeNow;

		 	s.progressInterval = ( remainder / (s.progressLimit - temp + 1) ); 

			Meteor.setTimeout( function () {

				hacker.scanner.advanceProgressMeter();
	 
			}, hacker.scanner.progressInterval);
	}


	this.checkScan = function( _which ) {

		//if this function is called by the feature object, then feature image is loaded
		//and we just need to know if progress meter on the scanner is done

		if ( _which == "feature" ) {

			if ( this.progress.get() <  this.progressLimit) {

				return false;
			}

		}

		//if this function is called by the scanner, then the scan sequence is done
		//and we just need to know if the feature image has finished loading

		if (_which == "scanner") {  

			//if (Session.get("sFeatureImageLoaded") == false)  return false;
		
			if ( !hacker.feature.nextItem.isLoaded.get() ) return false;
		}

		return true;

	}


	this.drawCenter = function() {

	    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

		var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

		var vertSpacer = fullHeight * 0.01;

		$("div.scanCenter").css("left", (fullBackdropWidth/2) - $(".scanCenter").outerWidth() / 2 + "px");

		$("div.scanCenter").css("top", fullHeight * 0.3 + "px" );	   	

		$("div.scanCenterText").css("left", (fullBackdropWidth/2) - $(".scanCenterText").outerWidth() / 2 + "px");

		var spacer = vertSpacer * 2;

		if (hacker.scanner.centerState.get() == "idle") spacer = -1 * vertSpacer*3

	  	$("div.scanCenterText").css("top", $(".scanCenter").position().top + $(".scanCenterImg").outerHeight() + spacer + "px" ); 
	}

	this.draw = function() {

	    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

	    var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

	    var horizSpacer = fullBackdropWidth * 0.01;

	    var vertSpacer = fullHeight * 0.01;

	   this.drawCenter();

	   $("img.imgScanBackdrop").css("width", fullHeight * 0.9 - vertSpacer / 2 +"px" );

	   $("img.imgScanBackdrop").css("height", fullHeight * 0.9 - vertSpacer / 2 +"px" );

	   $("div.scanBackdrop").css("left", fullBackdropWidth/2 - $("div.scanBackdrop").outerWidth()/2 + "px" );

	   $("div.divAnalyzeStream").css("left", $("img.featuredBackdrop").position().left + fullBackdropWidth * 0.005 + "px" );

	    $("div.divAnalyzeStream").css("top", fullHeight * 0.4 + "px" );

	   $("div.scanTopRight").css("left", fullBackdropWidth - $("div.scanTopRight").outerWidth() - horizSpacer / 2 +"px" );

	    $("div.scanTopRight").css("top", $("img.featuredBackdrop").position().top + vertSpacer*1.5 + "px" );

	    $("img.scanTopRightImg").css("width", fullBackdropWidth * 0.025 + "px" );

	   $("img.scanTopLeftImg").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("img.scanTopLeftImg").css("top", $("img.featuredBackdrop").position().top  + "px" );

	   $("span.scanTopLeftText").css("left", $("img.featuredBackdrop").position().left + $("img.scanTopLeftImg").outerWidth() + horizSpacer + "px" );

	    $("span.scanTopLeftText").css("top", $("img.featuredBackdrop").position().top  + "px" );

	   $("div.scanBottomLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 + "px" );

	    $("div.scanBottomLeft").css("top", (fullHeight) - $("div.scanBottomLeft").outerHeight() - vertSpacer + "px" );

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


//****************************************************************
//                  WAIT FOR SCAN TO COMPLETE
//****************************************************************



getChars = function(_n) {

    var _str = '';

    for (var i = 1; i <= _n; i++) {

        var charCode = Math.floor( Math.random() * ( 122 - 63 + 1) + 63);

		var _nextChar =  String.fromCharCode(charCode);
		
		if  ( Math.floor( Math.random() * 5 ) == 4 ) _nextChar = parseInt( Math.floor( Math.random() * 10 ) );   

        _str = _str + _nextChar
    }

    return _str;
}
