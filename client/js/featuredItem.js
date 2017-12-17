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

		//this.ctl.hilite();

		//this.ctl.doNavButtons();

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

		//don't show the featuredPic on top of the YT video

		if (this.getName() == "VIDEO") {

			if ( this.ctl.video.isYouTube ) this.fadeOutStillFeature();
		}

		this.fadeInStillFeature();


	}

	//the meme features will handle their own visibility

	this.fadeInStillFeature = function() {

		$("img.featuredPic").attr("src", this.imageFile );

		$("img.featuredPic").css("opacity", "0");

		$("img.featuredPic" ).velocity("fadeIn", { duration: 500, display: "auto" });	
	}

	this.fadeOutStillFeature = function() {

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

		var _btnWidth = 32;

		var _btnHeight = 32;

		var _btnMargin = 4;

		var _btnDimension = 2 * (_btnWidth + _btnMargin);

        var container = "img.featuredBackdrop";

        var fullBackdropWidth = $( container ).width();

        var maxWidth = fullBackdropWidth;

        var _fullHeight = $(container).height() - _btnDimension;

        var leftMargin = $(container).position().left;

        var _height = _fullHeight;

        var menuHeight = 50;


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

 		_width = _width - _btnDimension;

        var _top = $(container).position().top + _btnDimension/2;


	    var _left = leftMargin + ( maxWidth / 2 ) - ( _width / 2 );

	    var _fullLeft = _left;

		_left = _left + _btnDimension / 2;



        //size the frame

//now the outer frame

		var _outerLeft = _fullLeft; 

		var _outerTop = $(container).position().top; 

		var _outerHeight = $(container).height();

		var _outerWidth = _fullWidth;   


		container = ".featuredPicOuterFrame";

		$( container ).css("left",  _outerLeft + "px" );  

		$( container ).css("top", _outerTop + "px");

		$( container ).attr("height", _outerHeight);

		$( container ).attr("width", _outerWidth );  

//close button

		container = ".featuredPicCloseButton";

//do we have enough space for the button?

		if ( _outerWidth - _width < _btnDimension ) {

			//how much do we lack?
			
			var _diff = _outerWidth - _width - _btnDimension;

			_outerWidth += Math.abs( _diff );

			$( "img.memeOuterFrame" ).attr("width", _outerWidth );  
		}

		$( container ).css("left",  _outerLeft + _outerWidth - (_btnWidth + _btnMargin) + "px" );  

		$( container ).css("top", _outerTop + _btnMargin + "px");

		$( container ).attr("height",  _btnHeight + "px");

		$( container ).attr("width", _btnWidth + "px" ); 	

        //if an _obj was passed, then populate it ...

        if (_obj) {
          
			_obj.left =  _left + "px";  

			_obj.top = _top + "px";

			_obj.height = _fullHeight;

			_obj.width = _width;  

			_obj.src = this.fileToLoad;

        }

        //...otherwise we are dimming a YT video

        else {

          $(".featuredYouTubeVideo").css("left",  _left);  

          $(".featuredYouTubeVideo").css("top", _top);

          $("iframe#ytplayer").css("height", _height );

          $("iframe#ytplayer").css("width", _width );   

          container = ".featuredPicOuterFrame";

          $( container ).removeClass("hidden"); 

			container = ".featuredPicCloseButton";

          $( container ).removeClass("hidden"); 
        }

    }
}