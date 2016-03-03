//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************



Template.browseWorldMap.helpers({
  
  tag: function() {

     return db.ghTag.find( { cc: display.ctl["MAP"].browseWorldMap.selectedCountry.get() });
  },

  getDebriefType: function() {

      return ( db.getDebriefType( this, display.ctl["MAP"].browseWorldMap.selectedCountry.get() ) );
  },

  getText: function() {

      return ( db.getTagText( this, display.ctl["MAP"].browseWorldMap.selectedCountry.get() ) );
  },

  getTagURL: function() {

      return ( db.getTagURL( this, display.ctl["MAP"].browseWorldMap.selectedCountry.get() ) );
  },

  continentName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

  },

  labelYCorrection: function() {

    var level = display.ctl["MAP"].level.get();

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

        var rec = db.ghR.find( {c: map.selectedRegion } ).fetch();

        if (rec[0].lc < 0) {

          var height = $("#browseRegionIcon").height();

          var correction = (rec[0].lc * height) / 100;

          return (correction + "px");
        }
        else {

          return "0px";
        }
      }
  },

  mapWidth: function() { return Session.get("gWindowWidth") * 0.81},

  mapHeight: function() { 

    if (!display) return;

    var h = Session.get("gWindowHeight") - display.menuHeight;

    return h * 0.98;

  }
});


Template.browseWorldMap.events = {

  'click #browseRegionIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].browseWorldMap.doClearButton(0);

    display.ctl["MAP"].backupMapToRegion();
  },

  'click #browseContinentIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].browseWorldMap.doClearButton(0);

    display.ctl["MAP"].backupMapToContinent();
  },

  'click #browseWorldIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].browseWorldMap.doClearButton(0);

    display.ctl["MAP"].backupMapToWorld();
  },

  'click #browseMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      if (game.user.browseHack.countryCode.length == 0) {

          game.user.goHome();

          return;
      }

      display.feature.resetToPrevious();

//      display.mainTemplateReady = false;

      FlowRouter.go("/main");
  },

  'click .imgMapTag': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      display.ctl["MAP"].browseWorldMap.mapTagImage = evt.target.src;
  },

  'click #tagClear': function (evt, template) {

      var _ticket = game.user.getTicket( display.ctl["MAP"].browseWorldMap.selectedCountry.get() );

      _ticket.tag.length = 0;

      db.updateUserHacks();

      display.ctl["MAP"].browseWorldMap.doCurrentMap();
  }
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
    stopWait();

    if (!display) return;

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].browseWorldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw() }, 251 );

    }
}
