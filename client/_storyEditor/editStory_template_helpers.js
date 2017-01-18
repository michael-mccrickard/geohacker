Template.editStory.events = {

  'click #pickStory' : function(e){

    e.preventDefault();

    //reset the name on the button, since we are wiping out the selection criteria

    $("#pickStory").text( "STORY" );

    sed.setMode("Story", db.ghStory, cStory);

    //for story mode, we show all stories in the db

    sed.code.set("");

    sed.findSelector.set( null );

	
  },

  'click #pickLocation' : function(e){

    e.preventDefault();

    sed.setMode( "Location", db.ghLocation, cLocation )
  },

  'click #pickScene' : function(e){

    e.preventDefault();

    sed.setMode( "Scene", db.ghScene, cScene )
  },

  'click #pickChar' : function(e){

    e.preventDefault();

    sed.setMode( "Char", db.ghChar, cChar )
  },

  'click #pickAgent' : function(e){

    e.preventDefault();

    sed.setMode( "Token", db.ghStoryAgent, cStoryAgent )
  },

  'click #pickToken' : function(e){

    e.preventDefault();

    sed.setMode( "Token", db.ghToken, cToken )
  },

  'click #pickCue' : function(e){

    e.preventDefault();

    sed.setMode( "Cue", db.ghCue, cCue )
  },

  'click #pickChat' : function(e){

    e.preventDefault();

    sed.setMode( "Chat", db.ghChat, cChat )
  },


  'click #pickFlag' : function(e){

    e.preventDefault();

    sed.setMode( "Flag", db.ghStoryFlag, cStoryFlag )
  },

  'click .selectRecord' : function(e){

     e.preventDefault();
	
	 sed.code.set( $( "button#" + e.currentTarget.id + ".btn").data("c") );

	  if ( sed.table.get() == "Story") {

			$("#pick" + sed.table.get() ).text( sed.code.get() );
	  }

	  sed.findSelector.set( { c: sed.code.get() } );
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

}


Template.editStory.helpers({

  editStoryContent : function() {

    return sed.template.get();
  },


});

Template.storyData.helpers({

	field : function() {

		return Object.keys( sed.collection.get().find().fetch()[0] );
	},

	dataRecord : function() {

		if (sed.code.get().length) {

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

	notStoryOrScene : function() {

		var _id = sed.collectionID.get();

		if (_id == cStory || _id == cScene ) {

			return false;
		}

		return true;
	}
});