HackMap = function() {

	   this.name = "hackMap";

    //reactive level property:  mlWorld, mlContinent, mlRegion, mlCountry

    this.level = new Blaze.ReactiveVar( mlWorld );

	  this.worldMap = new WorldMap( this );

    this.state = new Blaze.ReactiveVar(0);

    this.deniedSound = "wrong_3.mp3";

    this.backupSound = "mapBackup.mp3";

    this.getState = function() {

      return this.state.get();
    }

    this.init = function() {

      this.index = new Blaze.ReactiveVar(0);

      this.state = new Blaze.ReactiveVar(0);
    }

    this.go = function() {

    //(this part is a little convoluted b/c we formerly immediately showed the featured content
    //when a control was featured by the loader (random selection) and we also handled the auto-featured map clues differently

        stopSpinner();

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
      
      if (_state == sContinentBad) {

          s= "Geo-location of continent failed.";
      
          this.worldMap.nextMapState( true );

      }

      if (_state == sContinentOK) s= "Continent correctly identified!";

      if (_state == sContinentFeatured) s= "Continent geo-located: " + hack.getContinentName();


      if (_state == sIDRegion) s= "Click a region ...";

      if (_state == sTestRegion) s= "Testing map coordinates ...";
      
      if (_state == sRegionBad) {

        s= "Geo-location of region failed.";

        this.worldMap.nextMapState( true );

      }

      if (_state == sRegionOK) s= "Region correctly identified!";

      if (_state == sRegionFeatured) s= "Region geo-located: " + hack.getRegionName();

      if (_state == sReIDContinent) {

        s = "Stream is coming from " +  hack.getContinentName();

      }

       if (_state == sReIDRegion) {

        s = "Stream is coming from " +  hack.getRegionName();

      }     


      if (_state == sIDCountry) s= "Click a country ...";

      //if (_state == sTestCountry) s= "Testing map coordinates ...";
      
      if (_state == sCountryBad) {

        s = "Geo-location of country failed.";
        
        this.worldMap.nextMapState( true );

this.worldMap.mapCtl.level.set( mlCountry );
      }

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


    this.fadeInIcons = function(_which) {

      if ( $("#continentIcon").css("opacity") == "0" ) fadeIn( "continentIcon" );

      if (_which == "both" /* && $("#regionIcon").css("opacity") == "0" */) Meteor.setTimeout( function() { fadeIn("regionIcon")}, 500);

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

    this.playDeniedSound = function() {

      display.playEffect2( this.deniedSound );
    }

    this.playBackupSound = function() {

      display.playEffect( this.backupSound );
    }


    //for the end-of-hack scenario when we flash the country and show a more detailed map of it

    this.preloadCountryMap = function(_name) {

        var _rec = db.ghImage.find( { cc: hack.countryCode, dt: "cmp" } );

        if ( !_rec) _rec = db.ghImage.find( { cc: hack.countryCode, dt: "map" } );

        $("#imgCountryMap").attr("src", _rec.u);   


        imagesLoaded( document.querySelector('#preloadCountryMap'), function( instance ) {

          hackMap.worldMap.imageSrc = display.getImageFromFile( _rec.u );

          hackMap.worldMap.mapLoaded = true;

          if (hackMap.worldMap.animationDone) hackMap.worldMap.hackDone4(); 

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


HackMap.seaFontHeightRatio = 12/950;