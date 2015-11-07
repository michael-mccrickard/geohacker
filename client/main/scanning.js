var scanInterval = null;

var statusCount = 0;


Template.scanning.helpers({

    topLeftText: function() {

//need to differentiate between idling and scanning here

      var _index = display.scanner.ele[ scTopLeft ].index.get();

      return display.scanner.ele[ scTopLeft ].idle[ _index ];
    },

    topRightText: function() {

//need to differentiate between idling and scanning here

      var _index = display.scanner.ele[ scTopRight ].index.get();

      return display.scanner.ele[ scTopRight ].idle[ _index ];
    }

 })


tt = function() {

	//stopGif();
}



playTimeInc = 1800;

pauseTimeInc = 1800;

playGif = function() {

	//Meteor.setTimeout(function() { Control.playEffect( "scanner2.mp3"); }, 250);	

	if (hack.mode == mScanning) {

		_multiLine();
	}
	else {
		
		_singleLine();
	}

	statusCount++;
	
	$("#imgTopLeft").attr("src", "topLeftScanner.gif");

	$("#imgTopRight").attr("src", "topRightScanner.gif");

	$("#imgBottomRight").attr("src", "gridGlobe.gif");

	Meteor.setTimeout(function() { stopGif(); }, playTimeInc);	

}

function stopGif() {

	$("#imgTopLeft").attr("src", "topLeftScanner_static.gif");

	$("#imgTopRight").attr("src", "topRightScanner_static.gif");

	$("#imgBottomRight").attr("src", "lowerRightCorner_static.gif");

	Meteor.setTimeout(function() { playGif(); }, pauseTimeInc);	

	//Meteor.setTimeout(function() { Control.playEffect("scanner2.mp3"); }, 2700);	
}

function _singleLine() {

	if (statusCount == stringStatusLimit) {

		statusCount = -1;

		$("#status0").text( "System idle ..." );

	}
	else {

		$("#status0").text( strStatus[statusCount] );
	}

}

function _multiLine() {

	//Meteor.setTimeout(function() { Control.playEffect( "scanner2.mp3"); }, 250);	

	if (statusCount == stringStatusLimit) {

		statusCount = -1;

		$("#status0").text( "System idle ..." );

		for (var i = 1; i < stringStatusLimit; i++){

			$("#status" + i).text( "" );
		}

	}
	else {

		$("#status" + statusCount).text( strStatus[statusCount] );
	}

}

 Meteor.setInterval( function () {
        Session.set("sDateTime", Date().toLocaleString() ); 
}, 1000 );