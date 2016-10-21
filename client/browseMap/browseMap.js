


//Modify this to work for browseMap only

BrowseMap = function() {

	 this.name = "browseMap"; 

   this.state = new Blaze.ReactiveVar(0);

    //reactive level property:  mlWorld, mlContinent, mlRegion, mlCountry

    this.level = new Blaze.ReactiveVar( mlWorld );

	  this.worldMap = new BrowseWorldMap( this );

    this.init = function() {

      this.index = new Blaze.ReactiveVar(0);

      this.state = new Blaze.ReactiveVar(0);
    },

    this.go = function() {

        Meteor.defer( function() { Control.playEffect("mapButton.mp3"); });

        display.worldMapTemplateReady = false;

        FlowRouter.go("/browseWorldMap");
    }

    this.getState = function() {

      return this.state.get();
    }

    this.setState = function(_val) {

      this.state.set( _val );
    }

    this.backupMap = function() {

        this.worldMap.selectedCountry.set("");

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


    this.finishDraw = function() {

        if (this.level.get() == mlWorld) {

          $("#regionIcon").css("opacity", 0);

          $("#continentIcon").css("opacity", 0);

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

    this.finishDraw = function() {

        if ($("#browseDivMap").length == 0) return;

        var left = $("#browseDivMap").position().left + $("#browseDivMap").outerWidth() - $("#browseMapClose").outerWidth() - 5;

        $("#browseMapClose").css("left", left + "px");

        if (this.level.get() == mlWorld) {

          $("#browseRegionIcon").css("opacity", 0);

          $("#browseContinentIcon").css("opacity", 0);

          return;

        }
        
        if (this.level.get() >= mlRegion ) this.browseFadeInIcons("both");

        if (this.level.get() == mlContinent) {

          $("#browseRegionIcon").css("opacity", 0); 

          this.browseFadeInIcons("continentOnly");

        }

        this.worldMap.updateContent();
    }

    this.browseFadeInIcons = function(_which) {

      if ( $("#browseContinentIcon").css("opacity") == "0" ) fadeIn( "browseContinentIcon" );

      if (_which == "both") Meteor.setTimeout( function() { fadeIn("browseRegionIcon")}, 500);

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


}//end Map constructor


