Feature = function() {
	
	this.name = "";

	this.isLoaded = new Blaze.ReactiveVar( false );

	this.displayMessage = new Blaze.ReactiveVar( false );

	this.ctl = null;

	this.iconPic = "geohacker_background.png";    

	this.imageSrc = null;

    this.file = null;

    this.source = null;

	this.on = function() {

		if (this.name.length > 0) return true;
	
		return false;
	},

	this.off = function() {

		if (this.name.length > 0) return false;

		return true;
	},

	//change the image only without any dimensioning or re-positioning

	this.changeImage = function( _src ) {

		$("img.featuredPic").attr("src", _src);
	} 

	this.show = function() {
 
		this.hide();

		this.ctl.hilite();

		if (this.getName() == "TEXT") {

			this.showText();
		}
		else {

			this.predraw();

			if (this.getName() == "VIDEO") {

				if (this.ctl.video.isYouTube) {

					this.ctl.play();

					return;
				}
				
			}

			if (this.getName() == "SOUND") this.ctl.play();


			$("img.featuredPic").attr("src", this.getFile( this.getName() ) );

			$("img.featuredPic").css("opacity", "0");

			$("img.featuredPic").removeClass("hidden");

			$("img.featuredPic" ).velocity("fadeIn", { duration: 500, display: "auto" });			
		}
	}

	this.showText = function() {

		this.hide();

		$("span.featuredText").removeClass("hidden");

	}

	this.hide = function() {

		$("img.featuredPic").addClass("hidden");

		$("span.featuredText").addClass("hidden");		

	}

	//this one fires before the _name control has been
	//set as the feature, so this.ctl will not refer
	//to the _name control

	this.preload = function( _name ) {

		console.log("_name in feature preload =" + _name)

		this.ctl = display.ctl[ _name ];
		
		this.file = this.getFile( _name);

		if ( _name == "VIDEO") {

			this.ctl.video = new Video( this.file, display.ctl["VIDEO"] );


			if ( youtube.isFile( this.file ) ) {

          		this.fileIsLoaded();

				return;
			}				

		}

		if (this.file == null) {

			//TEXT has no file, so just call the function and return

          	this.fileIsLoaded(); 

			return;
		}

		$("#pFEATURE3").attr("src", this.file);

        imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {
    
          //now that the image is loaded ...

          display.feature.imageSrc = Control.getImageFromFile( display.feature.file );

		  console.log("in feature.preload(), feature imageSrc created from " + this.file);
 
          display.feature.fileIsLoaded();

        });
	}

	this.fileIsLoaded = function() {

		c("feature.fileIsLoaded()");

		this.setName( display.loader.newControl.name );

		this.file = this.getFile( display.loader.newControl.name );


		//if the scanner is still running, it's possible that it is still waiting on the image to load

		if ( display.scanner.centerState == "scan" || display.scanner.centerState == "rescan") {

			//this returns true if the scanner has finished running all the way through (100% progress)

			if (display.scanner.checkScan("feature") == true) {display.scanner.stopScan();}
		}

		//if checkScan above returned false, then the scanner is still running, so we just
		//set this session var, so that the scanner knows the image is ready when it finishes.

		this.isLoaded.set( true );

	}


	this.setImageSource = function( _name) {

		if ( _name == "VIDEO") {

			if ( this.ctl.video.isYouTube )  {

				console.log("feature.setImageSource returning b/c file is YT")

				return;
			}

			console.log("feature.setImageSource setting file and imageSrc for animated gif")
		}

	
		this.file = this.getFile( _name);

		if (this.file) this.imageSrc = Control.getImageFromFile( this.file );

		console.log("in feature.setImageSource(), feature imageSrc created from " + this.file);
	}

	this.dim = function( _time ) {

		if ( $(".featuredPic").css("opacity") == "1" ) $(".featuredPic" ).velocity( { opacity: 0.3, duration: _time });
	}

	this.getFile = function( _name ) {

		var _file = null;

		var _index = display.ctl[ _name ].getIndex();

		//set the source property for the credit line in closeup view

		if (display.ctl[ _name ].items[ _index ]) {

			this.source = display.ctl[ _name ].items[ _index ].s;
		}

		if ( _name == "SOUND") {

			 _file = display.ctl[ _name ].getFeaturedPic();
		}
		else {

			_file = display.ctl[ _name ].getFile();
		}

		return _file;
	}	

	this.getName = function() {

		return this.name;
	},


	this.setName = function( _val ) {

		this.name = _val;
	},


	this.switch = function( _name ) {

		display.suspendMedia();

		c("feature.js: switch() with " + _name)

		this.setName( _name );

		console.log("feature is now set to " + _name);

		
		this.ctl = display.ctl[ _name ];

		if (_name == "IMAGE" || _name == "WEB") {		

			c("'click control' is calling setImageSource")

     		this.setImageSource( _name );  //this will set the imageSrc for the featured area
     	}


		if (_name == "SOUND") {

			game.pauseMusic();

			if (this.ctl.getState() == sLoaded) this.ctl.setState( sPlaying );

			console.log("feature.set is calling sound.activateState()")

			this.setImageSource("SOUND");
		}

		if (_name == "VIDEO") {

			game.pauseMusic();
	
			display.suspendBGSound();  //in case a sound file is playing in bg

		}

		c("feature.set is calling this.draw()")
		
		this.show();  //will also play the media file, if any

	}

	this.refreshWindow = function() {

		Meteor.setTimeout( function() { refreshWindow( "display.feature" ); }, 250 );
	}

	this.clear = function( _newControlName ) {

		this.setName( "" );

		this.ctl = null;

	},

	this.predraw = function() {

		this.dimensionNow( this.file, this.imageSrc);
		
	}

	this.dimensionNow = function(_file, _src) {

		var _name = this.getName();

        if (_name == "VIDEO"  && this.ctl.video.isYouTube ) {

			console.log("feature.drawNow is calling dimension(video)")
            
            this.dimension("video", null, null);
        }
        else {

            if (_name != "TEXT") {

                var myFrame = { width: 0, height: 0, top: 0, left: 0 };

				console.log("feature.drawNow is calling dimension(image type)")

                this.dimension("image", myFrame, _src);       

                $("img.featuredPic").css("left", myFrame.left);

                $("img.featuredPic").css("width",  myFrame.width);

                $("img.featuredPic").css("height",  myFrame.height);

                $("img.featuredPic").css("top",  myFrame.top);

            }
        }
	}

    this.dimension = function( _type, _obj, _src ) {

        var fullScreenWidth = $(window).width();

        var fullScreenHeight = $(window).height();

        var fullBackdropWidth = $("img.featuredBackdrop").width();

        var maxWidth = fullBackdropWidth * 0.9;

        var fullHeight = $("img.featuredBackdrop").height();

        var leftMargin = fullScreenWidth * 0.02;

        var _height = fullHeight * 0.935;

        var menuHeight = 50;

        var _width = 0;

        //Use the widescreen ratio for video, and the normal proportions for others

        if (_type == "video") {

            _width = _height * 16/9;

        }
        else {

            if (_src) _width = (fullHeight / _src.height ) * _src.width; 

        }

        //Clamp the width if necessary and determine the position on the screen

        if (_width > maxWidth) _width = maxWidth;

        var _top = fullScreenHeight * 0.09;

        var _left = leftMargin + (fullBackdropWidth/2) - (_width/2);

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




} //end feature constructor