Template.editStory.rendered = function() {

  sed.draw();

  stopSpinner();
}


Template.editStory.events = {

  'click #pickStory' : function(e){

    e.preventDefault();

    //reset the name on the button, since we are wiping out the selection criteria

    $("#pickStory").text( "STORY" );

    sed.setCollection("Story", db.ghStory, cStory);

    //for story mode, we show all stories in the db

    sed.code.set("");

  },

  'click #pickLocation' : function(e){

    e.preventDefault();

    sed.setCollection( "Location", db.ghLocation, cLocation )
  },

  'click #pickScene' : function(e){

    e.preventDefault();

    sed.setCollection( "Scene", db.ghScene, cScene )
  },

  'click #pickChar' : function(e){

    e.preventDefault();

    sed.setCollection( "Char", db.ghChar, cChar )
  },

  'click #pickAgent' : function(e){

    e.preventDefault();

    sed.setCollection( "Agent", db.ghStoryAgent, cStoryAgent )
  },

  'click #pickToken' : function(e){

    e.preventDefault();

    sed.setCollection( "Token", db.ghToken, cToken )
  },

  'click #pickCue' : function(e){

    e.preventDefault();

    sed.setCollection( "Cue", db.ghCue, cCue )
  },

  'click #pickChat' : function(e){

    e.preventDefault();

    sed.displayChatData();
  },


  'click #pickFlag' : function(e){

    e.preventDefault();

    sed.setCollection( "Flag", db.ghStoryFlag, cStoryFlag )
  },

  'click .selectRecord' : function(e){

     e.preventDefault();

     sed.selectRecord( e.currentTarget.id );
  },


  'change input': function(event, template) {

  	//we only care about the file input

    if ( $("#" + event.currentTarget.id).attr("type") != "file" ) {

    	return;
    }

    var _ID = event.currentTarget.id;

    _ID = _ID.substr(1);  //we prefixed an "I" to the ID in the template to make it a legal HTML element ID

    var uploader = sed.uploader;

    var _file = event.target.files[0];

    uploader.send(_file, function (error, downloadUrl) {

      if (error) {
       
        // Log service detailed response.
        console.log(error);

      }
      else {

        sed.updateURLForNewRecord( downloadUrl, _ID );

      }
    });

  },

  'click .dataRow' : function(evt, template) {

     sed.recordID.set( evt.currentTarget.id );

      var _cid = sed.collectionID.get();


     if (_cid == cLocation || _cid == cChar || _cid == cToken) {

     		var p = sed.collection.get().findOne( { _id: sed.recordID.get() } ).p;

     		$("img#editFeaturedControlPic.bigPic").attr('src', p);
     }
     
  },

  'click #returnToServer' : function(e){

    e.preventDefault();

    sed.saveAllLocalRecords();

    sed.saveLocalCollectionToRecord();

    sed.dataMode.set("server");

    Meteor.setTimeout( function() { sed.draw(); }, 250 );
  },


  'click #saveAll' : function(e){

    e.preventDefault();

    sed.saveAllLocalRecords();

    //sed.saveLocalCollectionToRecord();
  },

}


Template.editStory.helpers({

  editStoryContent : function() {

    return sed.template.get();
  },

  serverMode: function() {

    if (sed.dataMode.get() == "server" ) return true;

    return false;
  },

  localMode: function() {

    if (sed.dataMode.get() == "local" ) return true;

    return false;
  },

});

Template.storyData.helpers({

	field : function() {

		return Object.keys( sed.collection.get().find().fetch()[0] );
	},

	dataRecord : function() {

		if (sed.code.get().length) {

      if (sed.table.get() == "Chat") {

        return sed.collection.get().find( sed.findSelector.get(), {sort: { s: 1 } } );
      }

			return sed.collection.get().find( sed.findSelector.get() );
		}

		return sed.collection.get().find();
	},

	getValue : function( _field) {

		var _obj = Template.parentData(1);

		return _obj[ _field ];
	},

	getIDValue : function() {

		var _obj = Template.parentData(1);

		return _obj._id;
	},

	notStory : function() {

		var _id = sed.collectionID.get();

		if (_id == cStory ) {

			return false;
		}

		return true;
	},

  serverMode: function() {

    if (sed.dataMode.get() == "server" ) return true;

    return false;
  },

  localMode: function() {

    if (sed.dataMode.get() == "local" ) return true;

    return false;
  },

  localRecord: function() {

     return sed.arrCollection.find( {}, { sort: {q: 1} } );
  },

  recordID: function() {

    return sed.recordID.get();
  }
});