//story.js


$(document).ready(function(){
    $('.storySpot').tooltip(); 
});


Story = {

	_init : function() {

		this.mode = new Blaze.ReactiveVar( "none" );

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

		this.mode.set( "none" );

		$(this.bgElement).attr( "src", this.background );		
	},

	fadeInBG : function() {

		$(this.bgElement).velocity( "fadeIn", {duration: 1000} );
	},

	fadeOutBG : function() {

		$(this.bgElement).velocity( "fadeOut", {duration: 1000} );
	},

	fadeInChars : function() {

		for (var i = 0; i < this.charObjs.length; i++) {

			this.charObjs[i].fadeIn();
		}
	},

	fadeInTokens : function() {

		for (var i = 0; i < this.tokenObjs.length; i++) {

			this.tokenObjs[i].fadeIn();
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

  	if (story.mode.get() == "exercise") return true;

  	return false;
  },

  chatMode: function() {

  	if (story.mode.get() == "chat") return true;

  	return false;
  },

  token: function() {

  	 return story.tokens;
  }

});

Template.story.events({

    'click #continueStory': function(event, template) {

          if (story.sceneName == "intro") story.play( "needAPasscode" );
      },

    'click .storyChar': function(event, template) {

//need a check here to see if it's a good time to talk

		game.user.sms.targetID.set( $("img#" + event.currentTarget.id).data().mongoid );

		story.mode.set("chat");
      },

});