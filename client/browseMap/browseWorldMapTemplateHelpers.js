//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************

Template.browseWorldMap.helpers({

  continentName: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

  },

  labelYCorrection: function() {

    var level = game.display.ctl["MAP"].level.get();

    var map =  game.display.ctl["MAP"].browseWorldMap;

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

    var h = Session.get("gWindowHeight") - game.display.menuHeight;

    return h * 0.98;

  }
});


Template.browseWorldMap.events = {

  'click #browseRegionIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToRegion();
  },

  'click #browseContinentIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToContinent();
  },

  'click #browseWorldIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToWorld();
  },

  'click #browseMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      game.display.feature.clear();

      FlowRouter.go("/main");
  },

  'click .imgMapTag': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      game.display.ctl["MAP"].browseWorldMap.mapTagImage = evt.target.src;
  }
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
    if (game.display.worldMapTemplateReady == false) {

      game.display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { game.display.ctl["MAP"].browseWorldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { game.display.ctl["MAP"].browseFinishDraw() }, 251 );

    }
}
