//messages.js


showMessage = function( _text ) {


    var url = FlowRouter.current().path;

    if (url == '/worldMap') {

    	display.mapStatus.setAndShow( _text );

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

    alert( _text);

}