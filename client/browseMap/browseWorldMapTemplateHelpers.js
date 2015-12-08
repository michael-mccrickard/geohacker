//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************

Template.browseWorldMap.helpers({

  continentName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

    if (game.user.assign.selectedContinent.length) return db.getContinentName( game.user.assign.selectedContinent );

  },

  regionName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );

    if (game.user.assign.selectedRegion.length) return db.getContinentName( game.user.assign.selectedRegion );
  },

  continentIcon: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }

    if (game.user.assign.selectedContinent.length) {

       return game.user.assign.selectedContinent + "_icon.png";     
    }

  },

  regionIcon: function()  { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

    if (game.user.assign.selectedRegion.length) {

       return game.user.assign.selectedRegion + "_icon.jpg";     
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

  mapWidth: function() { return Session.get("gWindowWidth") * 0.89},

  mapHeight: function() { 

    var h = Session.get("gWindowHeight") - display.menuHeight;

    return h * 0.925;

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

      display.feature.clear();

      Router.go("/main");
  }
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].browseWorldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw() }, 251 );

    }
}
