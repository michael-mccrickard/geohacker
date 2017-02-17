gTempEntity = null;

Entity = function() {

	this.leftSpacer = 4;

	this.rightSpacer = 24;

	//css transform values

	this.scaleX = 1.0;

	this.scaleY = 1.0;

	this.x = 0;

	this.y = 0;

	this.skewX = 0;

	this.skeyY = 0;
	
	this.top = "0";

	this.left = "0";

	this._add = function( _obj ) {

		$(this.imageElement).attr("src", this.pic);

		$(this.imageElement).attr("data-shortname", this.shortName);	

		if (this.zIndex) $(this.element).css("z-index", this.zIndex);	

		$(this.element).attr("data-shortname", this.shortName);

		if (_obj) this.change( _obj );

		this.draw();

	},

	this.change = function( _obj ) {

		if ( _obj ) {

			if ( _obj.left ) this.left = percentStringToNumber( _obj.left );

			if ( _obj.top ) this.top = percentStringToNumber( _obj.top );

			if ( _obj.scaleX ) this.scaleX = _obj.scaleX;

			if ( _obj.scaleY ) this.scaleY = _obj.scaleY;
		}

		this.draw();
	}

	this.draw = function( _obj ) {

		if (!_obj) {

			_obj = {};

			_obj.x = this.x = convertPercentToPixels( { x: this.left } );

			_obj.y = this.y = convertPercentToPixels( { y: this.top } );

			_obj.scaleX = this.scaleX;

			_obj.scaleY = this.scaleY;
		}

		this.transform( _obj );
	}


	this.transform = function( _obj ) {

		if (!_obj) _obj = this;

		var _str = "matrix(" + _obj.scaleX + ", 0, 0, " + _obj.scaleY + ", " + _obj.x + ", " + _obj.y + ")";

		if (this.ownerEntity) {

			if ( this.type == "content") $( this.ownerEntity.contentElement ).css("transform", _str);

			if ( this.type == "contentBG") {

				$( this.ownerEntity.contentElementBG ).css("transform", _str);
			}
			return;
		}

		$( this.element ).css("transform", _str);	

	}

	this.getTransform = function() {

		return $( this.element ).css("transform");
	}

	this.hide = function() {

		$(this.element).addClass("hidden");		
	}

	this.fadeIn = function(_val) {

		this.show();

		var _duration = 1000;

		if (_val) _duration = _val;

		if ( $(this.element).css("opacity") == 0 ) $( this.element ).velocity( "fadeIn", {_duration: 1000} );

	},

	this.fadeOut = function() {
		
		$( this.element ).velocity( "fadeOut", {duration: 1000} );
	},

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

	this.moveTo = function( _obj ) {

		this.update();

		if (!_obj.left) {

			_obj.left = this.left;
		}
		else {

			_obj.left = percentStringToNumber( _obj.left);
		}

		if (!_obj.top) {

			_obj.top = this.top;
		}
		else {

			_obj.top = percentStringToNumber( _obj.top);
		}

		_obj.x = convertPercentToPixels( { x: _obj.left } );

		_obj.y = convertPercentToPixels( { y: _obj.top } );

		this.tween = TweenLite.to( this.element, 1.5, { x: _obj.x, y: _obj.y } );
	},

	this.moveToPrev = function() {

		this.tween = TweenLite.to( this.element, 1.5, { x: this.prevX, y: this.prevY } );
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

	this.zoomMe =function( _amt ) {

		TweenMax.to( this.element, 1.5, { scale: _amt } );

	}

	this.update = function() {

		var _obj = convertMatrixStringToObject( $( this.element ).css("transform") );	

		this.scaleX = _obj.scaleX;

		this.scaleY = _obj.scaleY;

		this.x = _obj.translateX;

		this.y = _obj.translateY;

		this.skewX = _obj.skewX;

		this.skewY = _obj.skewY;		

	}

}
