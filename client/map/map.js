ghMap = function() {

	this.name = "MAP";

    this.iconPic = "newGlobeIconYellow.png";
    
    this.scanningPic = "newGlobeIconGreen.png";   

    //reactive level property:  mlWorld, mlContinent, mlRegion, mlCountry

    this.level = new Blaze.ReactiveVar( mlWorld );

	  this.worldMap = new WorldMap( this );

    this.browseWorldMap = new BrowseWorldMap( this );

    this.timerID = 0;

    this.autoFeatured = false;


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
      
      if (_state == sCountryBad) s= "Geo-location of country failed.";

      if (_state == sCountryOK) s= "Country correctly identified!";


      if (_state == sMapDone) s= "Message traced to " + hack.getCountryName() + ".";

      Session.set("gMapStatus", s);
      
      var url = FlowRouter.current().path;

      if (url == '/worldMap') display.mapStatus.setAndType();
    },

    this.isIDStatus = function() {

      var _state = this.getState();

      if (_state == sIDContinent || _state == sIDRegion || _state == sIDCountry) return true;

      return false;
    },

    this.backupMap = function() {

        if (hack.mode == mBrowse) {

          this.browseWorldMap.backupMap();

          return;
        }

        this.worldMap.backupMap();
    },

    this.backupMapToRegion = function() {

        this.level.set( mlCountry );

        this.backupMap();
    },

    this.backupMapToContinent = function() {

        this.level.set( mlRegion );

        this.backupMap();
    },

    this.backupMapToWorld = function() {

        this.level.set( mlContinent );

        this.backupMap();
    },   

    this.blinkButton = function() {

       $("#mapButton").attr("src", "./newGlobeIconGreen.png");

      this.timerID = Meteor.setInterval( function() { display.ctl["MAP"].doNormal(); }, 2000)

    },   

    this.clearFeature = function() {

       display.feature.displayMessage.set( false );  

       display.feature.setBackground( sIcon );
    },

    this.clearTimer = function() {

       if (this.timerID != 0) {

        Meteor.clearInterval( this.timerID );

        this.timerID = 0;
      }

       $("#mapButton").attr("src", "./newGlobeIconYellow.png");
    }

    this.disableButton = function() {

        Meteor.setTimeout( function() { $("#mapButton").addClass("faded"), 250 });
    }


    this.draw = function() {

      //it's as if the user has just finished hacking this one
      
      if (hack.mode == mBrowse) {

        display.worldMapTemplateReady = false;

        FlowRouter.go("/browseWorldMap");

        return;

      }

    //When the map is featured (as a clue; automatically), 
    //the template detects it and puts the text content
    //on the screen, so we only have to switch the message variable on
    //and blink the map button.
    //The map doesn't get shown until the user clicks the MAP button.

      if (this.autoFeatured) {

        display.feature.displayMessage.set( true );

        display.blinkMapButton();

        //by flipping this back to false, the user's click will take them to the map

        this.autoFeatured = false;
      }
      else {

        Meteor.defer( function() { Control.playEffect("mapButton.mp3"); });

        //... the map is not autofeatured, so that means the user
        //clicked the map button to go there

        display.worldMapTemplateReady = false;

        FlowRouter.go("/worldMap");
      }
    },

    this.doGreen = function() {

        $("#mapButton").attr("src", "./newGlobeIconGreen.png");

    },

    this.doNormal = function() {

        $("#mapButton").attr("src", "./newGlobeIconYellow.png");

        Meteor.setTimeout( function() { display.ctl["MAP"].doGreen(); }, 500);    
    },

    this.enableButton = function() {

        Meteor.setTimeout( function() { $("#mapButton").removeClass("faded"), 250 } );
    }

    this.hasNextItem = function() {

      return false;
    },

    this.hasPrevItem = function() {

      return false;
    },

    this.init = function() {

      this.index = new Blaze.ReactiveVar(0);

      this.state = new Blaze.ReactiveVar(0);
    },

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

      if (_which == "both" && $("#regionIcon").css("opacity") == "0" ) Meteor.setTimeout( function() { fadeIn("regionIcon")}, 500);

    }

    this.browseFinishDraw = function() {

        if (this.level.get() == mlWorld) {

          $("#browseRegionIcon").css("opacity", 0);

          $("#browseContinentIcon").css("opacity", 0);

          return;

        }
        
        if (game.user.assign.level == mlRegion || this.level.get() >= mlRegion ) this.browseFadeInIcons("both");

        if (game.user.assign.level == mlContinent || this.level.get() == mlContinent) {

          $("#browseRegionIcon").css("opacity", 0); 

          this.browseFadeInIcons("continentOnly");

        }
    }

    this.browseFadeInIcons = function(_which) {

      if ( $("#browseContinentIcon").css("opacity") == "0" ) fadeIn( "browseContinentIcon" );

      if (_which == "both") Meteor.setTimeout( function() { fadeIn("browseRegionIcon")}, 500);

    }

    this.getTextContent = function() {

      return "GEO-LOCATION DATA INTERCEPTED.  CLICK THE MAP BUTTON TO VIEW.";
    },

    this.preloadCountryMap = function(_name) {

        $("#imgCountryMap").attr("src", _name + "_map.jpg");           

        imagesLoaded( document.querySelector('#preloadCountryMap'), function( instance ) {

          Meteor.setTimeout( function() { display.ctl["MAP"].worldMap.hackDone() }, 2500 );

           Meteor.setTimeout( function() { Control.playEffect( "new_debrief.mp3" ) }, 3750 );          

        });
    }

    this.reset = function() {

      this.level.set(mlWorld);

      this.state.set( sIDContinent );
    }

    this.resetSelections = function() {

      this.worldMap.mapObjectClicked = ''; 

      this.worldMap.selectedContinent = '';

      this.worldMap.selectedRegion = '';

      this.worldMap.selectedCountry = '';
    }

    this.setContinent = function( _code ) {

      this.worldMap.selectedContinent = _code;
    }


    this.setRegion = function( _code ) {

      this.worldMap.selectedRegion = _code;
    }


}//end Map constructor

ghMap.prototype = Control;