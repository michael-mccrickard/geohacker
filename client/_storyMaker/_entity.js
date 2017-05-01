
Entity = function() {

	this.leftSpacer = 4;

	this.rightSpacer = 24;

	//css transform values (stored in the database; default values)

	this.scaleX = 0;  //the percentage size (relative to the window)

	this.scaleY = 0;

	this.translateX = 0;   //the percentage coordinate (relative to the window)

	this.translateY = 0;

	this.skewX = 0;

	this.skewY = 0;
	
	//this.top = 0;

	//this.left = 0;

	this.lastTransform = null;


	this._add = function( _obj ) {

		if (this.movable) {

			$(this.element).css("width", "");

			$(this.element).css("height", "");			
		}


		$(this.imageElement).attr("src", this.pic);

		$(this.imageElement).attr("data-shortname", this.shortName);	

		if (this.zIndex) $(this.element).css("z-index", this.zIndex);	

		if (_obj) {

			this.drawWithTransform( _obj );

		}
		else {
			
			this.draw( this.lastTransform );
		}

	},

	//convenience function for script; shorter name

	this.change = function( _obj ) {

		this.drawWithTransform(_obj);
	}

	this.drawWithTransform = function( _obj ) {

		_obj = this.fixPropertyNames( _obj );

		c(this.name + " _obj in drawWithTransform before integrate follows ")
		c(_obj)

		_obj = this.integrateTransformWithDBValues(_obj);

		this.draw( _obj );
	}

	this.integrateTransformWithDBValues = function( _obj) {

		var _mat = copyObject( this.lastTransform );

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		var _pixelHeight = this.lastTransform.scaleY * this.origSize.height;

		var _pixelWidth = this.lastTransform.scaleX * this.origSize.width;

		
		if (_obj.translateX) _mat.translateX = _obj.translateX;

		if (_obj.translateY) _mat.translateY = _obj.translateY;

		
		if (_obj.scaleX) {

			_mat.scaleX = this.fixScaleValueForCSS(_obj, "x");

			_pixelWidth = _mat.scaleX * this.origSize.width;
		}

		if  (_obj.scaleY) {
			
			_mat.scaleY = this.fixScaleValueForCSS(_obj, "y")

			_pixelHeight = _mat.scaleY * this.origSize.height;
		}

		if (_obj.translateX) _mat.translateX = this.fixTranslateValueForCSS( _mat, "x", _pixelWidth);

		if (_obj.translateY) _mat.translateY = this.fixTranslateValueForCSS( _mat, "y", _pixelHeight);


		c(this.name + " matrix in integrate follows")
		c(_mat)

		return _mat;

	}

	this.transformOnly = function( _obj ) {

		_obj = this.changeTransform( _obj );

		this.transform( _obj );
	}

	this.changeTransform = function( _obj ) {

		var _mat = this.lastTransform;		

		if ( _obj.translateX ) _mat.translateX = _obj.translateX;

		if ( _obj.translateY ) _mat.translateY = _obj.translateY;

		if ( _obj.scaleX ) _mat.scaleX = _obj.scaleX;

		if ( _obj.scaleY ) _mat.scaleY = _obj.scaleY;

		if ( _obj.skewX ) _mat.skewX = _obj.skewX;

		if ( _obj.skewY ) _mat.skewY = _obj.skewY;

		return _mat;
	}

	this.draw = function(_obj) {

		 c(this.name + " in entity.draw() -- obj follows" )
		 c(_obj)

 		if (!_obj) _obj = this.lastTransform;

		this.transform( _obj );

		if (this.entityType == "char") {

			var _fontSize = 0.03 * $(window).height();

			_fontSize = _fontSize / _obj.scaleY;

			//if the scale is tiny, then the font will be huge
			if (_fontSize > 32) _fontSize = 32;

			if (_fontSize < 18) _fontSize = 18;			

			$(this.nameElement).css("font-size", _fontSize + "px");
		}

	}

	this.transform = function( _obj ) {

		if (!_obj) _obj = this;

		var _str = "matrix(" + _obj.scaleX + ", " + _obj.skewY + ", " + _obj.skewX + ", " + _obj.scaleY + ", " + _obj.translateX + ", " + _obj.translateY + ")";

		c(this.name + " -- string in entity.transform() is " + _str)

		this.lastTransform = _obj;
                 
		$( this.element ).css("transform", _str);	
	}

	//create the initial transform matrix object from the default (DB) values

	this.createDefaultTransform = function() {

		var _obj = { scaleX: this.scaleX, scaleY: this.scaleY, translateX: this.translateX, translateY: this.translateY, skewX: this.skewX, skewY: this.skewY };

console.log( _obj );

		_obj.translateX = this.fixTranslateValueForCSS( _obj, "x" );

		_obj.translateY = this.fixTranslateValueForCSS( _obj, "y" ) ; 	

		_obj.scaleX = this.fixScaleValueForCSS( _obj, "x" );

		_obj.scaleY = this.fixScaleValueForCSS( _obj, "y" ) ; 

		_obj.skewX = this.skewX;

		_obj.skewY = this.skewY;

		c("obj in createDefaultTransform follows for " + this.name)

		c(_obj)

		return _obj;
	}

	this.fixPropertyNames = function( _obj ) {

		var _obj2 = copyObject( _obj );

		if (_obj2.left) _obj2.translateX = _obj2.left;

		if (_obj2.top) _obj2.translateY = _obj2.top;	
		
		return _obj2;	

	}

	this.getTransform = function() {

		return $( this.element ).css("transform");
	}

	this.getSize = function() {

		var _obj = {};

		_obj.width = this.lastTransform.scaleX * this.origSize.width;

		_obj.height = this.lastTransform.scaleY * this.origSize.height;

		return _obj;

	}

	//the values passed in are object-relative values; fix them to be screen-relative for storage in db

	this.fixScaleValueForDB = function( _obj, _axis) {

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		if (_axis == "x") return ( _obj.scaleX * this.origSize.width ) / _windowWidth;

		if (_axis == "y") return ( _obj.scaleY * this.origSize.height ) / _windowHeight;
	}

	//the incoming values use the object center as the anchor point, fix them to use the top-left corner of the object

	this.fixTranslateValueForDB = function( _obj, _axis) {

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		if (_axis == "x") return (_obj.translateX - (_windowWidth * this.fixScaleValueForDB(_obj, "x") - this.origSize.width ) / 2 ) / _windowWidth;

		if (_axis == "y") return (_obj.translateY - (_windowHeight * this.fixScaleValueForDB(_obj, "y") - this.origSize.height ) / 2) / _windowHeight;
	}

	//the values passed in are screen-relative values; fix them to object-relative for use with the CSS transform

	this.fixScaleValueForCSS = function( _obj, _axis ) {

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		if (_axis == "x") {

			var _pixelWidth = _obj.scaleX * _windowWidth;

			return _pixelWidth /  this.origSize.width;		
		}

		if (_axis == "y") {

			var _pixelHeight = _obj.scaleY * _windowHeight;

			return _pixelHeight /  this.origSize.height;		
		}
	} 

	//the values passed in use the top-left corner as the anchor point; fix them to use the object center

	this.fixTranslateValueForCSS = function( _obj, _axis, _elementSize) {

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		var _pixelHeight = _obj.scaleY * _windowHeight;

		var _pixelWidth = _obj.scaleX * _windowWidth;


		if (_axis == "y") {

			if (_elementSize) _pixelHeight = _elementSize;

		  	var _topVal = _obj.translateY * _windowHeight;

			var _yFactor =  (_pixelHeight - this.origSize.height) / 2;

			return _topVal + _yFactor;			
		}


		if (_axis == "x") {

			if (_elementSize) _pixelWidth = _elementSize;

		  	var _leftVal = _obj.translateX * _windowWidth;

			var _xFactor =  (_pixelWidth - this.origSize.width) / 2;

			return _leftVal + _xFactor;			
		}

	}


	this.fadeIn = function(_val) {

		//this.show();

		var _duration = 1000;

		if (_val) _duration = _val;

		if ( $(this.element).css("opacity") != 1 ) $( this.element ).velocity( "fadeIn", {duration: _val} );

	},

	this.fadeOut = function(_val) {

		if (this.movable) {

			$(this.element).velocity({ opacity: 0 }, { complete: function(elements) { 

				$(elements).css("width", "1px");

				$(elements).css("height", "1px");
			}});

			return;
		}
		
		var _duration = 500;

		if (_val) _duration = _val;

		$( this.element ).velocity( "fadeOut", {duration: _val} );
	},

	this.brightness = function(_val) {

		story.brightness(_val, this.imageElement);
	}

	this.restoreBrightness = function() {

		story.restoreBrightness( this.imageElement );
	} 

	this.moveToCorner = function(_dir) {

		this.recordPos();

		var _top = display.menuHeight + this.leftSpacer;  //leftSpacer is the smaller of the two spacer values

		var _left = this.leftSpacer;

		if (_dir == "ne") {

			_left = $(window).width() - (this.getSize().width) - this.rightSpacer;
		}


		this.tween = TweenLite.to( this.element, 1.5, { x: _left, y: _top } );

	},

	//The values expected in the argument are percent strings, _obj.left: "35%", e.g.

	//The args to TweenMax are in pixels, x: 426, e.g.

	//the entity properties .left and .top are in ratio form  this.left = 0.35, e.g.


	this.animate = function( _obj ) {

		var _time = 1.5;

		var _obj2 = {};

		if (_obj.translateX) _obj.left = _obj.translateX;

		if (_obj.translateY) _obj.top = _obj.translateY;		


		if (_obj.left) {

			_obj2.x = _obj.left * $(window).width();
		}

		if (_obj.top) {

			_obj2.y =  _obj.top * $(window).height();
		}

		if (_obj.scaleX) {

			_obj2.scaleX = this.fixScaleValueForCSS( _obj, "x" );
		}
		
		if (_obj.scaleY) {

			_obj2.scaleY = this.fixScaleValueForCSS( _obj, "y" );
		}

		if (_obj.rotation) _obj2.rotation = _obj.rotation;

		if (_obj.opacity) _obj2.opacity = _obj.opacity;


		if (_obj.time) _time = parseFloat( _obj.time );

		if (_obj.repeat) {

			_obj2.repeat = parseInt( _obj.repeat );		
		}

		if (_obj.repeatDelay) {

			_obj2.repeatDelay = parseInt( _obj.repeatDelay );		
		}

		if (!parseInt(_obj.yoyo) ) {

			_obj2.yoyo = false;				
		}
		else {

			_obj2.yoyo = true;
		}

		_obj2.onComplete = updateEntity;

		_obj2.onCompleteParams = [ this.shortName ] ;


		c("obj for animation in ent.animate follows")
		c(_obj2)

		this.tween = TweenMax.to( this.element, _time, _obj2 );
	},

	this.moveToPrev = function() {

		this.tween = TweenMax.to( this.element, 1.5, { x: this.prevX, y: this.prevY } );
	},

	this.q = function() {

		$( this.element ).tooltip('destroy');
	},

	this.recordPos = function() {

		var _obj = convertMatrixStringToObject( $(this.element).css("transform") );

		this.prevX = _obj.translateX;

		this.prevY = _obj.translateY;
	},

	this.say = function( _text) {

	  if (this.entityType == "char") display.playEffect( "say" + this.index + ".mp3")

      $( this.element  ).tooltip({ delay:0, trigger:"manual",  title: _text, placement: this.placement });

      $( this.element  ).tooltip('show'); 

	},

	this.sayLeft = function( _text ) {

		this.placement = "left";

		this.say( _text );
	},

	this.sayRight = function( _text ) {

		this.placement = "right";

		this.say( _text );
	},

	this.scaleMe = function( _amt )  {

		this.scale = _amt;

		this.transform();	
	},


	this.setDirection = function( _val ) {

		this.placement = _val;
	},

	this.show = function() {

		//$(this.element).removeClass("hidden");	

		$(this.element).css("display","initial");

		$(this.element).css("opacity",1);
	}

	this.zoomMe = function(_duration, _amtX, _amtY, _repeat, _repeatDelay, _yoyo ) {

		this.update();

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		if (!_duration) _duration = 1.5;

		var _obj = this.zoomOptions( _amtX, _amtY, _repeat, _repeatDelay);

		var _element = this.element;		

		var _obj1 = copyObject( _obj );


		var _pixelWidth = _obj.scaleX * _windowWidth;

		_obj1.scaleX = _pixelWidth / this.origSize.width;

		var _pixelHeight = _obj.scaleY * _windowHeight;

		_obj1.scaleY = _pixelHeight / this.origSize.height;


		var _currScaleY = this.lastTransform.scaleY;

		var _yFactor = _obj1.scaleY / _currScaleY;
		 

		var _currScaleX = this.lastTransform.scaleX;

		var _xFactor = _obj1.scaleX / _currScaleX;


		if (this.type == "owner")  {

			if (this.contentElement) this.zoomContent( _xFactor, _yFactor, _obj, _duration, this.contentElement);

			if (this.contentElementBG) this.zoomContent( _xFactor, _yFactor, _obj, _duration, this.contentElementBG);
		}

		_obj1.onComplete = updateEntity;

		_obj1.onCompleteParams = [ this.shortName ] ;

		TweenMax.to( _element, _duration, _obj1 );
	}

	this.zoomContent = function( _xFactor, _yFactor, _obj, _duration, _element) {
 
		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();


		var _obj2 = copyObject( _obj );

		var _name = $(_element).attr("data-shortname");

		var _ent = story[ _name ];

		var _origSize = _ent.origSize;

		
		_obj2.scaleX = _xFactor * _ent.lastTransform.scaleX;

		_obj2.scaleY = _yFactor * _ent.lastTransform.scaleY;


		var _pixelHeight = _obj2.scaleY * _origSize.height;

		var _yFactor2 = (_ent.lastTransform.scaleY * _origSize.height) - (_pixelHeight)

		_yFactor =  _yFactor - _yFactor2;

		_obj2.y = "+=" + _yFactor2/4;

		 TweenMax.to( _element, _duration, _obj2 );
	}

	this.zoomOptions = function(_amtX, _amtY, _repeat, _repeatDelay, _yoyo ) {

		var _obj = { scaleX: 2, scaleY: 2, repeat: 0, repeatDelay: 0, yoyo: false };

		if (_amtX) _obj.scaleX = _amtX;

		if (_amtY) _obj.scaleY = _amtY;

		if (_repeat) _obj.repeat = _repeat;

		if (_repeatDelay) _obj.repeatDelay = _repeatDelay;

		//we assume that repetitions means yoyo = true	

		if (_repeat) _obj.yoyo = true;	

		//but this can be over-ridden

		if (_yoyo) _obj.yoyo = _yoyo;

		return _obj;
	}


	this.update = function() {

		var _element = this.element;

		var _obj = convertMatrixStringToObject( $( _element ).css("transform") );	
	
		this.lastTransform = _obj;

	}

}


updateEntity = function( _shortName ) {

	story[ _shortName].update();
}