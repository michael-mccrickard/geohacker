//errors.js


showMessage = function( _text ) {


    var url = FlowRouter.current().path;

    if (url == '/worldMap') {

    	game.display.mapStatus.setAndShow( _text );

    	return;
    }


    if (url == '/debrief') {

    	hack.debrief.setHeadline( _text );

    	return;
    }

    if (url == "/main") {

    	game.display.status.setAndShow( _text );

    	return;
    }

    alert( _text);

}