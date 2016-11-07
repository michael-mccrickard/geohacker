/*
******************************************************************

              UNIT
  Units are used to display info to the user in the country browser.
  The types are:

  modal -- An image, with optional text and sound file, displayed in a modal window.  Any meme with this type is 
  temporarily assigned to display.unit when displayed.

  video -- A youtube video to be shown on the browser screen

  classic -- still image with text, with an optional sound file.  These can also be temporarily assigned to
  display.unit, if we need to show them in a modal window.

******************************************************************
*/

// Constructor with four optional arguments; soundFile is added to the
// object after creation, if desired, by the calling function

Unit = function(_type, _name, _src, _videoID) {
	
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

		var _file = this.src;

		//borrow the feature preload element

		$("#pFEATURE3").attr("src", _file);

        imagesLoaded( document.querySelector('#pFEATURE3'), function( instance ) {

          //now that the image is loaded ...

          display.unit.imageSrc = display.getImageFromFile( display.unit.src );

          Meteor.setTimeout( function() { display.unit.dimensionImage( display.unit.frame ); }, 500);

          if (display.unit.type == "modal") Meteor.setTimeout( function() { display.unit.showModal(); }, 501);     

          

        });
	}

  this.dimensionImage = function( _obj ) {

    if (this.type == "modal") {

      this.dimensionModal( _obj );
    }

  }


	this.dimensionModal = function( _obj ) {

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

    		var _src = display.unit.imageSrc;

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

		$(".imgZoomInModal").attr("src", display.unit.src);

		$(".imgZoomInModal").css("width", display.unit.frame.width);

		$(".imgZoomInModal").css("height", display.unit.frame.height);

		$(".imgZoomInModal").css("left", display.unit.frame.left);		

    $('#zoomInModal').modal('show');
	}

}