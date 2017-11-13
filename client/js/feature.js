Feature = function() {

    this.item = null;  //current feature record

    this.nextItem = null;  //the specific control record that is being pre-loaded as the next feature

    this.prevItem = null;

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

   this.loadNextItem = function( _name ) {

   		if (this.item) this.prevItem = this.item;

   		this.nextItem = new FeaturedItem();

   		this.nextItem.preload( _name );
   }

   /*****************************************************************
   /				ACTIVATION
   /****************************************************************/

   this.switchToNext = function() {

   		this.hideMeme();

   		this.item = this.nextItem;

Meteor.setTimeout( function() { hacker.feature.item.show(); }, 250 );

hacker.loader.showLoadedControl();  //shows the appropriate pic in the control button

   		Meme.showControl( hacker.loader.totalClueCount - 1);

   		Meme.dimBGControls( hacker.loader.totalClueCount - 1);

Meteor.setTimeout( function() { hacker.loader.go(); }, 5000 );
   }

   this.switchTo = function( _name, _index ) {

   		if (this.item) this.prevItem = this.item;		

   		this.hideMeme();

   		this.nextItem = new FeaturedItem();

   		this.nextItem.load( _name, _index );

   		hacker.suspendMedia();

 		Meteor.defer( function() { hacker.feature.switch(); } );

   }

	this.switch = function() {

		c("feature.js: switch() from " + this.item.getName() + " to " + this.nextItem.getName() )

		this.item = this.nextItem;

		var _name = this.item.getName();

		console.log("feature is now set to " + _name );

		
		this.ctl = hacker.ctl[ _name ];

		if (_name == "IMAGE" || _name == "WEB" ||  _name == "MEME") {		

			c("'feature.switch()' is calling setImageSource")

     		this.item.setImageSource();  //this will set the imageSrc for the featured area
     	}


		if (_name == "SOUND") {

			game.pauseMusic();

			if (this.item.ctl.getState() == sLoaded) this.item.ctl.setState( sPlaying );

			console.log("feature.switch() is calling setImageSource('SOUND')")

			this.item.setImageSource();
		}

		if (_name == "VIDEO") {

			game.pauseMusic();
	
			hacker.suspendBGSound();  //in case a sound file is playing in bg

		}

		c("feature.switch() is calling this.item.show()")
		
		//Need a slight delay here to ensure that the imageSource is ready

		Meteor.setTimeout( function() { hacker.feature.item.show(); }, 200 );  //will also play the media file, if any

	}

	this.hideMeme = function() {

		if (this.item) {

   			if (this.item.getName() == "MEME") this.item.ctl.hide();
   		}
	}

} //end feature constructor