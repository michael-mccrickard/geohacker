var scanInterval = null;

var statusCount = 0;

var strStatus = ["Initializing scan protocol ...", "Packet detection started ...", "Downloaded packet headers ...", "Filtering headers by mission parameters ..."];

var stringStatusLimit = 4;

Template.scanning.helpers({

    getDateTime: function() {

      return (Session.get("sDateTime"));
    }

 })


Template.scanning.rendered = function() {

	//stopGif();
}


timeInc = 750;

function playGif() {

	//Meteor.setTimeout(function() { Control.playEffect( "scanner2.mp3"); }, 250);	

	if (statusCount == stringStatusLimit) {

		statusCount = -1;

		$("#status0").text( "System idle ..." );

	}
	else {

		$("#status0").text( strStatus[statusCount] );
	}
	
	statusCount++;

	$("#imgTopLeft").attr("src", "topLeftScanner.gif");

	$("#imgTopRight").attr("src", "topRightScanner.gif");

	$("#imgBottomRight").attr("src", "bottomRightScanner.gif");

	Meteor.setTimeout(function() { stopGif(); }, timeInc);	

}

function stopGif() {

	$("#imgTopLeft").attr("src", "topLeftScanner_static.gif");

	$("#imgTopRight").attr("src", "topRightScanner_static.gif");

	$("#imgBottomRight").attr("src", "bottomRightScanner_static.gif");

	Meteor.setTimeout(function() { playGif(); }, 2000);	

	//Meteor.setTimeout(function() { Control.playEffect("scanner2.mp3"); }, 2700);	
}

function _multiLine() {

		Meteor.setTimeout(function() { Control.playEffect( "scanner2.mp3"); }, 250);	

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
	
	statusCount++;
}

 Meteor.setInterval( function () {
        Session.set("sDateTime", Date().toLocaleString() ); 
}, 1000 );