
Entity = function() {

	this.leftSpacer = 4;

	this.rightSpacer = 24;

	//css transform values

	this.imageScaleX = 0;

	this.imageScaleY = 0;

	this.screenScaleX = 0;

	this.screenScaleY = 0;

	this.x = 0;

	this.y = 0;

	this.skewX = 0;

	this.skeyY = 0;
	
	this.top = "0";

	this.left = "0";

	this.lastTransform = null;


	this._add = function( _obj ) {

		$(this.imageElement).attr("src", this.pic);

		$(this.imageElement).attr("data-shortname", this.shortName);	

		if (this.zIndex) $(this.element).css("z-index", this.zIndex);	

		$(this.element).attr("data-shortname", this.shortName);

		if (_obj) {

			this.change( _obj );
		}
		else {
			
			this.draw();
		}

	},

	this.change = function( _obj ) {

		if ( _obj ) {

			if ( _obj.left ) this.left = _obj.left;

			if ( _obj.top ) this.top = _obj.top;

			if ( _obj.translateX ) this.left = _obj.translateX;

			if ( _obj.translateY ) this.top = _obj.translateY;

			if ( _obj.screenScaleX ) this.screenScaleX = _obj.screenScaleX;

			if ( _obj.screenScaleY ) this.screenScaleY = _obj.screenScaleY;

		}

		this.draw();
	}

	this.draw = function(_obj) {

		var _windowWidth = $(window).width();

		var _windowHeight = $(window).height();

		if (!_obj) _obj = {};

		var _pixelWidth = this.screenScaleX * _windowWidth;

		if (!this.ownerEntity) {

			_obj.imageScaleX = _pixelWidth /  this.origSize.width;
	  
	  		var _pixelHeight = this.screenScaleY * _windowHeight;

			_obj.imageScaleY = _pixelHeight / this.origSize.height;
		
	  		_obj.y = this.top * _windowHeight;

			_obj.x = this.left * _windowWidth;	
		}
		else {

			var _ownerElement = this.ownerEntity.element;

			_pixelWidth = this.screenScaleX * this.ownerEntity.screenScaleX * _windowWidth;

			_obj.imageScaleX = _pixelWidth /  this.origSize.width;
	  
	  		_pixelHeight = this.screenScaleY * this.ownerEntity.screenScaleY * _windowHeight;

			_obj.imageScaleY = _pixelHeight / this.origSize.height;


	  		_obj.y = this.top * this.ownerEntity.screenScaleY * _windowHeight;

			_obj.x = this.left * this.ownerEntity.screenScaleX * _windowWidth;


		}
	  
		this.imageScaleX = _obj.imageScaleX;

		this.imageScaleY = _obj.imageScaleY;

		this.x = _obj.x;

		this.y = _obj.y;

		this.transform( _obj );

	}



	this.transform = function( _obj ) {

		if (!_obj) _obj = this;

//c( this.name + " scale values in transform() -- " + _obj.scaleX + ", " + _obj.scaleY)		

		var _str = "matrix(" + _obj.imageScaleX + ", 0, 0, " + _obj.imageScaleY + ", " + _obj.x + ", " + _obj.y + ")";

		this.lastTransform = convertMatrixStringToObject( _str );

		if (this.ownerEntity) {

			if ( this.type == "content") $( this.ownerEntity.contentElement ).css("transform", _str);

			if ( this.type == "contentBG") $( this.ownerEntity.contentElementBG ).css("transform", _str);

			if ( this.type == "contentAnim") $( this.ownerEntity.contentElementAnim ).css("transform", _str);

			return;
		}

		$( this.element ).css("transform", _str);	
	}

	this.getTransform = function() {

		return $( this.element ).css("transform");
	}

	this.getTransformValue = function( _which ) {

		var _obj = convertMatrixStringToObject( $(this.element).css("transform") );

		return _obj[ _which ];
	}

	this.hide = function() {

		$(this.element).addClass("hidden");		
	}

	this.fadeIn = function(_val) {

		this.show();

		var _duration = 1000;

		if (_val) _duration = _val;

		if ( $(this.element).css("opacity") != 1 ) $( this.element ).velocity( "fadeIn", {_duration: 1000} );

	},

	this.fadeOut = function() {
		
		$( this.element ).velocity( "fadeOut", {duration: 1000} );
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

			_left = $(window).width() - this.size - this.rightSpacer;
		}


		var _obj = { x: _left, y: _top };

		this.tween = TweenLite.to( this.element, 1.5, { x: _obj.x, y: _obj.y } );

	},

	//The values expected in the argument are percent strings, _obj.left: "35%", e.g.

	//The args to TweenMax are in pixels, x: 426, e.g.

	//the entity properties .left and .top are in ratio form  this.left = 0.35, e.g.


	this.animate = function( _obj ) {

		this.update();

		var _time = 1.5;

		var _obj2 = {};

		if (_obj.translateX) _obj.left = _obj.translateX;

		if (_obj.translateY) _obj.top = _obj.translateY;		


		if (_obj.left) {

			//_obj2.x = percentStringToNumber( _obj.left );

			_obj2.x = _obj.left * $(window).width();
		}

		if (_obj.top) {

			//_obj2.y = percentStringToNumber( _obj.top );

			_obj2.y =  _obj.top * $(window).height();
		}

		if (_obj.scaleX) {

			_obj2.scaleX = parseFloat( _obj.scaleX );
		}
		
		if (_obj.scaleY) {

			_obj2.scaleY = parseFloat( _obj.scaleY );
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

	  if (this.entityType == "char") display.playEffect2( "say" + this.index + ".mp3")

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

		$(this.element).removeClass("hidden");		
	}

	this.zoomMe = function(_duration, _amtX, _amtY, _repeat, _repeatDelay, _yoyo ) {

		if (!_duration) _duration = 1.5;

		var _obj = this.zoomOptions( _amtX, _amtY, _repeat, _repeatDelay);

		TweenMax.to( this.element, _duration, _obj );
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

		if (this.ownerEntity) {

			_element = this.getChildElement( this.type );
		}

		var _obj = convertMatrixStringToObject( $( _element ).css("transform") );	

		this.imageScaleX = _obj.scaleX;

		this.imageScaleY = _obj.scaleY;

		this.x = _obj.translateX;

		this.y = _obj.translateY;

		//new version of convertPixelsToPercent detects object generation (parent or child)

		this.left = convertPixelsToPercent( { x: this.x, ent: this } );

		this.top = convertPixelsToPercent( { y: this.y, ent: this } );


		this.skewX = _obj.skewX;

		this.skewY = _obj.skewY;		

	}

	this.getChildElement = function( _type ) {

		if (_type == "content") return this.ownerEntity.contentElement;

		if (_type == "contentBG") return this.ownerEntity.contentElementBG;

		if (_type == "contentAnim") return this.ownerEntity.contentElementAnim;		
	}


}


/*


	this.draw2 = function( _obj ) {

		if (!_obj) {

			_obj = {};

			_obj.x = this.x = parseFloat( this.left ) * $(window).width();

			_obj.y = this.y = parseFloat( this.top ) * $(window).height();

			_obj.scaleX = this.scaleX * $(window).width() / this.origSize.width;

			_obj.scaleY = this.scaleY * $(window).height() / this.origSize.height; 	

//c( this.name + " scale values in draw() after -- " + _obj.scaleX + ", " + _obj.scaleY)				
			//}
		}	

		this.transform( _obj );	
	}
*/
