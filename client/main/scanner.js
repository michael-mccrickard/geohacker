
/*  scanner.js  */
Ele = function(_name, _ID, _type ) {

	this.finished = false;

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

	this.nextScanMessage = function() {

		this.index = this.index + 1;

		if (this.index == this.scan.length) {

			this.index = 0;

			this.finished = true;

			if (checkScan() == true) display.scanner.stopScan();

			return;

		}

		//set the text

		if (this.type == "multi") {

			var _text = document.getElementById("scanTopLeftTextID").innerHTML;

			if (_text.length) {

				_text = _text + "<br>" + this.scan[ this.index ];
			}
			else {
				_text = this.scan[ this.index ];
			}

			document.getElementById("scanTopLeftTextID").innerHTML =  _text;

		}
		else {
			$("." + this.name + "Text").text( this.scan[ this.index ]);		
		}

		//show the animated gif

		$("." + this.name + "Img").attr("src", this.name + ".gif");

		//queue up the pause command

		if (this.ID == scTopLeft) Meteor.setTimeout( function() { display.scanner.nextScanMessage( scTopLeft ) }, display.scanner.ele[ scTopLeft ].scanPlayTime[ display.scanner.ele[ scTopLeft ].index  ] ); 	

		if (this.ID == scTopRight) Meteor.setTimeout( function() { display.scanner.nextScanMessage( scTopRight ) }, display.scanner.ele[ scTopRight ].scanPlayTime[ display.scanner.ele[ scTopRight ].index ] ); 	

		if (this.ID == scBottomLeft) Meteor.setTimeout( function() { display.scanner.nextScanMessage( scBottomLeft ) }, display.scanner.ele[ scBottomLeft ].scanPlayTime[ display.scanner.ele[ scBottomLeft ].index  ] ); 	

		if (this.ID == scBottomCenter) Meteor.setTimeout( function() { display.scanner.nextScanMessage( scBottomCenter ) }, display.scanner.ele[ scBottomCenter ].scanPlayTime[ display.scanner.ele[ scBottomCenter ].index  ] ); 

		if (this.ID == scBottomRight) Meteor.setTimeout( function() { display.scanner.nextScanMessage( scBottomRight ) }, display.scanner.ele[ scBottomRight ].scanPlayTime[ display.scanner.ele[ scBottomRight ].index ] ); 	

	}

	this.pause = function() {

		//show the static gif

		$("." + this.name + "Img").attr("src", this.name + "_static.gif");			
	}

	this.clearText = function() {

		$("." + this.name + "Text").text( "" );
	}

	this.stopScan = function() {


	}	
}


