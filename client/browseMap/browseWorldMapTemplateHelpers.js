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

    var updateFlag = display.ctl["MAP"].browseWorldMap.updateFlag.get();

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var updateFlag = display.ctl["MAP"].browseWorldMap.updateFlag.get();

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  continentIcon: function() { 

    var updateFlag = display.ctl["MAP"].browseWorldMap.updateFlag.get();

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }
  },

  regionIcon: function()  { 

    var updateFlag = display.ctl["MAP"].browseWorldMap.updateFlag.get();

    var map =  display.ctl["MAP"].browseWorldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

  },

  labelYCorrection: function() {

    var level = display.ctl["MAP"].browseWorldMap.updateFlag.get();

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
  
    stopSpinner();

    if (!display) return;

    if (game.user.mode == uBrowseCountry) {

        game.user.mode = uBrowseMap;

        display.ctl["MAP"].level.set(mlRegion);

        Meteor.setTimeout( function() { 

          var  d = display.ctl["MAP"].browseWorldMap; 

          d.doThisMap( d.mapLevel, d.drawLevel, d.detailLevel, d.selectedContinent, d.selectedRegion); 

          d.doLabelCountry( d.selectedCountry.get() );

        }, 250 );

        Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw() }, 251 );

        return;
    }

    game.user.mode = uBrowseMap;

    Meteor.setTimeout( function() { display.ctl["MAP"].browseWorldMap.doCurrentMap() }, 250 );

    Meteor.setTimeout( function() { display.ctl["MAP"].browseFinishDraw() }, 251 );


}
