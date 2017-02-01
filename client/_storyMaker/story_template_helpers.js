Template.story.rendered = function() {

	Meteor.setTimeout( function() { 

    story.draw();

    story.go( story.location ); 

  }, 500 );
}

Template.story.helpers({

  char: function() {

  	 return story.chars;
  },

  chatMode: function() {

    if (story.mode.get() == "chat") return true;

    return false;
  },

  chatVisibilityClass: function() {

    if (story.mode.get() == "chat") return "";

     return "hidden";
  },

  editEntityMode: function() {

    if (!ved) return false;

    if ( ved.mode.get() == "entity") return true;

    return false;
  },

  exerciseMode: function() {

  	if (story.mode.get() == "exercise") return true;

  	return false;
  },

  inventoryButton: function() {

    return story.inventoryButtons;
  },

  mapMode: function() {

      if (story.mode.get() == "map") return true;

      return false;
  },

  picForBaseButton: function() {

      return story.sceneButtonPic.get();
  },


  sceneMode: function() {

      if (story.mode.get() == "scene") return true;

      return false;
  },

  token: function() {

  	 return story.tokens;
  },

  storyButton: function() {

    return story.storyButtons;
  },

});

Template.story.events({


    'click #continueStory': function(event, template) {

          if (story.scene == "intro") story.play( "missionToMona" );
      },


    //Map button

    'click img#imgStoryButtonMap': function(event, template) {

         story.goMap();
      },

    'click img#storyButtonMap': function(event, template) {

         story.goMap();
      },

    //Base button

    'click img#imgStoryButtonBase': function(event, template) {

         story.goBase();
      },

    'click img#storyButtonBase': function(event, template) {

         story.goBase();
      },

    'click .imgStoryInventoryButton': function(event, template) {

        var _name = $(event.currentTarget).attr("data-shortname");
        
        story.removeInventoryItem( _name );
      },


    'click div.divChatBackdrop': function(event, template) {
      
          story.mode.set("scene");
      },

    'click .divStoryThing': function(event, template) {

        var _name = $(event.currentTarget).attr("data-shortname");

        if ( story[ _name].movable ) {

            story.addInventoryItem( _name );

            return;
        }

       if (story.cutScene) {

        if (story.cutScene.c == "wait") story.cutScene.playNext();
       }
      },

    'click .storyThing': function(event, template) {

       if (story.cutScene) {

        if (story.cutScene.c == "wait") story.cutScene.playNext();
       }
      },

    'click .storyThingContent': function(event, template) {

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

//need a check here to see if it's a good time to talk?

          var _sel = "img#" + event.currentTarget.id;

          var _shortName = $( _sel ).data().shortname;
          
          story.doChat( _sel, _shortName);

      },

});