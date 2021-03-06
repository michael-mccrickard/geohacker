FeaturedItem = function( _name ) {
	
	this.name = new Blaze.ReactiveVar( _name );

	this.isLoaded = new Blaze.ReactiveVar( false );

	this.ctl = null;

	this.imageFile = null;

	this.soundFile = "";

	this.videoFile = null;

	this.fileToLoad = "";

	this.text = "";

	this.source = "UNKNOWN";  //for images or any other element that might have a URL (for credit purposes)


	this.getName = function() {

		return this.name.get();
	},


	this.setName = function( _val ) {

		this.name.set( _val );
	},

	//change the image only without any dimensioning or re-positioning

	this.changeImage = function( _src ) {

		$("img.featuredPic").attr("src", _src);
	} 


 /*****************************************************************
    /				VISIBILITY AND FADING
    /****************************************************************/


	this.show = function() {

		this.ctl.hilite();

		this.ctl.doNavButtons();

		this.redimension();

		if (this.getName() == "VIDEO") {

			game.pauseMusic();

			this.ctl.setState( sPlaying );  //redundant for a YT vid, but not a GIF

			if (this.ctl.video.isYouTube) {

				//in ctl check to see if already playing?

				this.ctl.play();			
			}
		}

		if (this.getName() == "SOUND") {

			game.pauseMusic();

			//in ctl check to see if already playing?

			this.ctl.play();
		}

		if (this.getName() == "MEME") {

			Meteor.setTimeout( function() { hacker.feature.item.ctl.show(); }, 260 );

			return;
		}

		//don't show the featuredPic or Meme on top of the video

		if (this.getName() == "VIDEO") {

			this.fadeOutStillFeature();
		}
		else {

			this.fadeInStillFeature();
		}

	}

	//the meme features will handle their own visibility

	this.fadeInStillFeature = function() {

		$("img.featuredPic").attr("src", this.imageFile );

		$("img.featuredPic").css("opacity", "0");

		$("img.featuredPic" ).velocity("fadeIn", { duration: 500, display: "auto" });	
	}

	this.fadeOutStillFeature = function() {

		$("img.featuredPic").attr("src", this.imageFile );

		$("img.featuredPic").css("opacity", "0");

		$("img.featuredPic" ).velocity("fadeOut", { duration: 500, display: "auto" });	
	}

	this.dim = function() {

		if (this.getName() == "MEME") {

			this.ctl.meme.dim();

			return;
		}

if ( $(".featuredPic").css("opacity") == "1" ) $(".featuredPic" ).velocity( { opacity: 0.0, duration: _time });
	}

   /*****************************************************************
    /				LOADING AND PRELOADING
    /****************************************************************/

    this.load = function( _index ) {

		this.ctl = hacker.ctl[ this.getName() ];

		this.ctl.setIndex( _index );

		this.ctl.setData( this );    	
    }


	this.preload = function() {

		console.log("preloading =" + this.name.get() )

		this.ctl = hacker.ctl[ this.name.get() ];

		this.ctl.setData( this );  //get the filename, etc from the control

		if ( _name == "VIDEO") {

			if ( this.ctl.video.isYouTube ) {

          		this.fileIsLoaded();

				return;
			}				
		}

		$("#preloadFeature").attr("src", this.fileToLoad);

        imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {
    
          //now that the image is loaded ...

          hacker.feature.nextItem.imageSrc = display.getImageFromFile( hacker.feature.nextItem.fileToLoad );

		  console.log("in featuredItem.preload(), imageSrc created from " + hacker.feature.nextItem.fileToLoad);
 
          hacker.feature.nextItem.fileIsLoaded();

        });
	}

	this.fileIsLoaded = function() {

		c("featuredItem.fileIsLoaded()");

		//To do, gut the scanner code

/*
		//if the scanner is still running, it's possible that it is still waiting on the image to load

		if ( hacker.scanner.centerState == "scan" || hacker.scanner.centerState == "rescan") {

			//this returns true if the scanner has finished running all the way through (100% progress)

			if (hacker.scanner.checkScan("feature") == true) { hacker.scanner.stopScan(); }
		}
*/

		//if checkScan above returned false, then the scanner is still running, so we just
		//set this reactive var, so that the scanner knows the image is ready when it finishes.

		this.isLoaded.set( true );

c("calling feature switchToNext in item.fileIsLoaded")

hacker.feature.switchToNext();

	}


	this.setImageSource = function() {

		if ( this.name == "VIDEO") {

			if ( this.ctl.video.isYouTube )  {

				console.log("featuredItem.setImageSource returning b/c file is YT")

				return;
			}

			console.log("featuredItem.setImageSource setting file and imageSrc for animated gif")
		}

		if (this.fileToLoad) this.imageSrc = display.getImageFromFile( this.fileToLoad );

		console.log("in featuredItem.setImageSource(), imageSrc created from " + this.fileToLoad);
	}


 /*****************************************************************
  /				DIMENSIONING
 /****************************************************************/


	this.redimension = function() {

		this.dimensionNow( this.imageFile, this.imageSrc);
		
	}

	this.dimensionNow = function(_file, _src) {

		var _name = this.getName();

		if (_name == "MEME") {

			this.ctl.dimension();

			return;
		}

        if (_name == "VIDEO"  && this.ctl.video.isYouTube ) {

			console.log("featuredItem.dimensionNow is calling dimension(video)")
            
            this.dimension("video", null, null);
        }
        else {

            var myFrame = { width: 0, height: 0, top: 0, left: 0 };

			console.log("featuredItem.dimensionNow is calling dimension(image type)")

            this.dimension("image", myFrame, _src);       


            $("img.featuredPic").css("left", myFrame.left);

            $("img.featuredPic").css("width",  myFrame.width);

            $("img.featuredPic").css("height",  myFrame.height);

            $("img.featuredPic").css("top",  myFrame.top);
        }
	}

    this.dimension = function( _type, _obj, _src ) {

        var fullScreenWidth = $(window).width();

        var fullScreenHeight = $(window).height();

        var container = "img.featuredBackdrop";

        var fullBackdropWidth = $( container ).width();

        var maxWidth = fullBackdropWidth * 0.8;

        var _fullHeight = $(container).height();

        var leftMargin = $(container).position().left;

        var _height = _fullHeight;

        var menuHeight = 50;

        var _width = 0;

        //Use the widescreen ratio for video, and the normal proportions for others

        if (_type == "video") {

            _width = _height * 16/9;

        }
        else {

            if (_src) _width = (_fullHeight / _src.height ) * _src.width; 

        }

        //Clamp the width if necessary and determine the position on the screen

        if (_width > maxWidth) _width = maxWidth;

var _fullWidth = _width;

_width =_width * 0.9;

        var _top = $(container).position().top;

_top = _top + (_fullHeight * 0.05);

        var _left = leftMargin + (fullBackdropWidth/2) - (_width/2);

_left = _left + ( _fullWidth * 0.05 );

_height = _fullHeight - (_fullHeight * 0.1);

        //size the frame

		var _outerLeft = leftMargin + (fullBackdropWidth/2) - (_width/2); //should match declaration of _left above

		var _outerTop = $(container).position().top; 

		var _outerHeight = $(container).height();

		var _outerWidth = _fullWidth;   //should match declaration of _width above

		container = ".featuredPicOuterFrame";

		$( container ).css("left",  _outerLeft + "px" );  

		$( container ).css("top", _outerTop + "px");

		$( container ).attr("height", _outerHeight);

		$( container ).attr("width", _outerWidth );  

//close button

		container = ".featuredPicCloseButton";

		var _btnWidth = _outerWidth * 0.075;

		var _btnHeight = _outerHeight * 0.05

		$( container ).css("left",  _outerLeft + _outerWidth - _btnWidth / 2 + "px" );  

		$( container ).css("top", _outerTop + (_outerHeight * 0.01) + "px");

		$( container ).attr("height",  _btnHeight+ "px");

		$( container ).attr("width", _btnWidth + "px" ); 

        //if an _obj was passed, then populate it ...

        if (_obj) {
          
          _obj.width = _width;

          _obj.height = _height;

          _obj.top = _top

          _obj.left = _left
        }

        //...otherwise we are dimming a YT video

        else {

          $(".featuredYouTubeVideo").css("left",  _left);  

          $(".featuredYouTubeVideo").css("top", _top);

          $("iframe#ytplayer").css("height", _height );

          $("iframe#ytplayer").css("width", _width );    

        }

    }
}