//intro.js

var tl = new TimelineLite();

var _pic = null;

var _text = null;

var introIsWaiting = false;

var photoReady = false;




Template.intro.rendered = function() {


c("template intro rendered ")

	introIsWaiting = false;

	photoReady = false;


	_pic = $("#cameraCH");  

	_text = $(".introText");


	doSpinner();

	Control.playEffect("processing.mp3");

	tl.to( _text, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.25} );

}



startIntro = function() {

c("start intro");

	tl.add(stopSpinner, 1.8);

	var _height = $(window).height() - 55 - ($(window).height() * 0.01);

	tl.add( () => { $(".divIntro").css("height", _height + "px") } );


	tl.add( () => { Control.playEffect("approved.mp3"); } );

	tl.add( () => { $(".introText").text("*** approved ***") } );


	tl.add( () => { $(".introText").addClass("greenText") } );

    tl.to( _text, 0.5, { opacity: 0.0, ease:"Sine.easeOut", delay: 0.0 } );


	tl.add( () => { $("#cameraCH").attr("src", "camera_crosshairs.jpg") }  );

    tl.to( _pic, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.0 } );

	tl.add( () => { Control.playEffect( "holdStill.mp3") }  );


	tl.add( () => {  Control.playEffect( "flash.mp3") }  );

	tl.add( () => {  $("#cameraCH").attr("src", "camera_crosshairs_invert.jpg") }  );	

	tl.add( () => { $("#cameraCH").attr("src", "camera_crosshairs.jpg") }, 1.0  );

	
	tl.to( _pic, 0.25, { opacity: 0.0, ease:"Sine.easeOut", delay: 0.1} );


	tl.add( () => {  $(".introText").removeClass("greenText")  } );


	tl.add( () => { Control.playEffect2("map_pulse.mp3"); } );


	tl.add( () => {  $(".introText").text("Processing your photo...") } );


    tl.to( _text, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.0, onComplete: checkPhotoStatus } );


	tl.add( () => {  doSpinner(); } );

}

function checkPhotoStatus()  {
	if (photoReady) {

c("calling finishIntro from checkPhotoStatus")

		finishIntro();

		return;
	}

	introIsWaiting = true;
}

function finishIntro() {

c("finishIntro")

	tl = new TimelineLite();

	Session.set("sProcessingApplication", false);

	tl.to(_text, 0.5, { opacity: 0.0, ease:"Sine.easeOut" } );	

	stopSpinner();


	var _av = Meteor.user().profile.av;

	tl.add( () => { $("#cameraCH").attr("src", _av) } );

	//var _top = ( $(window).height() / 2 ) - (256 / 2);

	var _top = 55 + 0.05 * $(window).height();

	tl.add( () => { $(".divIntro").css("top", _top + "px") } );



	tl.to(_pic, 0.0, { opacity: 1.0, delay: 0.5 } );


tl.add( () => { $("#cameraCH").css("width", "256px") } );

tl.add( () => { $("#cameraCH").css("height", "256px") } );


	tl.add( () => { stopSpinner(); }  );


	tl.add( () => { Control.playEffect("photoDone.mp3"); } );


	tl.add( () => {  game.user.photoReady.set( true ); } );


	tl.add( () => {  Control.playEffect("NotTheBestLikeness.mp3"); } );


	tl.add( () => {  $(".introText").text("Agent: " + game.user.name) } );


	tl.add( () => {  $(".introText").css("top", _top + 128 + 0.03 * $(window).height() )  } );

	tl.to(_text, 0.25, { opacity: 1.0, delay: 0.0 } );	

return;
	tl.to(_pic, 1.0, { opacity: 0.0, delay: 5.0 } );	

	tl.to(_text, 1.0, { opacity: 1.0 }, "-=5" );	

	tl.add( () => {  playIntroVideo(); } );

}

playIntroVideo = function() {

	stopSpinner();

	game.stopMusic();

	game.user.mode = uIntro;

	Session.set("sYouTubeOn", false);

      if (youTubeLoaded == false) {
        
        c("calling YT.load() in intro")
        
        YT.load();
      }
      else {

      c("loading YT vid by ID in intro")
        
        ytplayer.loadVideoById( introVideoID );            
      }

      Session.set("sYouTubeOn", true);
}

Tracker.autorun( function(comp) {

	if ( Session.get("sProcessingApplication") ) {

		if ( Meteor.user() )

		    if (Meteor.user().profile.av.length) {

				if (introIsWaiting) {

c("calling finish intro from autorun")

					finishIntro();

					return;
				}

				photoReady = true;

		    }
		}
	}

);