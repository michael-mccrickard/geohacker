//char.js

Char = {

	init : function( _name, _shortName, _index ) {

		this.name = _name;

		this.shortName = _shortName;

		this.index = _index

		this.placement = "top";

		this.rec = Meteor.users.findOne( { username: this.name } );

		this.pic = this.rec.profile.av;	

		this.size = 96;

		this.spacer = 8;

		this.element = "div.divStoryChar.storySpot" + this.index;

	},

	contact : function() {

		c("Hi, I'm " + this.name);
	},

	moveToCorner: function(_dir) {

		var _top = display.menuHeight + this.spacer;

		var _left = this.spacer;

		if (_dir == "ne") _left = $(window).width() - this.size - this.spacer;

		$(this.element).css( {top: _top, left: _left, position:'absolute'} );
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