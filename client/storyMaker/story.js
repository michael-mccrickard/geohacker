//story.js


$(document).ready(function(){
    $('.storySpot').tooltip(); 
});


Story = {

	_init : function() {

		this.exerciseMode = new Blaze.ReactiveVar( false );

		this.bgElement = "img.storyBG";

		this.speed = 1.0;
	},

	start : function() {

		//default response

		var _scene = this.scenes[0];

		this.play( _scene );
	},

	_play : function( _name ) {

		this.sceneName = _name;

		this.exerciseMode.set( false );

		$(this.bgElement).attr( "src", this.background );		
	},

	fadeInBG : function() {

		$(this.bgElement).velocity( "fadeIn", {duration: 1000} );
	},

	fadeOutBG : function() {

		$(this.bgElement).velocity( "fadeOut", {duration: 1000} );
	},

	fadeInChars : function() {

		for (var i = 0; i < this.chars.length; i++) {

			$( this.chars[i].element ).velocity( "fadeIn", {duration: 1000} );
		}
	},


	fadeInTokens : function() {

		for (var i = 0; i < this.tokens.length; i++) {

			$( this.tokens[i].element ).velocity( "fadeIn", {duration: 1000} );
		}
	},





}

Template.story.rendered = function() {

	Meteor.setTimeout( function() { story.start(); }, 500 );
}

Template.story.helpers({

  char: function() {

  	 return story.chars;
  },

  exerciseMode: function() {

  	if (!story.exerciseMode) return false;

  	return story.exerciseMode.get();
  },

  token: function() {

  	 return story.tokens;
  }

});

Template.story.events({

    'click #continueStory': function(event, template) {

          if (story.sceneName == "intro") story.play( "needAPasscode" );
      },

});