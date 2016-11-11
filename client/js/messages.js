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

    	hack.debrief.setHeadline( _text );

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

    var _status = game.user.profile.st;
*/
   // if (_status == usTest || _status == usAdmin) {

        //alert( _text);

        $("div#universalMessageText").removeClass("invisible");
    
        $("div#universalMessageText").text( _text );

        c( _text );
/*
    }
    else {

        c( _text );
    }
*/
}

hideMessage = function() { $("div#universalMessageText").addClass("invisible"); }

