//*********************************************************************************
//
//				STORY
//
//*********************************************************************************


Template.vedModalStory.helpers({

  storyCode : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return story.code;

  	return "Enter code"
  },

  storyName : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return story.fullName;

  	return "Enter name"
  },

  bgPic : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return getFileFromPath( story.baseBGPic );

  	return "This is the background picture for the Base screen."
  },

  bgButtonPic : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return getFileFromPath( story.baseButtonPic.get() );

  	return "This the picture for the 'Return to Base' button."
  },

  greenButtonText : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return "UPDATE";

  	return "CREATE";  	
  }

});


Template.vedModalStory.events = {

	'click button#btnCreateStoryModal' : function(e){

		e.preventDefault();

		var _code = $( "input#storyCode" ).val();

		var _name = $( "input#storyName" ).val();

		var _obj = {};

		if (_code) _obj.c = _code;

		if ( _name) _obj.n = _name;

		var _text = $("button#btnCreateStoryModal").text();

		if ( _text == "CREATE") {

			//insert the record with the data object

		    db.ghStory.insert(_obj, function (err, _ID) {

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, _ID, "bg" );

		      if ( ved.bgButtonPicUploaded ) sed.updateURLForNewRecord( ved.bgButtonPicUploaded, _ID, "btn" );	
		    });
		}

		if ( _text == "UPDATE") {

			//update record with the data object

			_obj.c = story.code;

		    db.ghStory.update( { _id: sed.recordID.get() }, { $set: _obj }, function (err, _res) {

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, sed.recordID.get(), "bg" );

		      if ( ved.bgButtonPicUploaded ) sed.updateURLForNewRecord( ved.bgButtonPicUploaded, sed.recordID.get(), "btn" );	
			
			});

	      ved.hideModal();    

	   }

	},

  'change input': function(event, template) {

      //we only care about the file and checkbox input

      var _type = $("#" + event.currentTarget.id).attr("type");

      if ( _type != "file") {

      	return;
      }

      var _ID = event.currentTarget.id;

      if (_ID == "storyBGPic") ved.picUploaded = "";

      if (_ID == "storyBGButtonPic") ved.bgButtonPicUploaded = "";   

      var uploader = sed.uploader;

      var _file = event.target.files[0];

      if (_file) {

      	doSpinner();
      }
      else {

      	return;
      }

      uploader.send(_file, function (error, downloadUrl) {

      	stopSpinner();

        if (error) {
         
          // Log service detailed response.
          console.log(error);

        }
        else {

          if (_ID == "storyBGPic") ved.picUploaded = downloadUrl;

          if (_ID == "storyBGButtonPic") ved.bgButtonPicUploaded = downloadUrl;           

        } 

      });     

    },

	'click button#btnCancelStoryModal' : function(e){

		e.preventDefault();

		ved.hideModal();
	},
}

//*********************************************************************************
//
//				LOCATION
//
//*********************************************************************************

Template.vedModalLocation.helpers({

  countryCode : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return story.location;

  	return "Enter country code"
  },

  locationPic : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return getFileFromPath( story.background );

  	return "This is the background picture for the location."
  },

  greenButtonText : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return "UPDATE";

  	return "CREATE";  	
  }

});


Template.vedModalLocation.events = {

	'click button#btnCreateLocationModal' : function(e){

		e.preventDefault();

		//Create a data object and insert the record with it

		var _obj = {};

		var _countryCode = $( "input#countryCode" ).val();

		if ( _countryCode ) _obj.n = _countryCode;

		_obj.c = story.code;



		var _text = $("button#btnCreateLocationModal").text();

		if ( _text == "CREATE") {

		    db.ghLocation.insert(_obj, function (err, _ID) { 

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, _ID, "p" );

		   }); 
		}

		if ( _text == "UPDATE") {

		    db.ghLocation.update( {_id: sed.recordID.get() }, { $set: _obj }, function (err, _ID) {

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, sed.recordID.get(), "p" );

		   }); 
		}

		ved.hideModal();  

	},

  'change input': function(event, template) {

      //we only care about the file and checkbox input

      var _type = $("#" + event.currentTarget.id).attr("type");

      if ( _type != "file") {

      	return;
      }

      var _ID = event.currentTarget.id;

      if (_ID == "locationPic") ved.picUploaded = "";

      var uploader = sed.uploader;

      var _file = event.target.files[0];

      if (_file) {

      	doSpinner();
      }
      else {

      	return;
      }

      uploader.send(_file, function (error, downloadUrl) {

      	stopSpinner();

        if (error) {
         
          // Log service detailed response.
          console.log(error);

        }
        else {

          if (_ID == "locationPic") ved.picUploaded = downloadUrl;    

        } 

      });     

    },

	'click button#btnCancelLocationModal' : function(e){

		e.preventDefault();

		ved.hideModal();
	},
}


//*********************************************************************************
//
//				CHAR
//
//*********************************************************************************

Template.vedModalChar.helpers({

  charName : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return ved.selectedEntity.name;

  	return "Enter character name"
  },

  charShortName : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return ved.selectedEntity.shortName;

  	return "Enter short name"
  },

  charType : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return ved.selectedEntity.type.substr(0,1);

  	return "Enter character type (one letter)"
  },

  charPic : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return ved.selectedEntity.pic;
  },

  greenButtonText : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return "UPDATE";

  	return "CREATE";  	
  }

});


Template.vedModalChar.events = {

	'click button#btnCreateCharModal' : function(e){

		e.preventDefault();

		//Create a data object and insert the record with it
		var _obj = {};

		_obj.c = story.code;

		var _name = $( "input#charName" ).val();

		var _shortName =  $( "input#charShortName" ).val();

		var _type =  $( "input#charType" ).val();

		if ( _name ) _obj.n = _name

		if (_shortName ) _obj.sn = _shortName

		if ( _type ) _obj.t = _type


		var _text = $("button#btnCreateCharModal").text();

		if ( _text == "CREATE") {

		    db.ghChar.insert(_obj, function (err, _ID) {

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, _ID, "p" );

		   }); 
		}

		if ( _text == "UPDATE") {

c( _obj)

c(ved.selectedEntity.ID)

		    db.ghChar.update( { _id: ved.selectedEntity.ID }, { $set: _obj }, function (err, _ID) {

		      if (err) {
		        console.log(err);
		        return;
		      }

		      //Upload the pics here if any were specified

		      if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, _ID, "p" );

		   }); 
		}

		ved.hideModal();    

	},

  'change input': function(event, template) {

      //we only care about the file and checkbox input

      var _type = $("#" + event.currentTarget.id).attr("type");

      if ( _type != "file") {

      	return;
      }

      var _ID = event.currentTarget.id;

      if (_ID == "charPic") ved.picUploaded = "";

      var uploader = sed.uploader;

      var _file = event.target.files[0];

      if (_file) {

      	doSpinner();
      }
      else {

      	return;
      }

      uploader.send(_file, function (error, downloadUrl) {

      	stopSpinner();

        if (error) {
         
          // Log service detailed response.
          console.log(error);

        }
        else {

          if (_ID == "charPic") ved.picUploaded = downloadUrl;    

        } 

      });     

    },

	'click button#btnCancelCharModal' : function(e){

		e.preventDefault();

		ved.hideModal();
	},
}