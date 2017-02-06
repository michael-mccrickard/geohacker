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

    sed.findSelector.set({});

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

    sed.setCollection( "StoryFlag", db.ghStoryFlag, cStoryFlag )
  },

  'click .selectRecord' : function(e){

     e.preventDefault();

     sed.selectRecord( e.currentTarget.id );
  },


  'change input': function(event, template) {

    	//we only care about the file and checkbox input

      var _type = $("#" + event.currentTarget.id).attr("type");

      if ( _type != "file"  && _type != "checkbox") {

      	return;
      }

      var _recordID = event.currentTarget.id.substr(1);  //we prefixed an "I" or an "F" to the ID in the template to make it a legal HTML element ID

      if (_type == "file") {

          var uploader = sed.uploader;

          var _file = event.target.files[0];

          uploader.send(_file, function (error, downloadUrl) {

            if (error) {
             
              // Log service detailed response.
              console.log(error);

            }
            else {

              sed.updateURLForNewRecord( downloadUrl, _recordID );

            } 
          });     

      } //end if file type

      if (_type == "checkbox") {

         //assuming this is the Flag table

         //get the flag name
         var _name = $("input#" + _recordID + ".n").val();

         var _value = document.getElementById("F" + _recordID).checked;

         if (story.code) { 

            story.flags[ _name ] = _value;

           //is this an inventory change?

              var _item = "";

             if ( ( _name.substr(0,4) == "has_"  && _value ) || (  _name.substr(0,5) == "gave_" && !_value ) ) {

                _item = _name.substr(4);

                story.addInventoryItem( _item );
             }

             if ( _name.substr(0,5) == "gave_") {

                _item = _name.substr(5);

                story.removeInventoryItem( _item );
             }
          }

      }

    }, //end change input

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

    sed.saveLocalCollectionToRecord();
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

  notOrderField: function() {

      if ( this == "o") return false;

      return true;
  },

	field : function() {

		return Object.keys( sed.collection.get().find().fetch()[0] );
	},

	dataRecord : function() {

		if (sed.code.get().length) {

      if (sed.table.get() == "Chat") {

        return sed.collection.get().find( sed.findSelector.get(), {sort: { s: 1 } } );
      }

      if (sed.table.get() == "StoryFlag") {

        return sed.collection.get().find( sed.findSelector.get(), {sort: { o: 1 } } );
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

	notStoryChatOrCue : function() {

		var _id = sed.collectionID.get();

		if (_id == cStory || _id == cChat || _id == cCue) {

			return false;
		}

		return true;
	},

  flag : function() {

    var _id = sed.collectionID.get();

    if (_id == cStoryFlag) {

      return true;
    }

    return false;
  },

  notFlag : function() {

    var _id = sed.collectionID.get();

    if (_id == cStoryFlag) {

      return false;
    }

    return true;
  },

  notStoryOrChat : function() {

    var _id = sed.collectionID.get();

    if (_id == cStory || _id == cChat ) {

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