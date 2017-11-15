Feature = function() {

    this.item = null;  //current feature record

    this.nextItem = null;  //the specific control record that is being pre-loaded as the next feature

    this.delayTime = 5000;

    this.ele = "img.featuredPic";

   /*****************************************************************
   /				BASIC METHODS
   /****************************************************************/


	this.on = function() {

		if (this.item) return true;

		return false;
	},

	this.off = function() {

		if (!this.item) return true;

		return false;
	},

	this.refreshWindow = function() {

		Meteor.setTimeout( function() { refreshWindow( "hacker.feature" ); }, 250 );
	}

	this.clear = function() {

		this.item = null;
	}


   /*****************************************************************
   /				LOADING
   /****************************************************************/

   this.preload = function( _name ) {

   		this.nextItem = new FeaturedItem( _name);  

   		this.nextItem.preload();
   }

   /*****************************************************************
   /				ACTIVATION
   /****************************************************************/

   this.switchToNext = function() {

		hack.mode = mDataFound;

		hacker.cue.setAndShow();

		//set the timer if we're on the first clue

		if (hacker.loader.totalClueCount == 1) {

			game.hackStartTime = new Date().getTime();
			
		}

		//see if any buttons need enabling / disabling

		hacker.checkMainScreen();

		Meme.showControl( hacker.loader.totalClueCount - 1);

		Meme.dimBGControls( hacker.loader.totalClueCount - 1);

		this.switch();

//if (hacker.loader.totalClueCount == 4) return;

Meteor.setTimeout( function() { hacker.loader.go(); }, 3000 );
   }

   this.switchTo = function( _name, _index  ) {	

   		hacker.pauseSequence();

   		this.nextItem = new FeaturedItem( _name );

   		this.nextItem.load( _index );

 		Meteor.defer( function() { hacker.feature.switch(); } );

   }

	this.switch = function() {

		stopSpinner();

		hacker.suspendMedia();

		this.hide();

		this.item = this.nextItem;

		var _name = this.item.getName();

		console.log("feature is now set to " + _name );

		
		this.ctl = hacker.ctl[ _name ];


		if (_name != "VIDEO" ) {		

			c("'feature.switch()' is calling setImageSource")

     		this.item.setImageSource();  //this will set the imageSrc for the featured area
     	}


		if (_name == "SOUND") {

			game.pauseMusic();

			if (this.item.ctl.getState() == sLoaded) this.item.ctl.setState( sPlaying );
		}

		if (_name == "VIDEO") {

			game.pauseMusic();
	
			hacker.suspendBGSound();  //in case a sound file is playing in bg

		}

		c("feature.switch() is calling this.item.show()")
		
		//Need a slight delay here to ensure that the imageSource is ready

		Meteor.setTimeout( function() { hacker.feature.item.show(); }, 200 );  //will also play the media file, if any

	}

	this.hide = function() {

		if (this.item) {

   			if (this.item.getName() == "MEME") {

   				this.item.ctl.hide();
   			}
   			else {

   				$( this.ele ).css("opacity", 0);
   			}
   		}
	}

} //end feature constructor