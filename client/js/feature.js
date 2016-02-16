Feature = function() {
	
	this.name = new Blaze.ReactiveVar("");

	this.displayMessage = new Blaze.ReactiveVar( false );

	this.lastName = "";  //name of the last featured control

	this.ctl = null;

	this.bgImageSrc = null;

	this.bgFile = null;

	this.iconPic = "geohacker_background.png";    

    this.scanningPic = "spinning_globe2.gif";

	this.imageSrc = null;

    this.file = null;

    this.source = null;

    this.video = null;

	this.on = function() {

		if (this.name.get().length > 0) return true;
	
		return false;
	},

	this.off = function() {

		if (this.name.get().length > 0) return false;

		return true;
	},

	this.fileIsLoaded = function() {

		if (game.user.mode == uBrowse) {

			display.redraw();

			display.ctl[ this.getName() ].setControlPicSource();

			display.ctl[ this.getName() ].setPicDimensions();

			return;
		}

		//if the scanner is still running, it's possible that it is still waiting on the image to load

		if ( display.scanner.centerState == "scan" || display.scanner.centerState == "rescan") {

			if (display.scanner.checkScan("feature") == true) {display.scanner.stopScan();}
		}

		Meteor.defer( function() { Session.set("sFeatureImageLoaded", true); } );
		
	}

	this.browseMap = function() {

		this.clear();

		this.setName( "BROWSEMAP" );

	    display.worldMapTemplateReady = false;

	    if (hack.countryCode.length) display.ctl["MAP"].browseWorldMap.selectedCountry.set( hack.countryCode );

	    FlowRouter.go("/browseWorldMap");
	}

	//this one can fire before the _name control has been
	//set as the feature, so this.ctl will not refer
	//to the _name control necessarily

	this.load = function( _name ) {

		console.log("_name in feature load =" + _name)
		
		this.file = this.getFile( _name);

		if ( _name == "VIDEO") {

			if (display.ctl["VIDEO"].isYouTube ) {

          		this.fileIsLoaded();

				return;
			}
		}

		if (this.file == null) {

			//a non-still-image type, so just set the session var

          	this.fileIsLoaded(); 

			return;
		}

		$("#pFEATURE3").attr("src", this.file);

        imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {
    
          //now that the image is loaded ...

          display.feature.imageSrc = Control.getImageFromFile( display.feature.file );

          display.feature.fileIsLoaded();

        });
	}

	this.setImage = function(_name) {

		this.setImageSource( _name );

		this.draw();

	}

	this.setImageSource = function( _name) {

		if ( _name == "VIDEO") {

			if ( this.ctl.isYouTube )  {

				console.log("feature.setImageSource returning b/c file is YT")

				return;
			}

			console.log("feature.setImageSource setting file and imageSrc for animated gif")
		}

	
		this.file = this.getFile( _name);

		if (this.file) this.imageSrc = Control.getImageFromFile( this.file );
	}

	this.dim = function( _time ) {

		if ( $(".featuredPic").css("opacity") == "1" ) $(".featuredPic" ).velocity( { opacity: 0.3, duration: _time });
	}

	this.getFile = function( _name ) {

		var _file = null;

		var _index = display.ctl[ _name ].getIndex();

		if ( _name == "MAP") return null;

		//set the source property for the credit line in closeup view

		if (display.ctl[ _name ].items[ _index ]) {

			this.source = display.ctl[ _name ].items[ _index ].s;
		}

	
		if (_name == "TEXT") return null;

		if ( _name == "SOUND") {

			 _file = display.ctl[ _name ].getFeaturedPic();
		}
		else {

			_file = display.ctl[ _name ].getFile();
		}

		return _file;
	}	

	this.getName = function() {

		return this.name.get();
	},

	this.resetToPrevious = function() {

		if (game.user.mode == uBrowse) {

			this.setName( "" );

			if (this.lastName.length == 0 || this.lastName == "BROWSEMAP" ) {

				this.set( "IMAGE" );
			}
			else {

				this.set( this.lastName );
			}

			return;
		}


		if (display.scanner.centerState.get() != "loaded") { 
		
			this.setName( this.lastName );
		}
		else {

			display.scanner.show();
		}
	},

	this.setName = function( _val ) {

		this.name.set( _val );
	},

//this function can probably go bye bye

	this.setBackground = function( _state) {

if ( this.off() ) return;

		var pic = null;

		if (_state == sScanning) {

			pic = this.scanningPic;

		}
		else {
			pic = this.iconPic;
		}

		this.bgImageSrc = Control.getImageFromFile( pic );

		this.bgFile = pic;
	},

	this.set = function( _name ) {

		c("feature.js: set() with " + _name)

		$(".featuredPic").css("opacity", "1.0");

		if (_name != "MAP") {

			display.scanner.centerState.set("off");
		}

		//this will suspend any sound file that is playing, which may not be what we want to do
		//Better to only suspend for video?

		display.suspendMedia();

		this.setName( _name );

		console.log("feature is now set to " + _name);

		if (_name.length == 0) return;

		this.ctl = display.ctl[ _name ];

		if (_name == "MAP") {

			//the big arrow will be blinking if the map is being "auto-featured" (as a clue)

			display.stopBlinking();   

			display.ctl["MAP"].draw();

			return;
		}

		if (_name == "SOUND") {

			game.pauseMusic();

			console.log("feature.set is calling sound.play()")

			this.ctl.play();
		}

		if (_name == "VIDEO") {

			game.pauseMusic();
	
			this.setImageSource( _name );  //redundant except if we're returning here from another user mode

			console.log("feature.set is calling video.play()")
				
			this.ctl.play();


		}

		this.draw();

	}

	this.refreshWindow = function() {

		Meteor.setTimeout( function() { refreshWindow( "display.feature" ); }, 250 );
	}

	this.clear = function( _newControlName ) {

		if (this.getName().length) this.lastName = this.getName();

		this.setName( "" );

		if (this.lastName == "MAP") this.ctl.clearFeature( _newControlName );

		this.ctl = null;

	},

	this.reset = function() {

		this.lastName = this.getName();

        this.setName( "" );
	}

	this.draw = function() {

		Meteor.defer( function(){ display.feature.drawNow( display.feature.file, display.feature.imageSrc); });
		
	}

/*
	this.drawBG = function() {

		Meteor.defer( function(){ display.feature.drawNow( display.feature.bgFile, display.feature.bgImageSrc); });
	}
*/

	this.drawNow = function(_file, _src) {

		var _name = this.getName();

        if (_name == "VIDEO"  && this.ctl.isYouTube ) {

			console.log("feature.drawNow is calling dimension(video)")
            
            this.dimension("video", null, null);
        }
        else {

            if (_name != "TEXT") {

                var myFrame = { width: 0, height: 0, top: 0, left: 0 };

                this.dimension("image", myFrame, _src);       

                $("img.featuredPic").css("left", myFrame.left);

                $("img.featuredPic").css("width",  myFrame.width);

                $("img.featuredPic").css("height",  myFrame.height);

                $("img.featuredPic").css("top",  myFrame.top);

                $("img.featuredPic").attr("src", _file );

            }
        }

		$("img.featuredPic").removeClass("hidden");
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