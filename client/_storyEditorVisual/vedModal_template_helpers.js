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

  storyInventorySize : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return story.inventorySize;

    return "Enter size"    
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

  bgPicURL : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return story.baseBGPic;

    return "This is the background picture for the Base screen."
  },


  bgButtonPic : function() {

  	var _val = Session.get("sUpdateVisualEditor");

  	if ( sed.recordID.get() ) return getFileFromPath( story.baseButtonPic.get() );

  	return "This the picture for the 'Return to Base' button."
  },

  bgButtonPicURL : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return story.baseButtonPic.get()

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

    var _inventorySize = $( "input#storyInventorySize" ).val();

		var _obj = {};

		if (_code) _obj.c = _code;

		if ( _name) _obj.n = _name;

    if (_inventorySize) _obj.is = _inventorySize;

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

  locationPicURL : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return story.background;

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

  	if ( sed.recordID.get() ) return getFileFromPath( ved.selectedEntity.pic );
  },

  charPicURL : function() {

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


//*********************************************************************************
//
//        TOKEN
//
//*********************************************************************************

Template.vedModalToken.helpers({

  tokenName : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.name;

    return "Enter token name"
  },

  tokenShortName : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.shortName;

    return "Enter short name"
  },

  tokenType : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.type.substr(0,1);

    return "Enter token type (one letter)"
  },

  tokenMovable : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.movable.substr(0,1);

    return "Enter token movable value"
  },

  tokenPic : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return getFileFromPath( ved.selectedEntity.pic );
  },

  tokenPicURL : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.pic;
  },

  greenButtonText : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return "UPDATE";

    return "CREATE";    
  }

});


Template.vedModalToken.events = {

  'click button#btnCreateTokenModal' : function(e){

    e.preventDefault();

    //Create a data object and insert the record with it
    var _obj = {};

    _obj.c = story.code;

    var _name = $( "input#tokenName" ).val();

    var _shortName =  $( "input#tokenShortName" ).val();

    var _type =  $( "input#tokenType" ).val();

    var _movable =  $( "input#tokenMovable" ).val();

    if ( _name ) _obj.n = _name

    if (_shortName ) _obj.sn = _shortName

    if ( _type ) _obj.t = _type

    if ( _movable ) _obj.m = _movable


    var _text = $("button#btnCreateTokenModal").text();

    if ( _text == "CREATE") {

        db.ghToken.insert(_obj, function (err, _ID) {

          if (err) {
            console.log(err);
            return;
          }

          //Upload the pics here if any were specified

          if ( ved.picUploaded ) sed.updateURLForNewRecord( ved.picUploaded, _ID, "p" );

       }); 
    }

    if ( _text == "UPDATE") {

        db.ghToken.update( { _id: ved.selectedEntity.ID }, { $set: _obj }, function (err, _ID) {

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

      if (_ID == "tokenPic") ved.picUploaded = "";

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

          if (_ID == "tokenPic") ved.picUploaded = downloadUrl;    

        } 

      });     

    },

  'click button#btnCancelTokenModal' : function(e){

    e.preventDefault();

    ved.hideModal();
  },
}


//*********************************************************************************
//
//        LOCAL (Chat or Cue)
//
//*********************************************************************************

Template.vedModalLocal.helpers({

  localName : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) {

        if (sed.table.get() == "Chat") return sed.chat;

        if (sed.table.get() == "Cue") return sed.cue;
    }

    return "Enter name"
  },

  greenButtonText : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return "UPDATE";

    return "CREATE";    
  }

});


