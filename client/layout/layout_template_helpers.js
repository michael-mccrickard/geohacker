Template.layout.helpers({

  editStoryMode: function() {

	if (Meteor.user() == null) return false;

  	if (!game) return false;

  	if (!game.user) return false;

  	if (game.mode.get() == gmEditStory) return true;
    
  },

  menuElement: function() {

  	var _flag = Session.get("sUpdateVisualEditor");

  	if (typeof ved == 'undefined') { return null; }

  	var _menuFlag = ved.menuOpen.get();

  	if ( !_menuFlag ) { return null; }

  	var _type = ved.menuElementType.get();

  	var _collection = null;

  	if (_type == cChar ) _collection = db.ghChar;

   	if (_type == cToken ) _collection = db.ghToken;

   	return ( _collection.find( { c: sed.code.get() } ).fetch() );

  }

});