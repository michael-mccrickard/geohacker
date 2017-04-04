Template.story.rendered = function() {

	Meteor.setTimeout( function() { 

    game.pauseMusic();

    story.draw();

    story.go( story.location ); 

  }, 500 );
}

Template.story.helpers({

  char: function() {

  	 return story.chars;
  },

  chatVisibilityClass: function() {

    if (story.mode.get() == "chat") return "";

     return "hidden";
  },

  editStoryMode: function() {

  if (Meteor.user() == null) return false;

    if (!game) return false;

    if (!game.user) return false;

    if (game.mode.get() == gmEditStory) return true;
    
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

      return story.baseButtonPic.get();
  },

  token: function() {

  	 return story.tokens;
  },

  selectMode: function() {

    if (story.mode.get() == "select") return true;

    return false;
  },

  storyButton: function() {

    return story.storyButtons;
  },

  VEDText: function() {

    return story.scene;
  }

  

});

Template.story.events({

/*
    'click #continueStory': function(event, template) {

          if (story.scene == "intro") story.play( "missionToMona" );
      },
*/

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

    'click .imgStoryInventoryButton': function(event, template) {

        var _name = $(event.currentTarget).attr("data-shortname");
        
        story.removeInventoryItem( _name );
      },


    'click div.divChatBackdrop': function(event, template) {
      
          story.returnToScene();
      },

    'click .storyThing': function(event, template) {

       if (story.cutScene) {

            if (story.cutScene.c == "wait") {

              story.cutScene.playNext();

              return;
            }
        }

        var _name = $(event.currentTarget).attr("data-shortname");

        if ( story[ _name].movable ) {

            story.addInventoryItem( _name );

            return;
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

          var _sel = "img#" + event.currentTarget.id;

          var _shortName = $( _sel ).data().shortname;
          
          story.doChat( _shortName);

      },

});