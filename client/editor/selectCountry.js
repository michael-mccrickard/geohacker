var dataMode = true; // new Blaze.ReactiveVar(false);

var editAllMode  =  new Blaze.ReactiveVar(true);

var selRegions = new Blaze.ReactiveVar([]);

var contToEdit = "";

var contButtons = ["#editAsia", "#editAmerica", "#editAfrica", "#editEurope", "#editOceania"];

Session.set("sUpdateEditScreenFlag", true);

Template.selectCountry.rendered = function() {

  stopSpinner();
}


Template.selectCountry.helpers({

    country: function() {

      var flag = Session.get("sUpdateEditScreenFlag");

      var sel = ""

      if ( editAllMode.get() ) return  db.ghC.find( {}, {sort: {n: 1} } );

      var arr = [];

      arr = selRegions.get();

      if (selRegions.get().length > 0) return db.ghC.find( { r: { $in: arr } }, {sort: {n: 1} } );

      return db.ghC.find( {}, {sort: {n: 1} } );

    },

    getCheckedVal: function(val) {

    	if (val == undefined || val == 0) return false;

    	return true;
    },

    globeFile: function() {

        return( getS3FileFromPath( this.g ) );
    }

});

Template.selectCountry.events = {



}

function updateEditScreen() {

  var _val = Session.get("sUpdateEditScreenFlag");

  Meteor.defer( function() {Session.set("sUpdateEditScreenFlag", !_val); });
}

conformButtons = function() {

    setModeButton("#dataMode", dataMode);

    setModeButton("#editAllMode", editAllMode.get() );

    if (contToEdit.length) setContinentButtons(contToEdit);

}

function setModeButton(_which, _val) {

  if (_val) {

    $( _which ).removeClass("menuBarBtnCont");

    $( _which ).addClass("menuBarBtnContSel");
  }
  else {

    $( _which ).removeClass("menuBarBtnContSel");

    $( _which ).addClass("menuBarBtnCont");
  }

} 

function setContinentButtons(_which) {

  if ( contToEdit != "" )  $("#" + contToEdit ).removeClass("menuBarBtnContSel");
  
  contToEdit = _which;

  $("#" + _which ).removeClass("menuBarBtnCont")

  $("#" + _which ).addClass("menuBarBtnContSel");
}

function resetContinentButtons() {

  for (var i = 0; i < contButtons.length; i++) {

     $( contButtons[i] ).removeClass("menuBarBtnContSel")

     $( contButtons[i] ).addClass("menuBarBtnCont");   
  }
}

function updateQuery(_id) {

  editAllMode.set(false);

  setModeButton( "#editAllMode", false);  

  setContinentButtons( _id );
}

Template.selectCountry.events = {

  'click #dataMode' : function(evt, template) {

        if (dataMode == true) {

          dataMode = false;

          setModeButton( "#dataMode", false);

        }
        else { 

          dataMode = true;

          setModeButton( "#dataMode", true);
        }

        updateEditScreen();
   },

  'click #editAllMode' : function(evt, template) {

        if (editAllMode.get() ) {

          editAllMode.set(false);

          setModeButton( "#editAllMode", false);
        }
        else {

          selRegions.set( [] );

          editAllMode.set(true);

          resetContinentButtons();

          setModeButton( "#editAllMode", true);
        }
   },

  'click #editAmerica' : function(evt, template) {

        selRegions.set( ["mam", "nam", "nwsa", "nesa", "ssa","cam"] );

        updateQuery(evt.currentTarget.id);

   },

  'click #editAsia' : function(evt, template) {

        selRegions.set( ["eas", "cas", "seas", "sas", "mea","swas"] );

        updateQuery(evt.currentTarget.id);

   },

  'click #editEurope' : function(evt, template) {

        selRegions.set( ["neu", "eeu", "weu", "bal"] );

        updateQuery(evt.currentTarget.id);
   },

  'click #editAfrica' : function(evt, template) {

        selRegions.set( ["caf", "neaf", "saf", "nwaf"] );

        updateQuery(evt.currentTarget.id);
   },

  'click #editOceania' : function(evt, template) {

        selRegions.set( ["aus", "oce"] );

        updateQuery(evt.currentTarget.id);
   },


  'click .editCountryButton' : function(evt, template) {

  	editor.hack.countryCode = this.c;  

    editor.hack.index = Database.getIndexForCountryCode( editor.hack.countryCode);

  	nav.goAdmin("/editor");
  },

  'click #closeSelectCountry': function (evt, template) {

     nav.closeEditor();
  },

  'click .updateCountryButton': function (evt, template) {

      editor.recordID.set( evt.target.id );

      doUpdateRecord( editor.recordID.get() );

  },

'change input': function(event, template) {

      //we only care about the file and checkbox input

      var _type = $("#" + event.currentTarget.id).attr("type");

      if ( _type != "file") {

        return;
      }

      var _field = event.currentTarget.id.substr(0,1).toLowerCase();

      var _recordID = event.currentTarget.id.substr(1);  //we prefixed a char (B,G,I,F, or P) to the ID in the template to make it a legal HTML element ID

      if (_type == "file") {

          var uploader = editor.countryRecordUploader;

          var _file = event.target.files[0];

          uploader.send(_file, function (error, downloadUrl) {

            if (error) {
             
              // Log service detailed response.
              console.log(error);

            }
            else {

              editor.updateGlobeURL( downloadUrl, _recordID );

            } 
          });     

      } //end if file type
    },


};

function doUpdateRecord() {

    editor.controlType.set( cCountry );

    editor.doUpdateRecord( editor.recordID.get() );
}