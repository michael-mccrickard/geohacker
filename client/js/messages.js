//messages.js


showMessage = function( _text ) {


    var url = FlowRouter.current().path;

    if (url == '/worldMap') {

    	display.mapStatus.setAndShow( _text );

    	return;
    }
    
    if (url == "/closeup") {

        display.closeUp.setText(_text );

        return;
    }


    if (url == '/debrief') {

    	hack.debrief.setHeadline( _text );

    	return;
    }

    if (url == "/main") {

    	display.status.setAndShow( _text );

    	return;
    }

    if (url == "/lessonMap") {

        $("#lessonMapMessageBox").text( _text );

        return;
    }

    var _status = game.user.profile.st;

    if (_status == usTest || _status == usAdmin) {

        alert( _text);
    }
    else {

        c( _text );
    }
}