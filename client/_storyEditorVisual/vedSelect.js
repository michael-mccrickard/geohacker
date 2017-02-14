//vedform.js

Template.vedSelect.helpers({

  record : function() {

  	var _sortObj = {};

  	var _ID = sed.collectionID.get();

  	if (_ID == cStory) _sortObj = { sort:{ c: 1 } };

    return sed.collection.get().find( sed.findSelector.get(), _sortObj  );
  },

  elementTypeName : function(_obj) {

  	 return ( sed.table.get() );
  },

  elementName : function(_obj) {

  	var _ID = sed.collectionID.get();

  	if (_ID == cChat) return ( _obj.s );  	

  	 return ( _obj.n );
  },

  lastEditedName: function() {

  	var _coll = sed.collectionID.get();

  	var _code = "";

  	if ( _coll == cStory ) {

  		return sed.collection.get().findOne( { c: game.user.profile.lastEditedStory } ).n;
  	}

  	if ( _coll == cCue && story.scene ) {

  		return sed.collection.get().findOne( { n: story.scene } ).n;
  	}
  },
});


Template.vedSelect.events = {

	'click button#last' : function(e){

		e.preventDefault();

		var _ID = sed.collectionID.get();

		if (_ID == cStory) {

		 	sed.code.set( game.user.profile.lastEditedStory );

			ved.loadStory(); 		
		}   
	},

	'change select': function(event, template) {

	     //get the element name
	     var _name = $("#elementSelect option:selected").val();

	     var _table = sed.table.get();

	     if (_table == "Story") ved.loadStoryByName( _name );

	     if (_table == "Cue") {

	     	sed.scene.set( _name );

	     	ved.edit("Cue", cCue, "edit")    
     	 }

	     if (_table == "Chat") {

	     	sed.chat.set( _name );

	     	ved.showData( _name )    
     	 }

	     if (_table == "Location") {

	     	sed.location.set( _name );

	     	ved.edit("Location", cLocation, "edit")    
     	 }

	}

 }
