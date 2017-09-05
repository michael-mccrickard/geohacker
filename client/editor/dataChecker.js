
var basicMode  =  new Blaze.ReactiveVar(true);

var otherMode = new Blaze.ReactiveVar(false);

var editAllMode  =  new Blaze.ReactiveVar(true);

selRegions = new Blaze.ReactiveVar([]);

var contToEdit = "";

var contButtons = ["#editAsia", "#editAmerica", "#editAfrica", "#editEurope", "#editOceania"];

Session.set("sUpdateEditScreenFlag", true);

function clearMode() {

    basicMode.set( false );

    otherMode.set( false );

    $("#basic").addClass("menuBarBtnCont");

    $("#basic").removeClass("menuBarBtnContSel");   

    $("#other").addClass("menuBarBtnCont");

    $("#other").removeClass("menuBarBtnContSel");   
}

function setMode( _which ) {

    $("#" + _which).addClass("menuBarBtnContSel"); 

    if (_which == "basic") basicMode.set(true);

    if (_which == "other") otherMode.set(true);   
}

Template.dataChecker.rendered = function() {

  stopSpinner();
}

Template.dataChecker.helpers({

    modeIsBasic: function() {

      return basicMode.get();
    },

    modeIsOther: function() {

      return otherMode.get();
    },

    dataReady: function() {

       return FlowRouter.subsReady();
    },

    country: function() {

      var flag = Session.get("sUpdateEditScreenFlag");

      if ( editAllMode.get() ) return  db.ghC.find( {}, {sort: {n: 1} } );

      var arr = [];

      arr = selRegions.get();

      if (selRegions.get().length > 0) return db.ghC.find( { r: { $in: arr } }, {sort: {n: 1} } );

      return  db.ghC.find( {}, {sort: {n: 1} } );

    },

    getCheckedVal: function( _which ) {

      var res = false;

    	if (_which == "capImage") res = db.ghImage.find( { cc: this.c, dt: "cap" } ).fetch().length;

      if (_which == "capText") res = db.ghText.find( { cc: this.c, dt: "cap" } ).fetch().length;

      if (_which == "ldrImage") res = db.ghImage.find( { cc: this.c, dt: "ldr" } ).fetch().length;

      if (_which == "ldrText") res = db.ghText.find( { cc: this.c, dt: "ldr" } ).fetch().length;

      if (_which == "cmpImage") res = db.ghImage.find( { cc: this.c, dt: { $in: ["cmp","map"] } } ).fetch().length;

      if (_which == "rmpImage") res = db.ghImage.find( { cc: this.c, dt: { $in: ["rmp","map"] } } ).fetch().length;

      if (_which == "flgImage") res = db.ghImage.find( { cc: this.c, dt: "flg" } ).fetch().length;

      if (_which == "lngSound") res = db.ghSound.find( { cc: this.c, dt: "lng" } ).fetch().length;

      if (_which == "lngDebrief") res = db.ghMeme.find( { cc: this.c, dt: { $in: ["lng_o","lng_om"] } } ).fetch().length;

      if (_which == "antSound") res = db.ghSound.find( { cc: this.c, dt: "ant" } ).fetch().length;

      if (_which == "agent") res = Meteor.users.find( { 'profile.cc': this.c } ).fetch().length;

      if (res) return true;

      return false;
    },

    getCount: function( _which ) {

      var res = 0;

      if (_which == "debrief") res = db.ghMeme.find( { cc: this.c } ).fetch().length;

      if (_which == "image") res = db.ghImage.find( { cc: this.c } ).fetch().length;

      if (_which == "sound") res = db.ghSound.find( { cc: this.c } ).fetch().length;

      if (_which == "text") res = db.ghText.find( { cc: this.c } ).fetch().length;

      if (_which == "web") res = db.ghWeb.find( { cc: this.c } ).fetch().length;

      if (_which == "video") res = db.ghVideo.find( { cc: this.c } ).fetch().length;

      return res;
    },

})

Template.dataChecker.events = {

  'click .editCountryButton' : function(evt, template) {

    editor.hack.countryCode = this.c;  

    nav.goAdmin("/editor");
  },

  'click #closeDataChecker' : function(evt, template) {

     nav.closeEditor();

  },

  'click #basic' : function(evt, template) {

     clearMode();

     setMode("basic");
  },

  'click #other' : function(evt, template) {

     clearMode();

     setMode("other");
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
}

function resetContinentButtons() {

  for (var i = 0; i < contButtons.length; i++) {

     $( contButtons[i] ).removeClass("menuBarBtnContSel")

     $( contButtons[i] ).addClass("menuBarBtnCont");   
  }
}

function setContinentButtons(_which) {

  if ( contToEdit != "" )  $("#" + contToEdit ).removeClass("menuBarBtnContSel");
  
  contToEdit = _which;

  $("#" + _which ).removeClass("menuBarBtnCont")

  $("#" + _which ).addClass("menuBarBtnContSel");
}


function updateQuery(_id) {

  editAllMode.set(false);

  setModeButton( "#editAllMode", false);  

  setContinentButtons( _id );
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
