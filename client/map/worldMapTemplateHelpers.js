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
  
    if (display.worldMapTemplateReady == false) {

      display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { display.ctl["MAP"].worldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { display.ctl["MAP"].finishDraw() }, 251 );

    }
}


//*************************************************************************
//              HELPERS AND EVENTS
//*************************************************************************

Template.worldMap.helpers({

  continentName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].worldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

    if (game.user.assign.selectedContinent.length) return db.getContinentName( game.user.assign.selectedContinent );

  },

  regionName: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].worldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );

    if (game.user.assign.selectedRegion.length) return db.getContinentName( game.user.assign.selectedRegion );
  },

  continentIcon: function() { 

    var level = display.ctl["MAP"].level.get();

    var name = "";

    var map =  display.ctl["MAP"].worldMap;

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

    var map =  display.ctl["MAP"].worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

    if (game.user.assign.selectedRegion.length) {

       return game.user.assign.selectedRegion + "_icon.jpg";     
    }

  },

  labelYCorrection: function() {

    var level = display.ctl["MAP"].level.get();

    var map =  display.ctl["MAP"].worldMap;

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

    var state = display.ctl["MAP"].getState();

    if (state == sContinentOK || state == sRegionOK || state == sCountryOK) return "greenText";

    if (state == sContinentBad || state == sRegionBad || state == sCountryBad) return "redText";   

    return "";

  },

  getClassFor: function(_which) {

    var hidingClass = "hidden";   

    var state = display.ctl["MAP"].getState();

    if (_which == "ok") {

      if (state == sContinentFeatured || state == sRegionFeatured) {

          return "";
      }

      if (state == sContinentOK || state == sContinentBad || state == sRegionOK || state == sRegionBad || state == sCountryBad || state == sMapDone) {

          return "";
      }
      
      return hidingClass;
    }

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

    var _state = display.ctl["MAP"].getState();

    //it's problematic for the user to start backing the map up
    //before they have seen the full ending sequence

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].backupMapToRegion();
  },

  'click #continentIcon': function (evt, template) {

    var _state = display.ctl["MAP"].getState();

    //it's problematic for the user to start backing the map up
    //before they have seen the full ending sequence

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].backupMapToContinent();
  },

  'click #worldIcon': function (evt, template) {

    var _state = display.ctl["MAP"].getState();

    //it's problematic for the user to start backing the map up
    //before they have seen the full ending sequence

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    display.ctl["MAP"].backupMapToWorld();
  },

  'click #mapOK': function (evt, template) {

      if (display.ctl["MAP"].getState() != sMapDone) Control.playEffect("new_feedback.mp3")

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
  } 

};

function closeOutMap() {

    //make sure the main template is flagged to redraw ...

    display.mainTemplateReady = false;

    var state = display.ctl["MAP"].getState();

    //user guessed the country correctly, we're done ...

    if (state == sMapDone) {

        display.feature.clear();

        hack.debrief.set( hack.debrief.index );

        FlowRouter.go("/debrief");

        return;
    }

    //If doScan (scanner button) loads a map control, then clicking the map control takes us
    //automatically to the map screen (essentially simulating a correct guess on the next area)

    if (state == sContinentFeatured || state == sRegionFeatured ) {

        if (state == sContinentFeatured) display.ctl["MAP"].setState( sIDRegion );

        if (state == sRegionFeatured) display.ctl["MAP"].setState( sIDCountry );

        display.feature.resetToPrevious();

        FlowRouter.go("/main");

        return;
    }   

    //We revert back to showing the previous feature (possibly the auto-featured map clue)

    display.feature.resetToPrevious();


    //if the user backed up after an identification or a map feature, then
    // we need to correct the map state

    display.ctl["MAP"].worldMap.checkMapState();
    
    //All other states call for some update to the state itself
    //and (usually) to the map level.  Then we return to the main screen ...

    display.ctl["MAP"].worldMap.nextMapState();  

}

//map editing hacks

updateLabelPosition = function(evt) {

    var totalWidth = deriveInt( $("#divMap").css("width") ) ;

    var totalHeight = deriveInt( $("#divMap").css("height") ) ;

    var x = evt.offsetX / totalWidth;

    var y = evt.offsetY / totalHeight;

    var ctl = display.ctl["MAP"];

    var map = ctl.worldMap;

    var _level = ctl.level.get();

    var selectedContinent = map.selectedContinent;

    var selectedRegion = map.selectedRegion;

    var selectedCountry = map.selectedCountry;

    if (_level == mlContinent) {

        var rec = db.getContinentRec(selectedContinent);

        db.ghZ.update( rec._id, { $set: { xl: x, yl : y } } );

        console.log("continent " + selectedContinent + " label updated to " + x + ", " + y);

        map.labelMapObject();
    }

    if (_level == mlRegion) {

        var rec = db.getRegionRec(selectedRegion);

        db.ghR.update( rec._id, { $set: { xl: x, yl : y } } );

        console.log("region " + selectedRegion + " label updated to " + x + ", " + y);

        map.labelMapObject();
    }

    if (_level == mlCountry) {

        var rec = db.getCountryRec(selectedCountry);

        db.ghC.update( rec._id, { $set: { xl: x, yl : y } } );

        console.log("country " + selectedCountry + " label updated to " + x + ", " + y);

        map.labelMapObject();
    }

}

//used by updateLabelPos above

function deriveInt(_s) {

  _s = _s.substr(0, _s.length-2);

  return parseInt(_s);
}


//map debug hacks

dm = function() {

  var ctl = display.ctl["MAP"];

  var s = "map.level = " + ctl.level.get() + "\n\r";

  s = s + "map.state = " + ctl.getState("MAP") + "\n\r";

  var map = display.ctl["MAP"].worldMap;

  s = s + "selectedContinent = " + map.selectedContinent + "\n\r";

  s = s + "selectedRegion = " + map.selectedRegion + "\n\r";

  s = s + "selectedCountry = " + map.selectedCountry + "\n\r";

  return s;
}