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

  chatVisibilityClass: function() {

    if (story.mode.get() == "chat") return "";

     return "hidden";
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

    return story.storyButtons;
  },

  inventoryButton: function() {

    return story.inventoryButtons;
  },

  picForStoryButton: function( _val) {

      if (_val == 1) return "storyMapButton3.png";


      if (_val == 2) return story.sceneButtonPic.get();
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

          if (story.scene == "intro") story.play( "missionToMona" );
      },


    //MAP button

    'click img#imgStoryButton1': function(event, template) {

          story.unhiliteAllButtons();

          story.hiliteButton(1);

          story.hideAll();

          story.hidePrompt();

          browseMap.mode.set( "story" );

          Meteor.setTimeout( function() { story.mode.set("map"); }, 250 );
      },

    //SCENE button

    'click img#imgStoryButton2': function(event, template) {

          story.unhiliteAllButtons();

          story.hiliteButton(2);

          story.go("base");
      },


    'click .imgStoryInventoryButton': function(event, template) {

          //story.unhiliteAllInventoryButtons();

          //story.hiliteButton(2);

        var _name = $(event.target).data("shortname");

        story.removeInventoryItem( _name );
      },


    'click div.divChatBackdrop': function(event, template) {
      
          story.mode.set("scene");
      },

    'click .divStoryThing': function(event, template) {

        var _name = $(event.target).data("shortname");

        if ( story[ _name].movable ) {

            story.addInventoryItem( _name );

            return;
        }

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
          
          story.doChat( _sel, _shortName);

      },

});