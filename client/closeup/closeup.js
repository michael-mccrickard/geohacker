


Template.closeup.events = {

  'click #divCloseup': function (e) { 

  		e.preventDefault();

      display.mainTemplateReady = false;

      if (display.feature.getName() == "MAP") {

        Router.go("/debrief");

        return;
      }

  		Router.go("/main");
  	}
}

Template.closeup.helpers({


})


refreshCloseupWindow = function( img) {

	//var img = display.feature.imageSrc;

    var fullScreenWidth = $(window).width();

    var fullScreenHeight = $(window).height();

    //the background box

    var container = "div#closeupBox";

    var maxWidth = $( container ).width() * 0.98;

    fullScreenHeight = fullScreenHeight - display.menuHeight;

    $( container ).css("top", display.menuHeight + (fullScreenHeight * 0.01) );

    var fullHeight = fullScreenHeight * 0.98;

    $( container ).css("height", fullHeight );

     $( container ).css("left", fullScreenWidth * 0.01 );
     
    //the picture

    var _width = (fullHeight / img.height ) * img.width; 

    if (_width > maxWidth) _width = maxWidth;

    var _left = ($( container ).width()/2) - (_width / 2 );

  	var container = "img#closeupPicFrame.debriefPicFrame";

  	$( container ).css("left",  _left );  

  	$( container ).css("top", "1%");

  	$( container ).attr("height", fullHeight * 0.98 );

  	$( container ).attr("width", _width );    

  	$( container ).attr("src", img.src );    	
}