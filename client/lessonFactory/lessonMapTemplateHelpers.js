//*************************************************************************
//              TEMPLATE HELPERS FOR LESSON MAP
//*************************************************************************
//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************

 
Template.lessonMap.rendered = function () {
    
    stopSpinner();

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].finishLessonDraw() }, 251 );

    }
}


Template.lessonMap.helpers({

  countryListItem: function() {

      return game.lesson.mission.items;
    
  },

  countryListItemID: function() {

      return this + "-ListItem";
    
  },

  countryName: function( _code) {

    return db.getCountryName( _code );
  },

  continentName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].lessonMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

  },

  regionName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].lessonMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );
  },

  mapWidth: function() { return Session.get("gWindowWidth") * 0.50},

  mapHeight: function() { 

    var h = Session.get("gWindowHeight") - display.menuHeight;

    return h * 0.98;

  },

  divWidth: function() { return Session.get("gWindowWidth") * 0.45},

  missionName:  function() { return game.lesson.mission.name; }


});


Template.lessonMap.events = {

  'click #lessonMapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3");

      FlowRouter.go("/main");
  },
}

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************


Template.lessonMap.rendered = function () {
  
    stopSpinner();

    if (!display) return;

    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].lessonFinishDraw() }, 251 );

    }
}
