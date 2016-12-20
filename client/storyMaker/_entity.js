Entity = function() {
	
	this._add = function() {

		$(this.imageElement).attr("src", this.pic);

		//see note in init above about width and left

		if (this.width) $(this.imageElement).css("width", this.width);

		if (this.left) $(this.element).css("left", this.left);

		$(this.element).css("top", this.top);	

		$(this.element).css("z-index", this.zIndex);		


	},

	this.fadeIn = function() {

		$( this.element ).velocity( "fadeIn", {duration: 1000} );
	},

	this.fadeOut = function() {

		$( this.element ).velocity( "fadeOut", {duration: 1000} );
	},

	this.moveToCorner = function(_dir) {

		this.recordPos();

		var _top = display.menuHeight + this.spacer;

		var _left = this.spacer;

		if (_dir == "ne") _left = $(window).width() - this.size - this.spacer;

		$(this.element).css( {top: _top, left: _left } );
	},

	this.moveToStart = function() {

		$(this.element).css( {top: this.prevTop, left: this.prevLeft } );
	},

	this.recordPos = function() {

		this.prevTop = $(this.element).offset().top;

		this.prevLeft = $(this.element).offset().left;
	},


	this.zoomMe =function( _amt ) {

		TweenMax.to( this.element, 1.5, { scale: _amt } );

	},

	this.scaleMe = function( _amt )  {

		TweenMax.to( this.element, 0.0, { scale: _amt } );		
	},

	this.q = function() {

		$( this.element ).tooltip('destroy');
	},

	this.sayLeft = function( _text ) {

		this.placement = "left";

		this.say( _text );
	},

	this.sayRight = function( _text ) {

		this.placement = "right";

		this.say( _text );
	},

	this.say = function( _text) {

      $( this.element  ).tooltip({ delay:0, trigger:"manual",  title: _text, placement: this.placement });

      $( this.element  ).tooltip('show'); 

	},

	this.setDirection = function( _val ) {

		this.placement = _val;
	}
}
