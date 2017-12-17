Template.editor.rendered = function() {

  stopSpinner();

  game.pauseMusic();

  setCodeExplainText();

}

function setCodeExplainText() {

  Meteor.setTimeout( function(){ _setCodeExplainText() }, 500);
}

_setCodeExplainText = function() {

  var _index = editor.arrCodeText.indexOf( $("#selectCodeExplain").prop('value') );

  c(_index)

  editor.codeExplainText.set( editor.arrCodeExplain[ _index ] );
}

Template.editor.helpers({


    dataRecord: function() {

    	var ID = editor.hack.countryCode;

    	var control = editor.controlType.get();

    	if (control == cNone) return null;

  		if (control == cSound) {

  			editor.controlName.set("SOUND"); 

  			return db.ghSound.find( { cc: ID });
  		}

  		if (control == cText) {

        editor.controlName.set("TEXT"); 

  			return db.ghText.find( { cc: ID });
  		}

  		if (control == cImage) {

        editor.controlName.set("IMAGE"); 

  			return db.ghImage.find( { cc: ID });
  		}

  		if (control == cVideo) {

        editor.controlName.set("VIDEO"); 

      //set this manually when editing (now done with youtube template helper)

      //$(".featuredYouTubeVideo").css("position", "relative");

  			return db.ghVideo.find( { cc: ID });
  		}

  		if (control == cWeb) {

        editor.controlName.set("WEB"); 

  			return db.ghWeb.find( { cc: ID });
  		}

  		if (control == cDebrief) {

        editor.controlName.set("MEME"); 

  			return db.ghMeme.find( { cc: ID });
  		}

    },

    getThisCountryCode: function() {

      return editor.hack.countryCode;
    },
  

    getThisCountryName: function() {

      return editor.hack.getCountryName();
    },

    getEditControlName: function() {

    	var s = editor.controlName.get();
    
    	if (s) return s;

    	return "(no control selected)";
    },

    getImage: function() {

      var ID = editor.recordID.get();

      if (!ID) return null;

      var _rec = db.ghMeme.findOne(ID);

      var _meme = new Meme( _rec, "debrief" );

      _meme.init();

      return _meme.image;    
    },

    getText: function() {

      var ID = editor.recordID.get();

      if (!ID) return null;

      var _rec = db.ghMeme.findOne(ID);

      var _meme = new Meme( _rec, "debrief" );

      _meme.init();

      return _meme.text;  
    },

    getURLButtonText: function() {

      var _type = editor.controlType.get();

      if (_type == cSound || _type == cImage) return "URL";

      if (_type == cVideo) return "YOUTUBE";
    },


    isMedia: function() {

      var _type = editor.controlType.get();

      if (_type == cSound || _type == cVideo || _type == cImage) return true;

      return false;
    },

    isNewRecord: function() {

      if (this._id == editor.newRecordID.get() ) return true;

      return false;
    },

    notText: function() {

      if (editor.controlType.get() != cText) return true;

      return false;
    },

    selectedDataRecord: function() {

  		var type = editor.controlType.get();

  		var ID = editor.recordID.get();

  		if (!ID) return null;

  		var col = db.getCollectionForType(type);

   		if (col) return col.findOne(ID);
    },

    soundIsSelected: function() {

    	if ( editor.controlType.get() == cSound) return true;

    	return false;
    },

    textIsSelected: function() {

      if ( editor.controlType.get() == cText ) return true;
    
    	return false;
    }, 

    debriefIsSelected: function() {

      if ( editor.controlType.get() == cDebrief) return true;

    	return false;
    },

    imageOrWebIsSelected: function() {

      var _type = editor.controlType.get();

      if ( _type == cImage || _type == cWeb ) return true;

      return false;
    },

    isFreeType: function() {

      editor.updateContentFlag.get();

      var _val = this.dt;

      if (!_val) return false;

      if ( editor.arrFreeCode.indexOf( _val.substr(0,3) ) != -1) return true;

      return false;
    },

    otherIsSelected: function() {

    	var _type = editor.controlType.get();

      if ( _type == cVideo && youtube.isFile(this.f)) return false;     

    	if (_type == cImage || _type == cVideo || _type == cWeb) return true;

    	return false;
    },

    youTubeClass: function() {

      //if ( Session.get("sYouTubeOn") ) return "inline";

      if ( youtube.on.get() ) return "inline";

      return "invisible";
    },

    code: function() {

      return editor.getCodes( editor.controlType.get() );
    },

    codeExplainHeader:  function() {

      var s = "Choose a code from the drop-down list to see the explanation.";

      var _type = editor.controlType.get();

      //if (_type == cVideo) s = "Codes are not currently used for " + editor.controlName.get() + " records.";

      if (_type == cWeb) s = "Codes are optional for " + editor.controlName.get() + " records.";

      return s;
    },

    codeTextForOption: function( _index) {

        return editor.arrCodeText[ _index ];
    }, 

    codeTextForValue: function(_rec) {

      if (!_rec.dt) return "";

      if (!_rec.dt.length) return "";

      var _code = _rec.dt;

      var _baseCode = _code.substr(0,3);

      if ( editor.arrFreeCode.indexOf( _baseCode ) != -1) {

          return _rec.dt;
      }

      var _index = -1;

      _index = editor.arrCode.indexOf( _code );

      return editor.arrCodeText[ _index ];
    },

    codeTextForExplain: function(_key ) {

      return editor.arrCodeText[ _key ];
    },

    codeExplain: function() {

      var _type = editor.controlType.get();

      if (_type == cVideo) {

        s = "";
      }
      else {

        s = editor.codeExplainText.get()
      }

      return s;

    },

    selectedValue: function(key, value) {

      if (!value) return "";

      var _baseCode = value.substr(0,3);

      if ( editor.arrFreeCode.indexOf( _baseCode ) != -1) value = _baseCode;

      return editor.arrCode[key] ==  value ? 'selected' : '';

    }

})

