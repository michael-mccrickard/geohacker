//storyLabel.js

StoryLabel = function(_index, _text, _obj) {

	if (!_index) {

		c("StoryLabel constructor called without index parameter.")

		return;
	}

	this.index = _index;

	if (!_text) {

		c("StoryLabel constructor called without text parameter.")

		return;
	}

	this.text = _text;

	this.element = "div#storyLabel" + _index + ".storyLabel";

	this.imageElement = this.element;  //allows for the selection rectangle to be displayed when editing position

	this.color = "#000000";

	this.fontSize = "16px";

	this.x = 0.5;

	this.y = 0.5;

	this.origSize = {};

	this.origSize.width = 1;

	this.origSize.height = 1;
	

	if (_obj) {

		if (_obj.fontSize) this.fontSize = _obj.fontSize;

		if (_obj.color) this.color = _obj.color;

		if (_obj.x) this.x = _obj.x;

		if (_obj.y) this.y = _obj.y;
	}

	this.add = function() {

		$(this.element).text( this.text );

		$(this.element).css( "color", this.color );

		$(this.element).css( "font-size", this.fontSize );		
	}

	this.place = function( _obj ) {

		if (_obj) {

			if (_obj.x ) this.x = _obj.x;

			if (_obj.y ) this.y = _obj.y;			
		}

		$( this.element ).css("top", this.y * $(window).height() )

		$( this.element ).css("left", this.x * $(window).width() )

	}

	this.show = function() {

		$(this.element).css("opacity", 1);
	}


	this.hide = function() {

		$(this.element).css("opacity", 0);
	}
} 

StoryLabel.prototype = new Entity();
