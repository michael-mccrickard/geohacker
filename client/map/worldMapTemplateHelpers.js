//*************************************************************************
//              TEMPLATE HELPERS FOR THE GAME MAP
//*************************************************************************

var checkSelectedArea_sound = "checkSelectedArea.mp3"

var mapButtonFontWidth = 10;

var buttonWidth = 150;

var mapButtonTotalPadding = 36;

var mapHeightFactor = 0.85;

var bottomStripFactor = 49 / 670;

//*************************************************************************
//              RENDERED CALLBACK
//*************************************************************************

 
Template.worldMap.rendered = function () {
    
    stopSpinner();

    if (hacker.worldMapTemplateReady == false) {

      hacker.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { hackMap.worldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { hackMap.finishDraw() }, 251 );

    }

    //fix the position of the dropping letter effect for Chrome's quirky self

    if ( whichBrowser().substr(0,6) == "Chrome" ||  whichBrowser().substr(0,6) == "Safari" ) $(".letterDropH1").css("margin-top", "-158px");

    if ( whichBrowser().substr(0,6) == "Safari" ) $(".letterDropH1").css("margin-top", "-98px");
}


//*************************************************************************
//              HELPERS AND EVENTS
//*************************************************************************

Template.worldMap.helpers({

  countryIsHacked: function() {

    if (hackMap.getState() >= sCountryOK ) return true;

    return false;
  },

  welcomeText: function() {

    if (hack.welcomeAgentIsChief) return "ME AGAIN.  GOOD JOB!";

    return "YOU HACKED MY COUNTRY!"
  },

/*
  welcomeTextLower: function() {

    return "WELCOME TO GEOHACKER " + hack.getCountryName();
  },
*/

  continentName: function() { 

    var level = hackMap.level.get();

    var name = "";

    var map =  hackMap.worldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

    if (game.user.assign.selectedContinent.length) return db.getContinentName( game.user.assign.selectedContinent );

  },

  regionName: function() { 

    var level = hackMap.level.get();

    var name = "";

    var map =  hackMap.worldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );

    if (game.user.assign.selectedRegion.length) return db.getContinentName( game.user.assign.selectedRegion );
  },

  continentIcon: function() { 

    var level = hackMap.level.get();

    var name = "";

    var map =  hackMap.worldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }

    if (game.user.assign.selectedContinent.length) {

       return game.user.assign.selectedContinent + "_icon.png";     
    }

  },

  regionIcon: function()  { 

    var level = hackMap.level.get();

    var name = "";

    var map =  hackMap.worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

    if (game.user.assign.selectedRegion.length) {

       return game.user.assign.selectedRegion + "_icon.jpg";     
    }

  },

  labelYCorrection: function() {

    var level = hackMap.level.get();

    var map =  hackMap.worldMap;

    if (map.selectedRegion.length) {

        var rec = db.ghR.find( {c: map.selectedRegion } ).fetch();

        if (rec[0].lc < 0) {

          var height = $("#regionIcon").height();

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

  },

  mapMessageColor: function() {

    var state = hackMap.getState();

    if (state == sContinentOK || state == sRegionOK || state == sCountryOK) return "greenText";

    if (state == sContinentBad || state == sRegionBad || state == sCountryBad) return "redText";   

    return "";

  },

  getClassFor: function(_which) {

    var hidingClass = "hidden";   

    var state = hackMap.getState();

    if (_which == "ok") {

      //for all of these states, show the OK button

      if (state == sContinentFeatured || state == sRegionFeatured || state == sIDContinent || state == sIDRegion || state == sIDCountry) {   

          return "";
      }

      if (state == sContinentOK || state == sContinentBad || state == sRegionOK || state == sRegionBad || state == sCountryBad || state == sMapDone) {

          return "";
      }
      
      //otherwise hide it

      return hidingClass;
    }

    //for the close button, we hide it if countryOK, b/c that means we are doing the hackDone sequence
    //then the button will appear when the state reaches sMapDone

    if (_which == "close") {

      if (state >= sCountryOK) return hidingClass;

      return ""; 
    }


  },

  showMapSpinner: function() {

    return (Session.get("mapSpinnerOn"));
  },

});


Template.worldMap.events = {

  'click #regionIcon': function (evt, template) {

    var _state = hackMap.getState();

    //it's problematic for the user to start backing the map up
    //before they have seen the full ending sequence

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    hackMap.backupMapToRegion();
  },

  'click #continentIcon': function (evt, template) {

    var _state = hackMap.getState();

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    hackMap.backupMapToContinent();
  },

  'click #worldIcon': function (evt, template) {

    var _state = hackMap.getState();

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    hackMap.backupMapToWorld();
  },

  'click #mapOK': function (evt, template) {

      if (hackMap.getState() != sMapDone) Control.playEffect("new_feedback.mp3")

      Meteor.setTimeout( function() { closeOutMap(); }, 100 );
  },

  'click #mapClose': function (evt, template) {

      Control.playEffect("new_feedback.mp3")

      Meteor.setTimeout( function() { closeOutMap(); }, 100 );
  },

  'click #divMap': function (evt, template) {
  
    //to do: lock this part out unless user has dev status

    if (evt.ctrlKey || evt.shiftKey) {

        updateLabelPosition(evt);
    }
  },

};

function closeOutMap() {

    var state = hackMap.getState();

    //user guessed the country correctly, we're done ...

    if (state == sMapDone) {

        hack.debrief.set( hack.debrief.index );

        FlowRouter.go("/debrief");

        return;
    }

    //If doScan (which calls the loader object) loads the map control (map clue), then clicking the map button
    //essentially simulates a correct guess on the next area.  Thus we need to set the state of the map
    //correctly for the user's next visit to the map

    if (state == sContinentFeatured || state == sRegionFeatured ) {

        if (state == sContinentFeatured) hackMap.setState( sIDRegion );

        if (state == sRegionFeatured) hackMap.setState( sIDCountry );

        FlowRouter.go("/main");

        return;
    }   

    //if the user backed up after an identification or a map feature, then
    // we need to correct the map state

    hackMap.worldMap.checkMapState();
    
    //All other states call for some update to the state itself
    //and (usually) to the map level.  Then we return to the main screen ...

    hackMap.worldMap.nextMapState();  

}



//map debug hacks

//go = function() { hackMap.preloadCountryMap( hack.getCountryFilename().toLowerCase() );  showMessage("resuming sequence");}

updateLabel = function() {

    var _state = hackMap.getState();

    if ( _state == sMapDone) {

        updateLabelPosition(2);
    }
    else {

        updateLabelPosition(1);
    }

}


dm = function() {

  var ctl = hackMap;

  var s = "map.level = " + ctl.level.get() + "\n\r";

  s = s + "map.state = " + ctl.getState("MAP") + "\n\r";

  var map = hackMap.worldMap;

  s = s + "selectedContinent = " + map.selectedContinent + "\n\r";

  s = s + "selectedRegion = " + map.selectedRegion + "\n\r";

  s = s + "selectedCountry = " + map.selectedCountry.get() + "\n\r";

  return s;
}