Template.editor.events = {

  'click #editorNext' : function(e){

      e.preventDefault();

      hackAdjacentCountry(1);
  },

  'click #editorPrev' : function(e){

      e.preventDefault();

      hackAdjacentCountry(-1);
  },

  'change #selectCodeExplain' : function(event){

    setCodeExplainText();
  },

	'click #addRecord': function() {

      if (editor.controlType.get() == 0) {

        alert("No control type selected.");

        return;
      }

      doSpinner();

    	editor.addThisRecord( editor.hack.countryCode, editor.controlType.get(), function(err, result) {

        editor.recordID.set( result );

        editor.newRecordID.set( result );

        stopSpinner();

      });


    },

  'click #testCountry' : function(evt, template) {

      doSpinner();

      hack.cancelSubs();

      Meteor.setTimeout( function() { game.user.browseCountry( editor.hack.countryCode ) }, 500 );

  }, 

  'click #editFontSizes' : function(evt, template) {

    game.user.mode = uEdit;

    gGameEditor = true;

    gEditSidewallsMode = true;

    hack.initForBrowseEdit( editor.hack.countryCode);

  }, 

  'click #editSound' : function(evt, template) {

    editor.stopEditMedia();

  	editor.controlType.set( cSound );

    setCodeExplainText();
  },

  'click #editText' : function(evt, template) {

    editor.stopEditMedia();

    editor.controlType.set( cText );

    setCodeExplainText();
  },

  'click #editImage' : function(evt, template) {

    editor.stopEditMedia();

    editor.controlType.set( cImage );

    setCodeExplainText();
  },

  'click #editVideo' : function(evt, template) {

    editor.stopEditMedia();

    editor.controlType.set( cVideo );
  },

  'click #editWeb' : function(evt, template) {

    editor.stopEditMedia();

    editor.controlType.set( cWeb );
  },

  'click #editDebrief' : function(evt, template) {

    editor.stopEditMedia();

    editor.controlType.set( cDebrief );
  },

  'click #closeEditor' : function(evt, template) {

    nav.closeEditor();

  },

  'click .dataRow' : function(evt, template) {
  

     editor.recordID.set( evt.target.id );

      if (editor.recordID.get() == editor.newRecordID.get() ) return;

      if (editor.controlType.get() == cVideo) {

        var rec = db.ghVideo.findOne( { _id: editor.recordID.get() } );

        if(!rec) return;
        
        if(!rec.u) return;

        youtube.hide();

        editor.video = new Video( rec.u, editor);

        editor.video.play();
     }

     if (editor.controlType.get() == cSound) {
 
       try {

          var u = db.ghSound.findOne( { _id: editor.recordID.get() } ).u;
       }
       catch(err) {

          return;
       }

        $("#editorSoundPlayer").attr("src", u ) ;

        Meteor.setTimeout( function() { document.getElementById("editorSoundPlayer").play(); }, 250 );
     }

     
  },

  'change .form-Set.dt' : function( evt, template) {

      var _id = evt.target.id;

      var _code = evt.target.value.substr(0,3);

      if ( editor.arrFreeCode.indexOf( _code ) != -1) {

          var sel = "input#" + _id + ".textDTValue";

          $( sel ).val( _code + "X" ); 

          showMessage( "Change the X to a unique number for this type");

          editor.updateContent();      
      }
  },

  'click .deleteRecord' : function(evt, template) {

	   editor.deleteCurrentRecord(evt.target.id, editor.controlType.get());

  },

  'click .updateRecord' : function(evt, template) {

      if (editor.controlType.get() == cVideo) {
      
          var sel = "#" + evt.target.id + ".f";

          editor.video = new Video( $(sel).val(), editor);

editor.video.play();
      
      }

      editor.doUpdateRecord(evt.target.id, editor.hack.countryCode);

  },

  'change #newFileInput': function(event, template) {

    document.getElementById("newFileInput").blur();

    var _ID = editor.newRecordID.get();

    var sel = "input#" + _ID + ".dt";

    var _dt = $(sel).val();

    sel = "input#" + _ID + ".s";

    var _s = $(sel).val();   

    var uploader = editor.getUploader();

    var _file = event.target.files[0];

    uploader.send(_file, function (error, downloadUrl) {

      if (error) {
       
        // Log service detailed response.
        console.log(error);

      }
      else {

        editor.updateURLForNewRecord( downloadUrl, _ID, _dt, _s );

      }
    });

  },

  'click #newTextInput-label': function(event, template) {

      document.getElementById("newTextInput").blur();

      var _val = prompt("Please enter the URL or YouTube ID:");

      if (_val != null) {

          var data = {};

          //For the images, a click on this button will always specify an external URL

          var _type = editor.controlType.get();

          if ( _type == cImage) {

              data["f"] = "(ext)";  //reminds us, when viewing the data table, that the file is external (not on our server)

              data["u"] = _val;  

          }
          else {   //Honestly not sure why both of these fields are getting the same value, but this would be for cSound and cVideo

              data["f"] = _val;

              data["u"] = _val;           
          }


          Meteor.call("updateRecordOnServerWithDataObject", editor.controlType.get(), editor.newRecordID.get(), data, function(err, result) {

              if (err) {

                showMessage(err.reason);
              }
              else {

                editor.newRecordID.set("0");

              }
          });
      }

    },



};


