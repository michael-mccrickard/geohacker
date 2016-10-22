//*************************************************************************
//              TEMPLATE HELPERS FOR BROWSE WORLD MAP
//*************************************************************************



Template.browseWorldMap.helpers({
  
  tag: function() {

     return db.ghTag.find( { cc: browseMap.worldMap.selectedCountry.get() });
  },

  getDebriefType: function() {

      return ( db.getDebriefType( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  getText: function() {

      return ( db.getTagText( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  getTagURL: function() {

      return ( db.getTagURL( this, browseMap.worldMap.selectedCountry.get() ) );
  },

  continentName: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    var updateFlag = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

  },

  labelYCorrection: function() {

    var level = browseMap.worldMap.updateFlag.get();

    var map =  browseMap.worldMap;

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

    return h * 0.98;

  }
});


Template.browseWorldMap.events = {

  'click #browseRegionIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlRegion );

    d.doLabelRegion( d.selectedRegion )
  },

  'click #browseContinentIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlContinent );

    d.labelAllRegions();
  },

  'click #browseWorldIcon': function (evt, template) {

    Control.playEffect("mapBackup.mp3");

    var d = browseMap.worldMap;

    d.doClearButton(0);

    d.backupMap( mlWorld );
  },

  'click #browseMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      //we are returning from a trip to the map (off the home screen)

      if (game.user.mode == uBrowseMap) {

          //countryCode wasn't set, so we must have been browsing

          FlowRouter.go("/home")

          game.user.goHome();

          return;
      }
  },

  'click .imgMapTag': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      browseMap.worldMap.mapTagImage = evt.target.src;
  },

  'click #tagClear': function (evt, template) {

      var _ticket = game.user.getTicket( browseMap.worldMap.selectedCountry.get() );

      _ticket.tag.length = 0;

      db.updateUserHacks();

      browseMap.worldMap.doCurrentMap();
  }
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.browseWorldMap.rendered = function () {
  
    stopSpinner();

    if (!display) return;

    //get ready to show the country on the map

    if (game.user.mode == uBrowseCountry) {

        browseMap.worldMap.mapLevel = mlCountry;
    }

    game.user.mode = uBrowseMap;

    Meteor.setTimeout( function() { browseMap.worldMap.doCurrentMap() }, 250 );

    Meteor.setTimeout( function() { browseMap.finishDraw() }, 251 );


}
