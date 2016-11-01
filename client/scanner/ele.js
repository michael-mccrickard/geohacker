/* ele.js  */

Ele = function(_name, _ID, _type ) {

	this.finished = false;

	this.type = _type;

	this.idlePauseTime = [];

	this.idlePlayTime = [];

	this.scanPlayTime = [];

	this.totalScanPlayTime = 0.0;

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

		if (this.ID == scTopLeft) Meteor.setTimeout( function() { hacker.scanner.pauseIdle( scTopLeft ) }, hacker.scanner.ele[ scTopLeft ].idlePlayTime[ hacker.scanner.ele[ scTopLeft ].index  ] ); 	

		if (this.ID == scTopRight) Meteor.setTimeout( function() { hacker.scanner.pauseIdle( scTopRight ) }, hacker.scanner.ele[ scTopRight ].idlePlayTime[ hacker.scanner.ele[ scTopRight ].index ] ); 	

		if (this.ID == scBottomLeft) Meteor.setTimeout( function() { hacker.scanner.pauseIdle( scBottomLeft ) }, hacker.scanner.ele[ scBottomLeft ].idlePlayTime[ hacker.scanner.ele[ scBottomLeft ].index  ] ); 	

		if (this.ID == scBottomCenter) Meteor.setTimeout( function() { hacker.scanner.pauseIdle( scBottomCenter ) }, hacker.scanner.ele[ scBottomCenter ].idlePlayTime[ hacker.scanner.ele[ scBottomCenter ].index  ] ); 

		if (this.ID == scBottomRight) Meteor.setTimeout( function() { hacker.scanner.pauseIdle( scBottomRight ) }, hacker.scanner.ele[ scBottomRight ].idlePlayTime[ hacker.scanner.ele[ scBottomRight ].index ] ); 	

	}

	this.nextScanMessage = function( _index ) {

		if (this.finished == true) { return;}

		//in the case of a rescan, we are sending a non-zero number as the starting point

		this.index = this.index + 1;

		if (this.index == this.scan.length) {

			this.index = 0;

			this.finished = true;

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

		if (this.ID == scTopLeft) Meteor.setTimeout( function() { hacker.scanner.nextScanMessage( scTopLeft ) }, hacker.scanner.ele[ scTopLeft ].scanPlayTime[ hacker.scanner.ele[ scTopLeft ].index  ] ); 	

		if (this.ID == scTopRight) Meteor.setTimeout( function() { hacker.scanner.nextScanMessage( scTopRight ) }, hacker.scanner.ele[ scTopRight ].scanPlayTime[ hacker.scanner.ele[ scTopRight ].index ] ); 	

		if (this.ID == scBottomLeft) Meteor.setTimeout( function() { hacker.scanner.nextScanMessage( scBottomLeft ) }, hacker.scanner.ele[ scBottomLeft ].scanPlayTime[ hacker.scanner.ele[ scBottomLeft ].index  ] ); 	

		if (this.ID == scBottomCenter) Meteor.setTimeout( function() { hacker.scanner.nextScanMessage( scBottomCenter ) }, hacker.scanner.ele[ scBottomCenter ].scanPlayTime[ hacker.scanner.ele[ scBottomCenter ].index  ] ); 

		if (this.ID == scBottomRight) Meteor.setTimeout( function() { hacker.scanner.nextScanMessage( scBottomRight ) }, hacker.scanner.ele[ scBottomRight ].scanPlayTime[ hacker.scanner.ele[ scBottomRight ].index ] ); 	

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
