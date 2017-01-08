Entity = function() {

	this.leftSpacer = 4;

	this.rightSpacer = 24;
	
	this._add = function() {

		$(this.imageElement).attr("src", this.pic);

		//see note in init (in char and token obj cconstructors) about width and left

		if (this.width) $(this.imageElement).css("width", this.width);

		if (this.left) $(this.element).css("left", this.left);

		if (this.top) $(this.element).css("top", this.top);	

		if (this.zIndex) $(this.element).css("z-index", this.zIndex);	

		$(this.element).attr("data-shortname", this.shortName);

	/*	$(this.element).css("opacity", 0);  */  //do this when we reset the scene instead?

		this.show();  //remove "hidden" class	


	},

	this.hide = function() {

		$(this.element).addClass("hidden");		
	}

	this.fadeIn = function(_val) {

		this.show();

		var _duration = 1000;

		if (_val) _durantion = _val;

		if ( $(this.element).css("opacity") == 0 ) $( this.element ).velocity( "fadeIn", {_duration: 1000} );
	},

	this.fadeOut = function() {

		$( this.element ).velocity( "fadeOut", {duration: 1000} );
	},

	this.coordinatesToOffsets = function( _obj ) {

		var currX = $( this.element ).offset().left;

		var currY = $( this.element ).offset().top;
		
		_obj.x = _obj.x - currX;

		_obj.y = _obj.y - currY;

	}

	this.percentStringToNumber = function( _str ) {

		_str = _str.substr(0, _str.length - 1);

		var _val = parseFloat( _str ) / 100;

		return _val;
	}

	this.moveToCorner = function(_dir) {

		this.recordPos();

		var _top = display.menuHeight + this.leftSpacer;  //leftSpacer is the smaller of the two spacer values

		var _left = this.leftSpacer;

		if (_dir == "ne") {

			_left = $(window).width() - this.size - this.rightSpacer;
		}


		var _obj = { x: _left, y: _top };

		this.coordinatesToOffsets( _obj );

		this.tween = TweenLite.to( this.element, 1.5, { x: _obj.x, y: _obj.y } );
	},

	this.moveToStart = function() {

		this.tween = TweenLite.to( this.element, 1.5, { x: 0, y: 0 } );
	},

	this.q = function() {

		$( this.element ).tooltip('destroy');
	},

	this.recordPos = function() {

		this.prevTop = $(this.element).offset().top;

		this.prevLeft = $(this.element).offset().left;
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

		TweenMax.to( this.element, 0.0, { scale: _amt } );		
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

}
