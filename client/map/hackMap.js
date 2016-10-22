HackMap = function() {

	   this.name = "hackMap";

    //reactive level property:  mlWorld, mlContinent, mlRegion, mlCountry

    this.level = new Blaze.ReactiveVar( mlWorld );

	  this.worldMap = new WorldMap( this );

    this.state = new Blaze.ReactiveVar(0);

    this.getState = function() {

      return this.state.get();
    }

    this.setState = function(_val) {

      this.state.set( _val );
    }

    this.init = function() {

      this.index = new Blaze.ReactiveVar(0);

      this.state = new Blaze.ReactiveVar(0);
    }

    this.go = function() {

    //(this part is a little convoluted b/c we formerly immediately showed the featured content
    //when a control was featured by the loader (random selection) and we also handled the auto-featured map clues differently

        Meteor.defer( function() { display.playEffect("mapButton.mp3"); });

        hacker.worldMapTemplateReady = false;

        FlowRouter.go("/worldMap");
    }

    //********************************************************************
    //        STATE, STATUS AND HEADLINES
    //********************************************************************


    this.setStateOnly = function( _state ) {

        this.state.set( _state );    
    }

    this.setState = function( _state ) {

      this.state.set( _state );

      var s = "";

      if (_state == sIDContinent) s= "Click a continent ...";

      if (_state == sTestContinent) s= "Testing map coordinates ...";
      
      if (_state == sContinentBad) s= "Geo-location of continent failed.";

      if (_state == sContinentOK) s= "Continent correctly identified!";

      if (_state == sContinentFeatured) s= "Continent geo-located: " + hack.getContinentName();


      if (_state == sIDRegion) s= "Click a region ...";

      if (_state == sTestRegion) s= "Testing map coordinates ...";
      
      if (_state == sRegionBad) s= "Geo-location of region failed.";

      if (_state == sRegionOK) s= "Region correctly identified!";

      if (_state == sRegionFeatured) s= "Region geo-located: " + hack.getRegionName();


      if (_state == sIDCountry) s= "Click a country ...";

      //if (_state == sTestCountry) s= "Testing map coordinates ...";
      
      if (_state == sCountryBad) s = "Geo-location of country failed.";

      if (_state == sCountryOK) s = "Country correctly identified!";


      Session.set("gMapStatus", s);

      hacker.mapStatus.setAndType();
    }

    this.setMapStatus = function( _text ) {

      hacker.mapStatus.setAndShow( _text );

    } 

    this.isIDStatus = function() {

      var _state = this.getState();

      if (_state == sIDContinent || _state == sIDRegion || _state == sIDCountry) return true;

      return false;
    }

    //********************************************************************
    //        NAVIGATION
    //********************************************************************

    this.backupMap = function() {

        this.worldMap.backupMap();
    }

    this.backupMapToRegion = function() {

        this.level.set( mlCountry );

        this.backupMap();
    }

    this.backupMapToContinent = function() {

        this.level.set( mlRegion );

        this.backupMap();
    }

    this.backupMapToWorld = function() {

        this.level.set( mlContinent );

        this.backupMap();
    }   

    //********************************************************************
    //        DRAWING AND FORMATTING
    //********************************************************************

    this.finishDraw = function() {

        if (this.level.get() == mlWorld) {

          $("#regionIcon").css("opacity", 0);

          $("#continentIcon").css("opacity", 0);

          return;

        }

        //if we're autohacking this one, we need to show both

        if (hack.auto) {

          this.fadeInIcons("both");

          return;
        }

        //Otherwise if we're at country level then just leave the icons as is 

        if (this.level.get() == mlCountry) return;
        

        if (game.user.assign.level == mlRegion || this.level.get() >= mlRegion ) this.fadeInIcons("both");

        if (game.user.assign.level == mlContinent || this.level.get() == mlContinent) {

          $("#regionIcon").css("opacity", 0); 

          this.fadeInIcons("continentOnly");

        }
    }

    this.lessonFinishDraw = function() {

      c( "map.lessonFinishDraw");

      //position any additional elements here
    }

    this.fadeInIcons = function(_which) {

      if ( $("#continentIcon").css("opacity") == "0" ) fadeIn( "continentIcon" );

      if (_which == "both" && $("#regionIcon").css("opacity") == "0" ) Meteor.setTimeout( function() { fadeIn("regionIcon")}, 500);

    }

    this.disableButton = function() {

        Meteor.setTimeout( function() { $("#mapButton").addClass("faded"), 250 });
    }

    this.enableButton = function() {

        Meteor.setTimeout( function() { $("#mapButton").removeClass("faded"), 250 });
    }

    //********************************************************************
    //        MISCELLANEOUS
    //********************************************************************

    //for the end-of-hack scenario when we flash the country and show a more detailed map of it

    this.preloadCountryMap = function(_name) {

        $("#imgCountryMap").attr("src", _name + "_map.jpg");   


        imagesLoaded( document.querySelector('#preloadCountryMap'), function( instance ) {

          hackMap.worldMap.imageSrc = display.getImageFromFile( _name + "_map.jpg" );

          hackMap.worldMap.mapLoaded = true;

          if (hackMap.worldMap.animatonDone) hackMap.worldMap.hackDone4(); 

        });

    }

    this.reset = function() {

      this.level.set(mlWorld);

      this.state.set( sIDContinent );
    }

    //some functions that would normally just be in the worldMap object are in here (map.js)
    //because that object is already huge

    this.resetSelections = function() {

      this.worldMap.mapObjectClicked = ''; 

      this.worldMap.selectedContinent = '';

      this.worldMap.selectedRegion = '';

      this.worldMap.selectedCountry.set('');
    }

    this.setContinent = function( _code ) {

      this.worldMap.selectedContinent = _code;
    }


    this.setRegion = function( _code ) {

      this.worldMap.selectedRegion = _code;
    }

    this.getCountryObject = function( _dp, _code) {

      var _arr = _dp.areas;

      for (var i = 0; i < _arr.length; i++) {

        if (_arr[i].id == _code) return _arr[i];
      
      }

      return null;
    }


}//end HackMap constructor
