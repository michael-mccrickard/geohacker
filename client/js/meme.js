Meme = function(_name, _src) {
	
	this.soundFile = "";

	if (_name) this.name = _name;

	if (_src) this.src = _src;

	this.imageSrc = null;

    this.frame = {width: 0, height: 0, top: 0, left: 0 }

	this.preloadImage = function( _file ) {

		this.src = _file;

		//borrow the feature preload element

		$("#pFEATURE3").attr("src", _file);

        imagesLoaded( document.querySelector('#preloadFeature'), function( instance ) {
    
          //now that the image is loaded ...

          display.meme.imageSrc = Control.getImageFromFile( display.meme.src );


          Meteor.setTimeout( function() { display.meme.dimensionImage( display.meme.frame ); }, 500);

          Meteor.setTimeout( function() { display.meme.showModal(); }, 501);         

        });
	}

	this.dimensionImage = function( _obj ) {

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

		$(".imgZoomInModal").attr("src", display.meme.src);

		$(".imgZoomInModal").css("width", this.frame.width);

		$(".imgZoomInModal").css("height", this.frame.height);

		$(".imgZoomInModal").css("left", this.frame.left);		
	}

}