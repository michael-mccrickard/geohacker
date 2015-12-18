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
  
    if (game.display.worldMapTemplateReady == false) {

      game.display.worldMapTemplateReady = true;

      Meteor.setTimeout( function() { game.display.ctl["MAP"].worldMap.doCurrentMap() }, 250 );

      Meteor.setTimeout( function() { game.display.ctl["MAP"].finishDraw() }, 251 );

    }
}


//*************************************************************************
//              HELPERS AND EVENTS
//*************************************************************************

Template.worldMap.helpers({

  continentName: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].worldMap;

    if (map.selectedContinent.length) return db.getContinentName( map.selectedContinent );

    if (game.user.assign.selectedContinent.length) return db.getContinentName( game.user.assign.selectedContinent );

  },

  regionName: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].worldMap;

    if (map.selectedRegion.length) return db.getRegionName( map.selectedRegion );

    if (game.user.assign.selectedRegion.length) return db.getContinentName( game.user.assign.selectedRegion );
  },

  continentIcon: function() { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].worldMap;

    if (map.selectedContinent.length) {

      return map.selectedContinent + "_icon.png";
    }

    if (game.user.assign.selectedContinent.length) {

       return game.user.assign.selectedContinent + "_icon.png";     
    }

  },

  regionIcon: function()  { 

    var level = game.display.ctl["MAP"].level.get();

    var name = "";

    var map =  game.display.ctl["MAP"].worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.jpg";
    }

    if (game.user.assign.selectedRegion.length) {

       return game.user.assign.selectedRegion + "_icon.jpg";     
    }

  },

  labelYCorrection: function() {

    var level = game.display.ctl["MAP"].level.get();

    var map =  game.display.ctl["MAP"].worldMap;

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

    var h = Session.get("gWindowHeight") - game.display.menuHeight;

    return h * 0.925;

  },

  mapMessageColor: function() {

    var state = game.display.ctl["MAP"].getState();

    if (state == sContinentOK || state == sRegionOK || state == sCountryOK) return "greenText";

    if (state == sContinentBad || state == sRegionBad || state == sCountryBad) return "redText";   

    return "";

  },

  getClassFor: function(_which) {

    var hidingClass = "hidden";   

    var state = game.display.ctl["MAP"].getState();

    if (_which == "ok") {

      //for all of these states, show the OK button

      if (state == sContinentFeatured || state == sRegionFeatured) {

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

    var _state = game.display.ctl["MAP"].getState();

    //it's problematic for the user to start backing the map up
    //before they have seen the full ending sequence

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToRegion();
  },

  'click #continentIcon': function (evt, template) {

    var _state = game.display.ctl["MAP"].getState();

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToContinent();
  },

  'click #worldIcon': function (evt, template) {

    var _state = game.display.ctl["MAP"].getState();

    if (_state == sMapDone) return;

    Control.playEffect("mapBackup.mp3");

    game.display.ctl["MAP"].backupMapToWorld();
  },

  'click #mapOK': function (evt, template) {

      if (game.display.ctl["MAP"].getState() != sMapDone) Control.playEffect("new_feedback.mp3")

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

    //make sure the main template is flagged to redraw ...

    game.display.mainTemplateReady = false;

    var state = game.display.ctl["MAP"].getState();

    //user guessed the country correctly, we're done ...

    if (state == sMapDone) {

        game.display.feature.clear();

        hack.debrief.set( hack.debrief.index );

        FlowRouter.go("/debrief");

        return;
    }

    //If doScan (which calls the loader object) loads the map control (map clue), then clicking the map button
    //essentially simulates a correct guess on the next area.  Thus we need to set the state of the map
    //correctly for the user's next visit to the map

    if (state == sContinentFeatured || state == sRegionFeatured ) {

        if (state == sContinentFeatured) game.display.ctl["MAP"].setState( sIDRegion );

        if (state == sRegionFeatured) game.display.ctl["MAP"].setState( sIDCountry );

        game.display.feature.resetToPrevious();

        FlowRouter.go("/main");

        return;
    }   

    //We revert back to showing the previous feature (possibly the auto-featured map clue)

    game.display.feature.resetToPrevious();


    //if the user backed up after an identification or a map feature, then
    // we need to correct the map state

    game.display.ctl["MAP"].worldMap.checkMapState();
    
    //All other states call for some update to the state itself
    //and (usually) to the map level.  Then we return to the main screen ...

    game.display.ctl["MAP"].worldMap.nextMapState();  

}

//map editing hacks

updateLabelPosition = function(_which) {

    //var totalWidth = deriveInt( $("#divMap").css("width") ) ;

    //var totalHeight = deriveInt( $("#divMap").css("height") ) ;

    var totalWidth = game.display.ctl["MAP"].worldMap.map.divRealWidth;

    var totalHeight =  game.display.ctl["MAP"].worldMap.map.divRealHeight;

    var x = game.display.ctl["MAP"].worldMap.map.allLabels[0].x;

    var y = game.display.ctl["MAP"].worldMap.map.allLabels[0].y;

    x = ( x ) / totalWidth;

    y = ( y ) / totalHeight;

    var _level = game.display.ctl["MAP"].level.get();

    var selectedContinent = game.display.ctl["MAP"].worldMap.selectedContinent;

    var selectedRegion = game.display.ctl["MAP"].worldMap.selectedRegion;

    var selectedCountry = game.display.ctl["MAP"].worldMap.selectedCountry;

    var xName = "xl";

    var yName = "yl";

    if ( _which == 2 ) {

      xName = "xl2";
      yName = "yl2";
    }

//db.updateRecord2 = function (_type, field, ID, value) 

    if (_level == mlContinent) {

        var rec = db.getContinentRec(selectedContinent);

        db.updateRecord2( cContinent, "xl", rec._id, x);

        db.updateRecord2( cContinent, "yl", rec._id, y);

        console.log("continent " + selectedContinent + " label updated to " + x + ", " + y);
    }

    if (_level == mlRegion) {

        var rec = db.getRegionRec(selectedRegion);

        db.updateRecord2( cRegion, "xl", rec._id, x);

        db.updateRecord2( cRegion, "yl", rec._id, y);

        console.log("region " + selectedRegion + " label updated to " + x + ", " + y);
    }

    if (_level == mlCountry) {

        var rec = db.getCountryRec(selectedCountry);

        db.updateRecord2( cCountry, xName, rec._id, x);

        db.updateRecord2( cCountry, yName, rec._id, y);

        console.log("country " + "(" + _which + ") " + selectedCountry + " label updated to " + x + ", " + y);
    }

    game.display.ctl["MAP"].worldMap.map.clearLabels();

    if ( game.display.ctl["MAP"].getState() == sMapDone) {

        Meteor.defer( function() { game.display.ctl["MAP"].worldMap.labelMapObject( 14, "yellow" ); } );
    }
    else {

        Meteor.defer( function() { game.display.ctl["MAP"].worldMap.labelMapObject(); } );      
    }

    

}

//used by updateLabelPos above

function deriveInt(_s) {

  _s = _s.substr(0, _s.length-2);

  return parseInt(_s);
}


//map debug hacks

editLabels = false;

go = function() { game.display.ctl["MAP"].preloadCountryMap( hack.getCountryFilename().toLowerCase() );  c("resuming sequence")}

updateLabel = function() {

    var _state = game.display.ctl["MAP"].getState();

    if ( _state == sMapDone) {

        updateLabelPosition(2);
    }
    else {

        updateLabelPosition(1);
    }

}


dm = function() {

  var ctl = game.display.ctl["MAP"];

  var s = "map.level = " + ctl.level.get() + "\n\r";

  s = s + "map.state = " + ctl.getState("MAP") + "\n\r";

  var map = game.display.ctl["MAP"].worldMap;

  s = s + "selectedContinent = " + map.selectedContinent + "\n\r";

  s = s + "selectedRegion = " + map.selectedRegion + "\n\r";

  s = s + "selectedCountry = " + map.selectedCountry + "\n\r";

  return s;
}