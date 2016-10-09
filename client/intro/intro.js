

Template.intro.events = {

  'click #introOK': function (evt, template) {

 		game.user.mode = uHelp; 		 

  		 FlowRouter.go("/help"); 

  },
}


Template.intro.rendered = function() {

	game.intro.introIsWaiting = false;

	game.intro.photoReady = false;


	_pic = $("#cameraCH");  

	_text = $(".introText");


	doSpinner();

	Control.playEffect("processing.mp3");

	game.intro.tl.to( _text, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.25} );

}


Intro = function() {

	this.tl = new TimelineLite();

	this.pic = null;

	this.text = null;

	this.introIsWaiting = false;

	this.photoReady = false;

	this.headline = new Headline("intro");


	this.startIntro = function() {

		game.user.mode = uIntro;

		var tl = this.tl;


		this.pic = $("#cameraCH");  

		this.text = $(".introText");


		tl.add(stopSpinner, 1.8);

		var _height = $(window).height() - 55 - ($(window).height() * 0.01);

		tl.add( () => { $(".divIntro").css("height", _height + "px") } );


		tl.add( () => { Control.playEffect("approved.mp3"); } );

		tl.add( () => { $(".introText").text("*** approved ***") } );


		tl.add( () => { game.intro.headline.setThisAndType("CREATING IDENTIFICATION BADGE") } );


		tl.add( () => { $(".introText").addClass("greenText") } );

	    tl.to( this.text, 0.5, { opacity: 0.0, ease:"Sine.easeOut", delay: 1.0 } );


		tl.add( () => { $("#cameraCH").attr("src", "camera_crosshairs.jpg") }  );

	    tl.to( this.pic, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.0 } );


		tl.add( () => {  Control.playEffect( "flash.mp3") }  );

		tl.add( () => {  $("#cameraCH").attr("src", "camera_crosshairs_invert.jpg") }  );	

		tl.add( () => { $("#cameraCH").attr("src", "camera_crosshairs.jpg") }, 1.0  );

		
		tl.to( this.pic, 0.25, { opacity: 0.0, ease:"Sine.easeOut", delay: 0.1} );


		tl.add( () => {  $(".introText").removeClass("greenText")  } );


		tl.add( () => { Control.playEffect2("map_pulse.mp3"); } );


		tl.add( () => {  $(".introText").text("Processing your photo...") } );


	    tl.to( this.text, 0.5, { opacity: 1.0, ease:"Sine.easeOut", delay: 0.0, onComplete: checkPhotoStatus } );


		tl.add( () => {  doSpinner(); } );

	}

	this.checkPhotoStatus = function()  {

		if (this.photoReady) {

			this.finishIntro();

			return;
		}

		this.introIsWaiting = true;
	}

	this.finishIntro =function() {

		this.tl = new TimelineLite();

		var tl = this.tl;

		Session.set("sProcessingApplication", false);

		tl.to( this.text, 0.5, { opacity: 0.0, ease:"Sine.easeOut" } );	

		stopSpinner();


		var _av = Meteor.user().profile.av;

		tl.add( () => { $("#cameraCH").attr("src", _av) } );

		var _top = 55 + 0.05 * $(window).height();

		tl.add( () => { $(".divIntro").css("top", _top + "px") } );



		tl.to( this.pic, 0.0, { opacity: 1.0, delay: 0.5 } );


		tl.add( () => { $("#cameraCH").css("width", "256px") } );

		tl.add( () => { $("#cameraCH").css("height", "256px") } );


		tl.add( () => { stopSpinner(); }  );


		tl.add( () => { Control.playEffect("photoDone.mp3"); } );


		tl.add( () => {  game.user.photoReady.set( true ); } );

		tl.add( () => {  game.intro.headline.setThisAndType("INITIALIZING TRAINING MODULE") } );		

	 
		tl.add( () => {  $(".introText").text("Agent: " + game.user.name) } );


		tl.add( () => {  $(".introText").css("top", _top + 128 + 0.03 * $(window).height() )  } );


		tl.to( this.text, 0.25, { opacity: 1.0, delay: 0.0 } );	

		tl.to( this.pic, 1.0, { opacity: 0.0, delay: 2.0 } );	

		tl.to( this.text, 1.0, { opacity: 0.0 }, "-=2" );	


		tl.add( () => {  $(".introText").text("AT ANY TIME, CLICK YOUR PHOTO TO GO TO THE MENU.") } );

		tl.add( () => {  $(".introText").css("top", "390px")  } );

		tl.add( () => {  $(".introText").css("text-align", "right")  } );

		tl.add( () => {  $(".introText").css("margin-right", 16)  } );

		tl.add( () => {  $("#clickPhoto").attr("src", "clickPhoto.png") }  );		   

		tl.add( () => { $("#clickPhoto").css("top", "-20px") } );

		var _left = $(window).width() - 790;

		tl.add( () => { $("#clickPhoto").css("left", _left + "px") } );



		tl.to( this.text, 0.5, { opacity: 1.0, delay: 0.0 } );	

		tl.to( "#clickPhoto", 0.5, { opacity: 1.0, delay: 0.0 } );	

		tl.to( "#introOK", 0.5, { opacity: 1.0, delay: 0.0 } );	


	}

}

Tracker.autorun( function(comp) {

	if ( Session.get("sProcessingApplication") ) {

		if ( Meteor.user() )

		    if (Meteor.user().profile.av.length) {

				if (game.intro.introIsWaiting) {

					game.intro.finishIntro();

					return;
				}

				game.intro.photoReady = true;

		    }
		}
	}

);

checkPhotoStatus = function() {

	game.intro.checkPhotoStatus();
}