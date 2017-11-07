//*************************************************************************
//              TEMPLATE HELPERS FOR THE GAME MAP
//*************************************************************************

var checkSelectedArea_sound = "checkSelectedArea.mp3"

var mapButtonFontWidth = 10;

var buttonWidth = 150;

var mapButtonTotalPadding = 36;

var mapHeightFactor = 0.85;

var bottomStripFactor = 49 / 670;

var fadedOpacity = "0.75";

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

  worldIconOpacity: function() { 

    hacker.updateFlag.get();

    var map =  hackMap.worldMap;

    if (game.user.assign.level == mlWorld) {

      if (hackMap.worldMap.selectedContinent != hack.continentCode) {

        return "1";
      }
    }

    return fadedOpacity;
  },

  countryIsHacked: function() {

    if (hackMap.getState() >= sCountryOK ) return true;

    return false;
  },

  welcomeText: function() {

    if (hack.welcomeAgentIsChief) return "ME AGAIN.  GOOD JOB!";

    return "YOU HACKED MY COUNTRY!"
  },

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

    hacker.updateFlag.get();

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

  continentIconOpacity: function() { 

    hacker.updateFlag.get();

    var map = hackMap.worldMap;

    if (map.selectedRegion == hack.regionCode) {

      if (hackMap.level.get() == mlContinent || hackMap.level.get() == mlRegion ) {

          return fadedOpacity;
      }

     }
  
    return "1";
  },

  regionIcon: function()  { 

    hacker.updateFlag.get();

    var level = hackMap.level.get();

    var name = "";

    var map = hackMap.worldMap;

    if (map.selectedRegion.length) {

      return map.selectedRegion + "_icon.png";
    }

    if (game.user.assign.selectedRegion.length) {

       return game.user.assign.selectedRegion + "_icon.png";     
    }

  },

  regionIconOpacity: function() { 
  
    hacker.updateFlag.get();

    var map = hackMap.worldMap;
  
    if (map.selectedRegion == hack.regionCode) {

      if (hackMap.level.get() == mlRegion) {

          return fadedOpacity;
      }
      
    }
    return "1";
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

  mapWidth: function() { return Session.get("gWindowWidth") * 0.89 },

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

    if (_state >= sCountryOK) return;

    if (hackMap.level.get() == mlCountry) {

       if (hackMap.worldMap.selectedCountry != hack.countryCode) {

          hackMap.playBackupSound();

          hackMap.backupMapToRegion();         

          return;
      }
    }


    if (hackMap.worldMap.selectedRegion == hack.regionCode) {

        if (hackMap.level.get() == mlRegion) {

          hackMap.playDeniedSound();

          hacker.mapStatus.setThisAndType("Stream is coming from " + db.getRegionName( hack.regionCode) );

          return;
        }
    }
    else {

        hacker.mapStatus.setThisAndType("Stream is not coming from " + db.getRegionName( hackMap.worldMap.selectedRegion ) );

        hackMap.playBackupSound();

        hackMap.backupMapToContinent();
    }

  },

  'click #continentIcon': function (evt, template) {

    var _state = hackMap.getState();

    if (_state >= sCountryOK) return;

    if (hackMap.worldMap.selectedRegion == hack.regionCode) {

        if (hackMap.level.get() == mlCountry && hackMap.worldMap.selectedCountry != hack.countryCode) {

            hackMap.playBackupSound();

            hackMap.backupMapToRegion();

            return;
        }

        hackMap.playDeniedSound();

        hacker.mapStatus.setThisAndType("Stream is coming from " + db.getRegionName( hack.regionCode) );

        return;
    }

    if (hackMap.worldMap.selectedContinent != hack.continentCode) {

        hacker.mapStatus.setThisAndType("Stream is not coming from " + db.getContinentName( hackMap.worldMap.selectedContinent ) );

        hackMap.playBackupSound();

        hackMap.backupMapToWorld();

        return;
    }


    hackMap.playBackupSound();

    hackMap.backupMapToContinent();
  },

  'click #worldIcon': function (evt, template) {

    var _state = hackMap.getState();

    if (_state >= sCountryOK) return;

    if (hackMap.worldMap.selectedRegion == hack.regionCode) {

        if (hackMap.level.get() == mlCountry && hackMap.worldMap.selectedCountry != hack.countryCode) {

            hackMap.playBackupSound();

            hackMap.backupMapToRegion();

            return;
        }

        hackMap.playDeniedSound();

        hacker.mapStatus.setThisAndType("Stream is coming from " + db.getRegionName( hack.regionCode) );

        return;
    }

    if (hackMap.worldMap.selectedContinent == hack.continentCode) {

      hackMap.playDeniedSound();

      hacker.mapStatus.setThisAndType("Stream is coming from " + db.getContinentName( hack.continentCode ) );

      return;
    }



    hackMap.playBackupSound();

    hackMap.backupMapToWorld();
  },

  'click #mapOK': function (evt, template) {

      if (hackMap.getState() != sMapDone) display.playEffect("new_feedback.mp3")

      Meteor.setTimeout( function() { closeOutMap(); }, 100 );
  },

  'click #mapClose': function (evt, template) {

      display.playEffect("new_feedback.mp3")

      Meteor.setTimeout( function() { closeOutMap(); }, 100 );
  },

  'click #divMap': function (evt, template) {
  
    //to do: lock this part out unless user has dev status

    if (evt.ctrlKey || evt.shiftKey) {

        //updateLabelPosition(evt);
    
        putLabel( evt );
    }
  },

};

function closeOutMap() {

    var state = hackMap.getState();

    //user guessed the country correctly, we're done ...

    if (state == sMapDone) {

        hacker.setDebrief();

        hacker.debrief.show();

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

function putLabel(ev) {


      ev.preventDefault();

      var map = hackMap.worldMap.map;

      var x = 0;
      var y = 0;

    if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
         
      x = ev.layerX;
      y = ev.layerY;
    }
    else {

      x = ev.offsetX;
      y = ev.offsetY;
    }

    var _rot = 0;


    var _fontSize = HackMap.seaFontHeightRatio * $(window).height();

    var _name = prompt("Ocean / sea full name?");

    hackMap.worldMap.map.addLabel(x, y, _name, "middle", _fontSize, "yellow");


    var _rec = db.ghSea.findOne( { n: _name } );


    if (!_rec) {

        alert("No sea record found for " + _name);

        return;
    }

     //var x = map.allLabels[0].x;

     // var y = map.allLabels[0].y;

      var loc = map.stageXYToCoordinates(x, y);

      var _long = loc.longitude;

      var _lat = loc.latitude; 

      var _obj = { x: _long, y: _lat };

      if (_rec.r) _obj.r = _rec.r;

      var _level = hackMap.level.get();

      if (_level == mlWorld) db.updateRecord2( cSea, "world", _rec._id, _obj);

      if (_level == mlContinent) db.updateRecord2( cSea, hackMap.worldMap.selectedContinent, _rec._id, _obj);

      if (_level == mlRegion) db.updateRecord2( cSea, hackMap.worldMap.selectedRegion, _rec._id, _obj);

      db.updateRecord2( cSea, "s", _rec._id, _fontSize);

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