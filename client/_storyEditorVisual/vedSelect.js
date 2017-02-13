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

  	 return (_obj.n);
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

c("click")
    e.preventDefault();

   	var _ID = sed.collectionID.get();

  	if (_ID == cStory) {

     	sed.code.set( game.user.profile.lastEditedStory );

    	sed.switchTo( 'story' ); 		
  	}   

  },
 }
