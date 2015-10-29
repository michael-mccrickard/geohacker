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

		if (hack.mode == mBrowse) {

			display.redraw();

			display.ctl[ this.getName() ].setControlPicSource();

			display.ctl[ this.getName() ].setPicDimensions();

			return;
		}

		Meteor.defer( function() { Session.set("sFeatureImageLoaded", true); } );
	}

	//this one can fire before the _name control has been
	//set as the feature, so this.ctl will not refer
	//to the _name control necessarily

	this.load = function( _name ) {

c("_name in feature load =" + _name)
		
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

	this.loadAgain = function( _name) {

		if ( _name == "VIDEO") {

c("display loadAgain returning b/c file is YT")
			
			if ( this.ctl.isYouTube )  return;
		}

		this.file = this.getFile( _name);

		if (this.file) this.imageSrc = Control.getImageFromFile( this.file );
	}

	this.getFile = function( _name ) {

		var _file = null;

		var _index = display.ctl[ _name ].getIndex();

		if ( _name == "MAP") return _file;

		//set the source property for the credit line in closeup view

		this.source = display.ctl[ _name ].items[ _index ].s;

		if (_name == "TEXT") return _file;

		if ( _name == "SOUND" || _name == "VIDEO") {
			
			_file = display.ctl[ _name ].getFeaturedPic();
		}
		else {

			_file = display.ctl[ _name ].items[ _index ].f;
		}

		return _file;
	}	

	this.getName = function() {

		return this.name.get();
	},

	this.resetToPrevious = function() {

		if (this.lastName == "VIDEO") display.ctl["VIDEO"].setState( sPlaying );

		this.set( this.lastName );	
	},

	this.setName = function( _val ) {

		this.name.set( _val );
	},

	this.setBackground = function( _state) {

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

		//if we're switching to a different control then clear the current one

		//we're clearing the current ctl, but we pass the name	

		//of the new one, so that the media controls know what to do

		if (this.getName() != _name) this.clear( _name );

		this.setName( _name );

		c("feature is now set to " + _name);

		if (_name.length == 0) return;

		this.ctl = display.ctl[ _name ];

		if (_name == "MAP") {

			//the big arrow will be blinking if the map is being "auto-featured" (as a clue)

			display.stopBlinking();   

			display.ctl["MAP"].draw();

			return;
		}

		if (_name == "VIDEO" || _name == "SOUND") {
	
			var _state = this.ctl.getState();

			if (_state == sPaused) {

c("feature.set is pausing content b/c state is paused")
				
				this.ctl.pauseFeaturedContent();
			}
			if (_state == sPlaying || _state == sLoaded) {
				
c("feature.set is calling playFeaturedContent")
				
				this.ctl.playFeaturedContent();
			}
			//nothing more to do for a YT video

			if ( _name == "VIDEO" && this.ctl.isYouTube ) return;
		}

		this.draw();
	}

	this.refreshWindow = function() {

		Meteor.setTimeout( function() { refreshWindow( "display.feature" ); }, 250 );
	}

	this.clear = function( _newControlName ) {

		if (this.getName().length) this.lastName = this.getName();

		this.setName( "" );

		if (this.ctl != null) this.ctl.clearFeature( _newControlName );

		this.ctl = null;

	},

	this.reset = function() {

		this.lastName = this.getName();

        this.setName( "" );
	}

	this.draw = function() {

		var _name = this.getName();

		Meteor.defer( function(){ display.feature.drawNow( display.feature.file, display.feature.imageSrc); });
		
	}

	this.drawBG = function() {

		Meteor.defer( function(){ display.feature.drawNow( display.feature.bgFile, display.feature.bgImageSrc); });
	}


	this.drawNow = function(_file, _src) {

		var _name = this.getName();

        if (_name == "VIDEO"  && this.ctl.isYouTube ) {

            this.dimension("video", null);
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
	}

    this.dimension = function( _type, _obj, _src ) {

        var fullScreenWidth = $(window).width();

        var fullScreenHeight = $(window).height();

        var fullBackdropWidth = $("img.featuredBackdrop").width();

        var maxWidth = fullBackdropWidth * 0.9;

        var fullHeight = $("img.featuredBackdrop").height();

        var leftMargin = fullScreenWidth * 0.02;

        var _height = fullHeight * 0.935;

$("div.scanBG").css("left", leftMargin + ( fullBackdropWidth * 0.98 ) / 2 - $(".imgScanBG").width() / 2 + "px" );

$("div.scanBG").css("top", 50 + (fullHeight / 2) - $(".imgScanBG").width() / 2 + "px" );

$("div.divScanCornerTopLeft").css("left", leftMargin +"px" );

$("div.divScanCornerTopRight").css("left",  ( leftMargin + fullBackdropWidth  - $("div.divScanCornerTopRight").width() + "px" ) );

$("div.divScanCornerBottomRight").css("top",  ( $("img.featuredBackdrop").position().top  + (fullHeight * 1.005) - $("div.divScanCornerBottomRight").height() + "px" ) );

$("div.divScanCornerBottomRight").css("left",  ( leftMargin + fullBackdropWidth  - $("div.divScanCornerBottomRight").width() + "px" ) );

$("div.divScanCornerBottomLeft").css("top",  ( $("img.featuredBackdrop").position().top + (fullHeight * 0.995) - $("div.divScanCornerBottomLeft").height() + "px" ) );

$("div.divScanCornerBottomLeft").css("left",  ( leftMargin + 4 + "px" ) );

        var _width = 0;

        //Use the widescreen ratio for video, and the normal proportions for others

        if (_type == "video") {

            _width = _height * 16/9;

        }
        else {

            _width = (fullHeight / _src.height ) * _src.width; 

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