Scanner = function() {

	this.ele = [];

	this.mode = "idle";

	this.streamAnalyzerCount = 0;

	this.maxIdlePause = 3000;

	this.minIdlePause = 500;

	this.minIdlePlay = 1000;

	this.maxIdlePlay = 3000;

	this.minScanPlay = 500;

	this.maxScanPlay = 1000;

	this.ele[ scTopLeft ] = new Ele("scanTopLeft", scTopLeft, "multi");

	this.ele[ scTopLeft ].scan = ["Initializing scan protocol ...", "Stream detection started ...", "Downloading message headers ...", "Filtering message headers ...", "Downloading stream ...", "Decrypting stream ...", "Chunking messages ...", "Loading message ..."];

	this.ele[ scTopLeft ].idle = ["System idle ...", "Initiating back-ups ...", "Verifying latest build ...", "Polling clients ..."];	

	this.ele[ scTopRight ] = new Ele("scanTopRight", scTopRight, "single");

	this.ele[ scTopRight ].scan = ["Verifying mission parameters ...", "Isolating streams ...", "Deleting corrupt headers ...", "Throttling download speed ...", "Scanning cache ...", "Verifying chunks ...", "Verifying message ..."];

	this.ele[ scTopRight ].idle = ["Allocating sub-system resources ...", "Verifying credentials ...", "Testing ports ...", "Testing sockets ...", "Flushing cache ..."];

	this.ele[ scBottomLeft ] =  new Ele("scanBottomLeft", scBottomLeft, "single");

	this.ele[ scBottomLeft ].idle = ["Analyzing port usage", "Testing RAM", "Checking peripherals", "Measuring CPU usage", "Indexing intercepts"];

	this.ele[ scBottomLeft ].scan = ["Listening for streams", "Verfiying headers", "Rejecting bad headers", "Measuring download speed", "Caching intercepts"];

	this.ele[ scBottomCenter ] =  new Ele("scanBottomCenter", scBottomCenter, "single");

	this.ele[ scBottomCenter ].idle = ["Incoming satellite signals", "CPU activity", "RAM utilization", "Outgoing intercept probes", "Pinging satellites"];

	this.ele[ scBottomCenter ].scan = ["Raw streams", "Header detection", "CPU overclocking", "Peer to peer connections", "Defragmentation"]; 

	this.ele[ scBottomRight ] =  new Ele("scanBottomRight", scBottomRight, "single");

	this.ele[ scBottomRight ].idle = ["securing open sockets", "configuring proxy server", "checking new virus definitions", "Testing alternate gateways", "checking for exploit signatures"];

	this.ele[ scBottomRight ].scan = ["Securing all ports", "Encrypting requests", "Scanning headers", "Quaratining suspect streams", "Approving stream "];

	this.eleLimit = scBottomRight;

	this.ready = true;

	this.startIdle = function() {

		this.mode = "idle";

		this.streamAnalyzerIdle();

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

	this.startScan = function() {

		this.mode = "scan";

		this.streamAnalyzer();

		for (var i = 0; i <= this.eleLimit;  i++) {

			for (var j= 0; j < this.ele[ i ].idle.length; j++ ) {			

				this.ele[ i ].scanPlayTime[ j ] = Database.getRandomFromRange( this.minScanPlay, this.maxScanPlay ); 
			 			
			}

			this.ele[ i ].index = -1;

			this.ele[ i ].finished = false;			

			this.ele[ i ].clearText(); 

			this.ele[ i ].nextScanMessage();  //sets the text and starts the gif
		}

		Session.set("sScanningNow", true);

		this.drawCenter();

		startProgressMeter();

	}

	this.pauseIdle = function( _ID) {

		this.ele[ _ID ].pause();

		if (_ID == scTopLeft) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scTopLeft ) }, display.scanner.ele[ scTopLeft ].idlePauseTime[ display.scanner.ele[ scTopLeft ].index ] ) ; 	

		if (_ID == scTopRight) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scTopRight ) }, display.scanner.ele[ scTopRight ].idlePauseTime[ display.scanner.ele[ scTopRight ].index ] ) ; 

		if (_ID == scBottomLeft) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomLeft ) }, display.scanner.ele[ scBottomLeft ].idlePauseTime[ display.scanner.ele[ scBottomLeft ].index ] ) ; 	

		if (_ID == scBottomCenter) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomCenter ) }, display.scanner.ele[ scBottomCenter ].idlePauseTime[ display.scanner.ele[ scBottomCenter ].index ] ) ; 

		if (_ID == scBottomRight) Meteor.setTimeout( function() { display.scanner.nextIdleMessage( scBottomRight ) }, display.scanner.ele[ scBottomRight ].idlePauseTime[ display.scanner.ele[ scBottomRight ].index ] ) ; 
	}

	this.nextIdleMessage = function(_ID) {

		if (this.mode != "idle") return;
		
		this.ele[ _ID ].nextIdleMessage();
	}

	this.nextScanMessage = function(_ID) {

		if (this.mode != "scan") return;
		
		this.ele[ _ID ].nextScanMessage();
	}


	this.stopScan = function() {

		for (var i = 0; i <= this.eleLimit;  i++) {

			this.ele[ i ].pause();			
		}

		this.mode = "idle";

		Session.set("sScanningNow", false);

		this.drawCenter();
	}

	this.streamAnalyzer = function() {

		if (this.mode == "idle") {

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

		Meteor.setTimeout( function() { display.scanner.streamAnalyzer(); }, delay);

	}

	this.streamAnalyzerIdle = function() {

		document.getElementById("streamAnalyzerID").innerHTML = "(no streams detected)";
	}

	this.drawCenter = function() {

	    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

		var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

		var vertSpacer = fullHeight * 0.01;

		$("div.scanCenter").css("left", (fullBackdropWidth/2) - $(".scanCenter").outerWidth() / 2 + "px");

		if ( Session.get("sScanningNow") ) {

			$("div.scanCenter").css("top", fullHeight * 0.36 + "px" );

	   }
	   else {

			$("div.scanCenter").css("top", fullHeight * 0.3 + "px" );	   	
	   }

		$("div.scanCenterText").css("left", (fullBackdropWidth/2) - $(".scanCenterText").outerWidth() / 2 + "px");

	  	$("div.scanCenterText").css("top", fullHeight * 0.6 + "px" ); 
	}

	this.draw = function() {

	    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

	    var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

	    var horizSpacer = fullBackdropWidth * 0.01;

	    var vertSpacer = fullHeight * 0.01;

	   this.drawCenter();

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

function checkScan() {

  
  if (display.scanner.ele[ scTopLeft ].finished && display.scanner.ele[ scTopRight ].finished && display.scanner.ele[ scBottomLeft ].finished && display.scanner.ele[ scBottomCenter ].finished && display.scanner.ele[ scBottomRight ].finished )  {

    return true;
  }

  return false;

}

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
