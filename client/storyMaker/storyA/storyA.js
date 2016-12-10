testStory = function() {

	storyMaker.load( "storyA" );
}

Char = {

	init : function( _name, _shortName ) {

		this.name = _name;

		this.shortName = _shortName;

		this.rec = Meteor.users.findOne( { username: this.name } );

		this.pic = this.rec.profile.av;	

		this.element = '#storyChar_' + this.shortName;
	},

	contact : function() {

		c("Hi, I'm " + this.name);
	},

	q : function() {

		$( this.element ).tooltip('destroy');
	},

	say : function( _text) {

      $( this.element  ).tooltip({ delay:0, trigger:"manual",  title: _text });

      $( this.element  ).tooltip('show'); 

	}

} 

create_storyA = function() {
	
	create_storyA_chars();
}


function create_storyA_chars() {


	story.twain = new storyA_twain();

	story.bert = new storyA_bert();
}

function storyA_twain() {

	this.init( "Mark Twain", "twain" );

}

storyA_twain.prototype = Char;


function storyA_bert() {

	this.init( "Bert Williams", "bert" );

}

storyA_bert.prototype = Char;