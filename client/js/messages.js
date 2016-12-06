//messages.js


showMessage = function( _text ) {

/*
    var url = FlowRouter.current().path;

    if (url == '/worldMap') {

    	hacker.mapStatus.setAndShow( _text );

    	return;
    }
    
    if (url == "/closeup") {

        hacker.closeUp.setText(_text );

        return;
    }


    if (url == '/debrief') {

    	hacker.debrief.setHeadline( _text );

    	return;
    }

    if (url == "/main") {

    	hacker.status.setAndShow( _text );

    	return;
    }

    if (url == "/lessonMap") {

        $("#lessonMapMessageBox").text( _text );

        return;
    }


*/
   // if (_status == usTest || _status == usAdmin) {

        //alert( _text);
    
var _status = game.user.profile.st;

        c( _text );

if (_status == usTest || _status == usAdmin) {
return;
        $("div#universalMessageText").removeClass("invisible");
    
        $("div#universalMessageText").text( _text );

        Meteor.setTimeout( function() { $("div#universalMessageText").addClass("invisible"); }, 1000);
}

/*
    }
    else {

        c( _text );
    }
*/
}

hideMessage = function() { $("div#universalMessageText").addClass("invisible"); }