Template.vedModalLocal.events = {

  'click button#btnCreateLocalModal' : function(e){

    e.preventDefault();


    var _collectionID = ved.localType.get();

    //Create a data object and insert the record with it
    var _obj = {};

    _obj.c = story.code;

    _obj.d = [];

    var _name = $( "input#localName" ).val();

    if ( _name ) _obj.n = _name;  //we will change this value below chat records

    if ( _collectionID == cChat) {

       _obj.s = _name;  //formerly stood for 'scene', field 'n' already in use for this one (name of node)
    }

    var _text = $("button#btnCreateLocalModal").text();

    if ( _text == "CREATE") {

        if (_collectionID == cCue) {

          db.ghCue.insert(_obj, function (err, _ID) {

            if (err) {
              console.log(err);
              return;
            }
          });

        } //end if cue

        if (_collectionID == cChat)  {

            _obj.i = "h";

            _obj.n =  smed.helperRootSpeechName;

            _obj.d = [ { t: smed.helperRootSpeech, g: smed.agentRootSpeechName } ];

            db.ghChat.insert(_obj, function (err, _ID) {

              if (err) {
                console.log(err);
                return;
              }
            });

            _obj.i = "u";

            _obj.n =  smed.agentRootSpeechName;

            _obj.d = [ { t: "", g: "" } ];

            db.ghChat.insert(_obj, function (err, _ID) {

              if (err) {
                console.log(err);
                return;
              }
            });           
        } //end if chat

    } //end if CREATE


    if ( _text == "UPDATE") {

        if (_collectionID == cCue) {

          db.ghCue.update( { _id: sed.recordID.get() }, { $set: _obj }, function (err, _ID) {

            if (err) {
              console.log(err);
              return;
            }
          });
        }

        if (_collectionID == cChat)  {

          db.ghChat.update( { _id: sed.recordID.get() }, { $set: _obj }, function (err, _ID) {

              if (err) {
                console.log(err);
                return;
              }
          });
        }

    }  //end if UPDATE

    ved.hideModal();  

  },

  'click button#btnCancelLocalModal' : function(e){

    e.preventDefault();

    ved.hideModal();
  },
}

//*********************************************************************************
//
//        TRANSFORM
//
//*********************************************************************************

Template.vedModalTransform.helpers({

  entityName : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.name;

    return "(No entity selected in scene)";
  },

  entityScaleX : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.lastTransform.scaleX;

    return "(No entity selected in scene)";
  },

  entityScaleY : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.lastTransform.scaleY;

    return "(No entity selected in scene)";
  },


  entityTranslateX : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) {

      var _obj = {};

      _obj.translateX = ved.selectedEntity.lastTransform.translateX

      _obj.ent = ved.selectedEntity;

      return convertPixelsToPercent( _obj );

    }

    return "(No entity selected in scene)";
  },

  entityTranslateY : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) {

      var _obj = {};

      _obj.ent = ved.selectedEntity;

      _obj.translateY = ved.selectedEntity.lastTransform.translateY

      return convertPixelsToPercent( _obj );
    }

    return "(No entity selected in scene)";
  },

  entityPicURL : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return ved.selectedEntity.pic;
  },

  greenButtonText : function() {

    var _val = Session.get("sUpdateVisualEditor");

    if ( sed.recordID.get() ) return "ADD";

    return "";    
  }

});

Template.vedModalTransform.events = {

  'click button#btnUpdateTransformModal' : function(e){

    e.preventDefault();

    //Create a data object and populate it with data from the form
    var _obj = {};

    var _arr = ['scaleX','scaleY','left','top','rotation','opacity', "time", "repeat", "repeatDelay", "yoyo"];
 
    for (var i = 0; i < _arr.length; i++) {

        var _name = _arr[i];

        var _value = document.getElementById( _name ).checked;

        if (_value) {        

          _obj[ _name] = $( "input#entity_" + _name).val();

          if (!_obj[ _name]) _obj[_name] = $( "input#entity_" + _name).attr("placeholder");

          if (_name == "scaleX" || _name == "scaleY" ) _obj[ _name] = formatFloat( parseFloat( _obj[ _name] ) );
        }
    }


    //put the values into the d (data) field on the form

    var _sel = "input#" + ved.recordIDToEdit;

    var _text = $( _sel ).val() + "( " + JSON.stringify( _obj ) + " )";

    $( _sel ).val( _text );

    ved.hideModal();    

  },

  'change input': function(event, template) {

      //we only care about the checkbox input

      var _ID = event.currentTarget.id;

      var _type = $("#" + _ID).attr("type");


    },

  'click button#btnCancelTransformModal' : function(e){

    e.preventDefault();

    ved.hideModal();
  },
}