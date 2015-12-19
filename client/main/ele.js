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

		if (this.ID == scTopLeft) Meteor.setTimeout( function() { display.scanner.pauseIdle( scTopLeft ) }, display.scanner.ele[ scTopLeft ].idlePlayTime[ display.scanner.ele[ scTopLeft ].index  ] ); 	

		if (this.ID == scTopRight) Meteor.setTimeout( function() { display.scanner.pauseIdle( scTopRight ) }, display.scanner.ele[ scTopRight ].idlePlayTime[ display.scanner.ele[ scTopRight ].index ] ); 	

		if (this.ID == scBottomLeft) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomLeft ) }, display.scanner.ele[ scBottomLeft ].idlePlayTime[ display.scanner.ele[ scBottomLeft ].index  ] ); 	

		if (this.ID == scBottomCenter) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomCenter ) }, display.scanner.ele[ scBottomCenter ].idlePlayTime[ display.scanner.ele[ scBottomCenter ].index  ] ); 

		if (this.ID == scBottomRight) Meteor.setTimeout( function() { display.scanner.pauseIdle( scBottomRight ) }, display.scanner.ele[ scBottomRight ].idlePlayTime[ display.scanner.ele[ scBottomRight ].index ] ); 	

	}

	this.nextScanMessage = function( _index ) {

		if (this.finished == true) { return;}

		//in the case of a rescan, we are sending a non-zero number as the starting point

		this.index = this.index + 1;

		if (this.index == this.scan.length) {

			this.index = 0;

			this.finished = true;

			//if (display.scanner.checkScan() == true) { display.scanner.stopScan(); }

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
