//token.js

Token = {

	init : function( _obj  ) {

		this.name = _obj.name;

		this.type = _obj.type;

		this.pic = _obj.pic;	

		this.width = _obj.width;

		this.top = _obj.top;

		this.left = _obj.left;

		this.index = _obj.index;

		this.type = _obj.type;

		if ( _obj.content ) this.content = _obj.content;

		this.zIndex = 1100;

		this.overlayZIndex = 1101;

		if (this.type == "overlay") this.zIndex = this.overlayZIndex;


		this.element = "div#storyThing" + this.index + ".divStoryThing";

		this.imageElement = "img#storyThingPic" + this.index + ".storyThing";

		this.contentElement = "img#storyThingContent" + this.index + ".storyThingContent";		

	},

	add : function() {

		$(this.imageElement).attr("src", this.pic);

		$(this.imageElement).css("width", this.width);

		$(this.element).css("left", this.left);

		$(this.element).css("top", this.top);	

		$(this.element).css("z-index", this.zIndex);				
	},

	addContent : function( _name ) {

		var _obj = this.content[ _name ];

		$(this.contentElement).attr("src", _obj.pic);

		$(this.contentElement).css("width", _obj.width);

		$(this.contentElement).css("height", _obj.height);

		$(this.contentElement).css("left", _obj.left);

		$(this.contentElement).css("top", _obj.top);	

		$(this.contentElement).css("z-index", this.zIndex);	

		//$(this.contentElement).css("z-index", this.contentZIndex);	

		if ( _obj.borderRadius) $(this.contentElement).css("border-radius", _obj.borderRadius);	
	},

	fadeIn: function() {

		$( this.element ).velocity( "fadeIn", {duration: 1000} );
	},

	fadeOut: function() {

		$( this.element ).velocity( "fadeOut", {duration: 1000} );
	},

	moveToCorner: function(_dir) {

		this.recordPos();

		var _top = display.menuHeight + this.spacer;

		var _left = this.width;

		if (_dir == "ne") _left = $(window).width() - this.size - this.width;

		$(this.element).css( {top: _top, left: _left } );
	},

} 