Template.layout.helpers({

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

  editorModeIsSelected: function() {

    var _flag = Session.get("sUpdateVisualEditor");

    if (!sed) return;

    if (sed.mode.get() == "data" || sed.mode.get() == "visual") {

        return true;
    }

    return false;
  },

  editorModeIsVisual: function() {

    var _flag = Session.get("sUpdateVisualEditor");

    if (!sed) return;

    if (sed.mode.get() == "visual") {

        return true;
    }

    return false;
  },

  editorModeIsData: function() {

    var _flag = Session.get("sUpdateVisualEditor");

    if (!sed) return;

    if (sed.mode.get() == "data") {

        return true;
    }

    return false;
  }

});

Template.layout.events({

	'click .selectionButton': function(event, template) {

	      ved.selectEntity( event.currentTarget.id);

	 },
});
