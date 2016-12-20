Template.story.rendered = function() {

	Meteor.setTimeout( function() { story.play( story.scene ); }, 500 );
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
  },

  storyButton: function() {

    var _arr = [1,2,3,4,5]

    return _arr;
  },

  picForInventory: function( _val) {

      if (_val == 1) return "storyMapButton3.png";

            if (_val > 1) return "featuredBackdrop.jpg";
  },

  sceneMode: function() {

      if (story.mode.get() == "scene") return true;

      return false;
  },

  mapMode: function() {

      if (story.mode.get() == "map") return true;

      return false;
  }

});

Template.story.events({


    'click #continueStory': function(event, template) {

          if (story.scene == "intro") story.play( "needAPasscode" );
      },


    'click img#imgStoryButton1': function(event, template) {

          browseMap.mode.set( "story" );

          story.mode.set("map");
      },

    'click div.divChatBackdrop': function(event, template) {
      
          story.mode.set("scene");
      },

    'click .divStoryThing': function(event, template) {

       if (story.cutScene) {

        if (story.cutScene.c == "wait") story.cutScene.playNext();
       }
      },

     'click img.storyBG': function(e, t) {
     	
       if (story.cutScene) {

     	 	if (story.cutScene.c == "wait")	{

            story.hidePrompt();
      
            story.cutScene.playNext();

        }
     	 }
     },

    'click .storyChar': function(event, template) {

//need a check here to see if it's a good time to talk

          var _sel = "img#" + event.currentTarget.id;

          var _shortName = $( _sel ).data().shortname;
          
          story[ _shortName ].q();

      		game.user.sms.targetID.set( $( _sel ).data().mongoid );

      		game.user.sms.startThread();

      		story.mode.set("chat");
      },

});