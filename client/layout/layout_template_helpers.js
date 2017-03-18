Template.layout.helpers({

  storyPreload: function() {

    var _val = Session.get("sUpdateStoryPreloads");

    return story.preloads;
  },

  editStoryMode: function() {

	  if (Meteor.user() == null) return false;

  	if (!game) return false;

  	if (!game.user) return false;

  	if (game.mode.get() == gmEditStory) return true;
    
  },

  menuElement: function() {

  	var _flag = Session.get("sUpdateVisualEditor");

  	if (!ved) { return null; }

  	var _menuFlag = ved.menuOpen.get();

  	if ( !_menuFlag ) { return null; }

  	var _type = ved.menuElementType.get();

  	if (_type == cChar ) return ved.charArray;

   	if (_type == cToken ) return ( db.ghToken.find( { c: sed.code.get() } ).fetch() );

  },

  menuOpen: function() {

    return ved.menuOpen.get();
  },

  editorModeIsSelected: function() {

    var _flag = Session.get("sUpdateVisualEditor");

    if (!sed) return;

    if (sed.mode.get() == "data" || sed.mode.get() == "visual") {

        return true;
    }

    return false;
  },

  editorModeIsVisual: function() {

    if (Session.get("sStoryEditMode") == "visual") return true;

    return false;
  },


  editorModeIsData: function() {

    if (Session.get("sStoryEditMode") == "data") return true;

    return false;

  },

  storyIsLoaded : function() {

    var _flag = Session.get("sUpdateVisualEditor");

    if (sed.mode.get() == "data") return false;

    if (story.isLoaded.get() == true ) return true;

    return false;
  },

  vedSelectStoryMode : function() {

    var _flag = Session.get("sUpdateVisualEditor");

    var _mode = ved.mode.get();

    if (_mode == "select" && sed.table.get() == "Story") return true;

    return false;
  },

  vedModalTemplate: function() {

    var _flag = Session.get("sUpdateVisualEditor");
    
    return ved.modalTemplate.get();
  }

});

Template.layout.events({

	'click .selectionButton': function(event, template) {

      var _ID = event.currentTarget.id;

      if ( _ID == "newEntity") {

         ved.createNewEntity( ved.menuElementType.get() )

         return;
      }

	    ved.selectEntity( _ID );

	 },
});
