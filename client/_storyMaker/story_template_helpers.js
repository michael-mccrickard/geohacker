Template.story.rendered = function() {

	Meteor.setTimeout( function() { 

    game.pauseMusic();

    story.draw();

    story.go( story.location ); 

  }, 500 );
}

Template.story.helpers({

  MMapLeft: function() {

     return $(window).width() * 0.05;
  },

  MMapWidth: function() {

     return $(window).width() * 0.9;
  },


  MMapHeight: function() {

     return $(window).height() * 0.9;
  
     return false;
  },

  typeIsAmmap: function() {

    if (story.exerciseType.get() == "ammap") return true;

    return false;
  },

  typeIsCustomAmmap: function() {

    if (story.exerciseType.get() == "customAmmap") return true;

    return false;
  },


  typeIsMapbox: function() {

   if (story.exerciseType.get() == "mapbox") return true;

    return false;
  },

  char: function() {

  	 return story.chars;
  },

  label: function() {

     return story.labels;
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

  sceneMode: function() {

    var _mode = story.mode.get();

    if (_mode == "scene" || _mode == "chat") return true;

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

          var _name = $(event.currentTarget).attr("data-shortname");

          if ( story[ _name].movable ) {  

             story.doChat( _shortName);
          }
          else {

            if (story.cutScene.c == "wait") {

                story.hidePrompt();
          
                story.cutScene.playNext();

            }

          }
      },

    'click #nextMission': function(event, template) {

          alert("More Geosquad missions coming soon!  Thanks for playing.")

      },

});