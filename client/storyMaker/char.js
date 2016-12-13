//char.js

Char = {

	init : function( _obj ) {

		this.name = _obj.name;

		this.index = _obj.index;

		this.top = _obj.top;

		this.left = _obj.left;

		this.placement = "top";

		this.rec = Meteor.users.findOne( { username: this.name } );

		this.pic = this.rec.profile.av;	

		this.size = 96;

		this.spacer = 8;

		this.prevTop = 0;

		this.prevLeft = 0;

		this.element = "div#storyChar" + this.index + ".divStoryChar";

		this.nameElement = "div#storyCharName" + this.index;

		this.imageElement = "img#storyCharPic" + this.index + ".storyChar";

	},

	add : function() {

		$(this.imageElement).attr("src", this.pic);

		$(this.nameElement).text( this.name );		

		$(this.element).css("width", this.size);

		$(this.element).css("left", this.left);

		$(this.element).css("top", this.top);		
	},

	contact : function() {

		c("Hi, I'm " + this.name);
	},

	moveToCorner: function(_dir) {

		this.recordPos();

		var _top = display.menuHeight + this.spacer;

		var _left = this.spacer;

		if (_dir == "ne") _left = $(window).width() - this.size - this.spacer;

		$(this.element).css( {top: _top, left: _left } );
	},

	moveToStart: function() {

		$(this.element).css( {top: this.prevTop, left: this.prevLeft } );
	},

	recordPos : function() {

		this.prevTop = $(this.element).offset().top;

		this.prevLeft = $(this.element).offset().left;
	},

	q : function() {

		$( this.element ).tooltip('destroy');
	},

	sayLeft : function( _text ) {

		this.placement = "left";

		this.say( _text );
	},

	sayRight : function( _text ) {

		this.placement = "right";

		this.say( _text );
	},


	say : function( _text) {

      $( this.element  ).tooltip({ delay:0, trigger:"manual",  title: _text, placement: this.placement });

      $( this.element  ).tooltip('show'); 

	},

	setDirection : function( _which ) {

		this.placement = _which;
	}

} 