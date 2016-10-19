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

      //set this manually when editing

      $(".featuredYouTubeVideo").css("position", "relative");

  			return db.ghVideo.find( { cc: ID });
  		}

  		if (control == cWeb) {

        editor.controlName.set("WEB"); 

  			return db.ghWeb.find( { cc: ID });
  		}

  		if (control == cDebrief) {

        editor.controlName.set("DEBRIEF"); 

  			return db.ghDebrief.find( { cc: ID });
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

        var deb = new Debrief( editor.hack );

        deb.initForEditor( this.dt );

        return deb.image;    
    },

    getText: function() {

        var deb = new Debrief( editor.hack );

        deb.initForEditor( this.dt );

        return deb.text;
    },

    getURLButtonText: function() {

      var _type = editor.controlType.get();

      if (_type == cSound) return "URL";

      if (_type == cVideo) return "YOUTUBE";
    },


    isMedia: function() {

      var _type = editor.controlType.get();

      if (_type == cSound || _type == cVideo) return true;

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

    otherIsSelected: function() {

    	var _type = editor.controlType.get();

      if ( _type == cVideo && Control.isYouTubeURL(this.f)) return false;     

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

    codeTextFor: function( _key) {

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

//c("key=" + key + "  value =" + value)

//c("key2=" + editor.arrCode[key] + "  value2 =" + value)

      return editor.arrCode[key] ==  value ? 'selected' : '';

    }

})

Template.editor.events = {

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

      game.user.browseCountry( editor.hack.countryCode );

  }, 


  'click #editSound' : function(evt, template) {

    Control.stopEditMedia();

  	editor.controlType.set( cSound );

    setCodeExplainText();
  },

  'click #editText' : function(evt, template) {

    Control.stopEditMedia();

    editor.controlType.set( cText );

    setCodeExplainText();
  },

  'click #editImage' : function(evt, template) {

    Control.stopEditMedia();

    editor.controlType.set( cImage );

    setCodeExplainText();
  },

  'click #editVideo' : function(evt, template) {

    Control.stopEditMedia();

    editor.controlType.set( cVideo );
  },

  'click #editWeb' : function(evt, template) {

    Control.stopEditMedia();

    editor.controlType.set( cWeb );
  },

  'click #editDebrief' : function(evt, template) {

    Control.stopEditMedia();

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

        Session.set("sYouTubeOn", false);

        editor.videoFile = rec.u;

        if (Control.isYouTubeURL(rec.u)) {

          if (youTubeLoaded == false) {
            
            c("calling YT.load() in editor")
            
            YT.load();
          }
          else {

          c("loading YT vid by ID in editor")
            
            ytplayer.loadVideoById( rec.u );            
          }

         Session.set("sYouTubeOn", true);

        }

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

  'click .deleteRecord' : function(evt, template) {

	   editor.deleteCurrentRecord(evt.target.id, editor.controlType.get());

  },

  'click .updateRecord' : function(evt, template) {

      if (editor.controlType.get() == cVideo) {
      
          var sel = "#" + evt.target.id + ".f";

          editor.videoFile = $(sel).val();
      
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

          data["f"] = _val;

          data["u"] = _val;

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


