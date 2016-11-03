/*
******************************************************************

              MEMES
  Memes are used to display info to the user in the country browser.
  The types are:

  modal -- An image, with optional text and sound file, displayed in a modal window.  Any meme with this type is 
  temporarily assigned to display.meme when displayed.

  video -- A youtube video to be shown on the browser screen

  classic -- still image with text, with an optional sound file.  These can also be temporarily assigned to
  display.meme, if we need to show them in a modal window.

******************************************************************
*/

// Constructor with four optional arguments; soundFile is added to the
// object after creation, if desired, by the calling function

Meme = function(_type, _name, _src, _videoID) {
	
  if (!_type) {

    _type = "unknown";
  }

  this.type = _type;

  this.name = "";

  this.src = "";

  if (_name) this.name = _name;

  if (_src) this.src = _src;

  if (_videoID) this.videoID = _videoID;


  this.imageSrc = null;

  this.frame = {width: 0, height: 0, top: 0, left: 0 }

  this.soundFile = "";


	this.preloadImage = function() {
c("preload")
		var _file = this.src;

		//borrow the feature preload element

		$("#pFEATURE3").attr("src", _file);

        imagesLoaded( document.querySelector('#pFEATURE3'), function( instance ) {
  
c("imageloaded")
          //now that the image is loaded ...

          display.meme.imageSrc = display.getImageFromFile( display.meme.src );

          Meteor.setTimeout( function() { display.meme.dimensionImage( display.meme.frame ); }, 500);

          if (display.meme.type == "modal") Meteor.setTimeout( function() { display.meme.showModal(); }, 501);     

          

        });
	}

  this.dimensionImage = function( _obj ) {
c("dimensionImage")
    if (this.type == "modal") {

      this.dimensionModal( _obj );
    }

  }


	this.dimensionModal = function( _obj ) {
c("dimensionModal")
		//assuming the zoomInModal for now

        var fullScreenWidth = $(window).width();

        var fullScreenHeight = $(window).height();

        var fullBackdropWidth = fullScreenWidth * 0.7;

        var maxWidth = fullScreenWidth * 0.9;

        var fullHeight = fullScreenHeight * 0.8;

        var leftMargin = fullScreenWidth * 0.02;

        var menuHeight = 50;

        var _width = 0;

        var _height = fullHeight;

    		var _src = display.meme.imageSrc;

    		_width = (fullHeight / _src.height ) * _src.width; 


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
	}

	this.showModal = function() {
c("showModal")
		$(".imgZoomInModal").attr("src", display.meme.src);

		$(".imgZoomInModal").css("width", display.meme.frame.width);

		$(".imgZoomInModal").css("height", display.meme.frame.height);

		$(".imgZoomInModal").css("left", display.meme.frame.left);		

    $('#zoomInModal').modal('show');
	}

}