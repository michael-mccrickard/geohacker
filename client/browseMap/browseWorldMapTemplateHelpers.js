//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************

Template.browseWorldMap.helpers({


  tag: function() {

    if (!display) return;

     return game.ghTag.find( { cc: display.ctl["MAP"].browseWorldMap.selectedCountry.get() });
  },

  continentName: function() { 

    if (!display) return;

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    if (!display) return;

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    if (!display) return;

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    if (!display) return;

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

  },

  labelYCorrection: function() {

    if (!display) return;

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

    display.ctl["MAP"].backupMapToRegion();
  },

  'click #browseContinentIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].backupMapToContinent();
  },

  'click #browseWorldIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].backupMapToWorld();
  },

  'click #browseMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      if (game.user.browseHack.countryCode.length == 0) {

          game.user.goHome();

          return;
      }

      display.feature.resetToPrevious();

      display.mainTemplateReady = false;

      FlowRouter.go("/main");
  },

  'click .imgMapTag': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      display.ctl["MAP"].browseWorldMap.mapTagImage = evt.target.src;
  }
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
    if (!display) return;

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].browseWorldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw() }, 251 );

    }
}
