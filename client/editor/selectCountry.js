dataMode = true; // new Blaze.ReactiveVar(false);

var editAllMode  =  new Blaze.ReactiveVar(true);

var selRegions = new Blaze.ReactiveVar([]);

contToEdit = "";

var contButtons = ["#editAsia", "#editAmerica", "#editAfrica", "#editEurope", "#editOceania"];

Session.set("sUpdateEditScreenFlag", true);



Template.selectCountry.helpers({

    country: function() {

      var flag = Session.get("sUpdateEditScreenFlag");

      var sel = "";

      if (dataMode) {

          sel = 1;
      }
      else {
          
          sel = 0;  
      }

      if ( editAllMode.get() ) return  db.ghC.find( { d: sel }, {sort: {n: 1} } );

      var arr = [];

      arr = selRegions.get();

      if (selRegions.get().length > 0) return db.ghC.find( { d: sel, r: { $in: arr } }, {sort: {n: 1} } );

      return db.ghC.find( { d: sel }, {sort: {n: 1} } );

    },

    getCheckedVal: function(val) {

    	if (val == undefined || val == 0) return false;

    	return true;
    }

})

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

    editor.saveScroll();

  	editor.hack.countryCode = this.c;  

  	FlowRouter.go("/editor");
  },

  'click #closeSelectCountry': function (evt, template) {

     editor.saveScroll();

     editor.hack.mode = mNone;

  	 FlowRouter.go("/main");
  
     Meteor.setTimeout( function() { display.redraw(); }, 500);
  },

  'click .updateCountryButton': function (evt, template) {

      editor.recordID = evt.target.id;

      doUpdateRecord( editor.recordID );

  },

};

function doUpdateRecord() {

      editor.controlType = cCountry;

    editor.doUpdateRecord(editor.recordID);
}