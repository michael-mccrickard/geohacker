Template.editor.rendered = function() {

  display.switchToEditor();
}

Template.editor.helpers({

    dataRecord: function() {

    	var ID = hack.countryCode;

    	var control = editor.controlType;

    	if (control == cNone) return null;

  		if (control == cSound) {

  			editor.controlName = "SOUND"; 

  			return db.ghS.find( { cc: ID });
  		}

  		if (control == cText) {

        editor.controlName = "TEXT"; 

  			return db.ghT.find( { cc: ID });
  		}

  		if (control == cImage) {

        editor.controlName = "IMAGE"; 

  			return db.ghI.find( { cc: ID });
  		}

  		if (control == cVideo) {

        editor.controlName = "VIDEO"; 

  			return db.ghV.find( { cc: ID });
  		}

  		if (control == cWeb) {

        editor.controlName = "WEB"; 

  			return db.ghW.find( { cc: ID });
  		}

  		if (control == cDebrief) {

        editor.controlName = "DEBRIEF"; 

  			return db.ghD.find( { cc: ID });
  		}

    },

    getEditControlName: function() {

    	var s = editor.controlName;
    
    	if (s) return s;

    	return "(no control selected)";
    },

    getNonYouTubeFile: function(_file) {

      if (_file) return Control.getNonYouTubeFile( _file ); 

      return _file;
    },

    getImage: function() {

        var deb = new Debrief();

        deb.initForEditor( this.dt );

        return deb.image;
    },

    getText: function() {

        var deb = new Debrief();

        deb.initForEditor( this.dt );

        return deb.text;
    },

    selectedDataRecord: function() {

  		var type = editor.controlType;

  		var ID = editor.recordID;

  		if (!ID) return null;

  		var col = db.getCollectionForType(type);

   		if (col) return col.findOne(ID);
    },

    soundIsSelected: function() {

    	if ( editor.controlType == cSound ) return true;

    	return false;
    },

    textIsSelected: function() {

      if ( editor.controlType == cText ) return true;
    
    	return false;
    }, 

    debriefIsSelected: function() {

      if ( editor.controlType == cDebrief) return true;

    	return false;
    },

    otherIsSelected: function() {

    	var _type = editor.controlType;

      if ( _type == cVideo && Control.isYouTubeURL(this.f)) return false;     

    	if (_type == cImage || _type == cVideo || _type == cWeb) return true;

    	return false;
    },

    youTubeClass: function() {

      if ( Session.get("sYouTubeOn") ) return "inline";

      return "invisible";
    },

})

Template.editor.events = {

	'click #addRecord': function() {

      if (editor.controlType == 0) {

        alert("No control type selected.");

        return;
      }

    	var recID = editor.addThisRecord(hack.countryCode, editor.controlType);
   
    	editor.recordID = recID;
    },


  'click #editSound' : function(evt, template) {

    stopVideo();

  	editor.controlType = cSound;
  },

  'click #editText' : function(evt, template) {

    stopVideo();

  	editor.controlType = cText;
  },

  'click #editImage' : function(evt, template) {

    stopVideo();

  	editor.controlType = cImage;
  },

  'click #editVideo' : function(evt, template) {

  	editor.controlType = cVideo;
  },

  'click #editWeb' : function(evt, template) {

    stopVideo();

  	editor.controlType = cWeb;
  },

  'click #editDebrief' : function(evt, template) {

    stopVideo();

	   editor.controlType = cDebrief;
  },

  'click #closeEditor' : function(evt, template) {

    stopVideo();

    hack.mode = mNone;

	  FlowRouter.go("/selectCountry");
  },

  'click .dataRow' : function(evt, template) {
  

     editor.recordID = evt.target.id;

     if (editor.controlType == cVideo) {

        var rec = db.ghV.findOne( { _id: editor.recordID } );

        if(!rec) return;
        
        if(!rec.f) return;

        Session.set("sYouTubeOn", false);

        if (Control.isYouTubeURL(rec.f)) {

          editor.videoFile = rec.f;

          if (editor.youTubeLoaded == false) {

            YT.load();
          }
          else {

            ytplayer.loadVideoById( rec.f );            
          }

         Session.set("sYouTubeOn", true);

        }
     }

     if (editor.controlType == cSound) {

       if (document.getElementById("editorSoundPlayer") == null) return;

        var rec = db.ghS.findOne( { _id: editor.recordID } );

        $("#editorSoundPlayer").attr("src", rec.f);

        document.getElementById("editorSoundPlayer").play();
     }

     
  },

  'click .deleteRecord' : function(evt, template) {

	   editor.deleteCurrentRecord(evt.target.id, editor.controlType);

  },

  'click .updateRecord' : function(evt, template) {

      if (editor.controlType == cVideo) {
      
          var sel = "#" + evt.target.id + ".f";

          editor.videoFile = $(sel).val();
      
      }

      editor.doUpdateRecord(evt.target.id);

  },

};

function stopVideo() {

      if (ytplayer) ytplayer.pauseVideo();

    Session.set("sYouTubeOn", false);
}
