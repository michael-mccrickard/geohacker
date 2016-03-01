 

/**************************************************************/
/*              HACK OBJECT         
/**************************************************************/

Hack = function() {

   /********************************************/
  /*            BASIC PROPS        
  /*********************************************/

  this.mode = mNone;

  this.status = null;

  this.countryCode = "";

  this.continentCode = "";

  this.regionCode = "";

  /********************************************/
  /*            MISC PROPS        
  /*********************************************/

  this.debrief = null;


//to do: change this to streamID throughout
  this.messageID = "(not set)";

  this.auto = false;

   /********************************************/
  /*            FUNCTIONS        
  /*********************************************/

    this.startNew = function() {

        display.init(this.countryCode);

        if (this.debrief == null) {

          this.debrief = new Debrief( this );
        }

        this.debrief.init( this.countryCode );

        this.debrief.set( this.debrief.index );

        game.user.assign.resetMap();

        this.mode = mReady;

        game.playMusic();

        display.loadMain();
    };


    this.startNext = function() {

        this.mode = mNone;

        display.feature.clear();    
        
        display.reset();

        Control.playEffect("goMission.mp3");

        this.init();

        FlowRouter.go("/waiting");

    };

    this.initForBrowse = function( _code) {

        this.mode = mBrowse;

        this.countryCode = _code;

        this.continentCode = db.getContinentCodeForCountry( _code );

        this.regionCode = db.getRegionCodeForCountry( _code );

        c( db.getCountryName( _code ) + ' was selected for browsing.');   

        this.subscribeToData( _code );

        FlowRouter.go("/waiting");
    };

    this.init = function() {

        this.auto = false;

        game.hackStartTime = 0;

        game.hackEndTime = 0;

        var rec = null;

        if (game.user.assign.pool.length == 0) {

          alert("You have completed your current mission.  Please choose another mission from the " + game.user.name + " menu.");

          return;
        }

        if (gHackPreselect.length) {

          rec = db.getCountryRec( gHackPreselect );
        }
        else {

          rec = db.getRandomCountryRecForUser( game.user );
        }

        this.countryCode = rec.c;

        this.regionCode = rec.r;

        this.continentCode = db.getContinentCodeForCountry( this.countryCode );      

        this.setMessageID();

        this.subscribeToData( this.countryCode );
      };


    this.subscribeToData = function( _code ) {

        Meteor.call("setCountry", _code );

        Hack.resetDataFlags();

        //****************************************************************
        //                  SUBSCRIBE TO HACK DATA
        //****************************************************************

        Meteor.subscribe("ghImage", function() { Session.set("sImageReady", true ) });

        Meteor.subscribe("ghSound", function() { Session.set("sSoundReady", true ) });

        Meteor.subscribe("ghVideo", function() { Session.set("sVideoReady", true ) });

        Meteor.subscribe("ghWeb", function() { Session.set("sWebReady", true ) });


        Meteor.subscribe("ghText", function() { Session.set("sTextReady", true ) });

        Meteor.subscribe("ghMap", function() { Session.set("sMapReady", true ) });

        Meteor.subscribe("ghDebrief", function() { Session.set("sDebriefReady", true ) });     
    }

    this.autoHack = function() {

      this.auto = true;

      //you can auto-hack at anytime, even before the first clue

      if (game.hackStartTime == 0) game.hackStartTime = new Date().getTime();

      var mapCtl = display.ctl["MAP"];

      var map = mapCtl.worldMap;

      mapCtl.level.set( mlCountry );

      mapCtl.setState( sMapDone );

      map.selectedContinent = this.continentCode;

      map.selectedRegion = this.regionCode;

      map.selectedCountry.set( this.countryCode );

      display.ctl["MAP"].autoFeatured = false;

      display.feature.set("MAP");

    }

    this.startBrowsing = function() {

        display.init( this.countryCode );

        if (this.debrief == null) {

          this.debrief = new Debrief( this );
        }

        this.debrief.init( this.countryCode );

        var map = display.ctl["MAP"].browseWorldMap;

        map.selectedContinent = this.continentCode;

        map.selectedRegion = this.regionCode;

        map.selectedCountry.set( this.countryCode );

        display.ctl["MAP"].level.set( mlCountry );

        display.browse(this.countryCode);

    }

    this.playAnthem = function() {

       var _file = this.getAnthemFile();

       if (display.ctl["SOUND"].getState() == sPlaying ) display.ctl["SOUND"].pauseFeaturedContent();

       Control.playEffect( _file );
    },

    this.playLanguageFile = function() {

       var _file = this.getLanguageFile();

       if (!_file) return;

       if (display.ctl["SOUND"].getState() == sPlaying ) display.ctl["SOUND"].pauseFeaturedContent();

       Control.playEffect( _file );
    },


/**************************************************************/
/*              GETTERS FOR CURRENT COUNTRY PROPERTIES          
/**************************************************************/


    /**************************************************************/
    /*              GETTERS FOR SOUNDS         
    /**************************************************************/

    this.getAnthemFile = function() {

      var rec = db.ghSound.findOne( {'cc':  this.countryCode, 'dt': 'ant' } );

      if (rec) {

        return rec.u;
      }
      else {

          showMessage( "No anthem file found for " + this.getCountryName() );        
      }

    }

    this.getLanguageFile = function() {

      var rec = db.ghSound.findOne( {'cc':  this.countryCode, 'dt': 'lng' } );

      if (rec) {

          return rec.u;        

      }
      else {

          showMessage( "No language file found for " + this.getCountryName() );        
      }

    }


    /**************************************************************/
    /*              GETTERS FOR PICTURES         
    /**************************************************************/


    this.getCapitalPic = function() {

      try {
          var u = db.ghImage.findOne( { cc: this.countryCode, dt: "cap" } ).u;
      }
      catch(err) {

          showMessage( "No capital image file found images for " + this.getCountryName() );

          return null;
      }

      return u;
    }

    this.getFlagPic = function() {

      try {
          var u = db.ghImage.findOne( { cc: this.countryCode, dt: "flg" } ).u;
      }
      catch(err) {

          showMessage( "No flag file found for " + this.getCountryName() );

          return null;
      }

      return u;

    }

    this.getHeadquartersPic = function( _code ) {

      try {

          var u = db.ghImage.findOne( { cc: this.countryCode, dt: _code } ).u;
      }
      catch(err) {

          var rec = db.ghWeb.findOne( { cc: this.countryCode, dt: _code } );

          if (!rec) {

            showMessage( "No hqt file found in images or webs for " + this.getCountryName() );

            return null;          
          }
          else {

             u = rec.u;
          }

      }

      return u;

    }

    this.getLeaderPic = function() {

      try {

          var u = db.ghImage.findOne( { cc: this.countryCode, dt: "ldr" } ).u;
      }
      catch(err) {

          showMessage( "No leader file found in images for " + this.getCountryName() );

          return "";
      }

      return u;
    }

    this.getCustomPic = function(_code) {

      try {

          var u = db.ghImage.findOne( { cc: this.countryCode, dt: _code } ).u;
      }
      catch(err) {

          var rec = db.ghWeb.findOne( { cc: this.countryCode, dt: _code } );

          if (!rec) {

            showMessage( "No custom pic (code " + _code + ") file found in images or webs for " + this.getCountryName() );

            return null;          
          }
          else {

             u = rec.u;
          }
      }

      return u;
    }

    this.getCountryMapURL = function() {

      var _cc = this.countryCode;

      var rec = db.ghImage.findOne( { cc: _cc, dt: { $in: ["cmp","map"] } } );

      if (rec) {

         return rec.u;
      }

      else {

        showMessage("No map image found for " + this.getCountryName());
      }
    }


    this.getCountryMapSource = function() {

      var rec = db.getCountryRec( this.countryCode );

      return rec.s;
    }

    /**************************************************************/
    /*              GETTERS FOR TEXT         
    /**************************************************************/


    this.getCapitalName = function() {

      return db.ghText.findOne( { cc: this.countryCode, dt: "cap" } ).f;
    }

    this.getContinentName = function() {

      var _code = db.getContinentCodeForCountry( this.countryCode ) ;

      return db.getContinentRec( _code ).n;
    }

    this.getCountryName = function() {

      var rec = db.getCountryRec( this.countryCode );

      return rec.n;
    }

    this.getCountryFilename = function() {

      var _name = this.getCountryName();

      var name = _name.replaceAll(" ","_");

      return name.toLowerCase();
    }

    this.getLeaderName = function() {

      return db.ghText.findOne( { cc: this.countryCode, dt: "ldr" } ).f;
    }

    this.getLeaderType = function() {

      return db.ghDebrief.findOne( { cc: this.countryCode, dt: "ldr" } ).t;
    }

    this.getRegionName = function() {

      var _code = db.getRegionCodeForCountry( this.countryCode ) ;

      return db.getRegionRec( _code ).n;
    }

    /**************************************************************/
    /*              MISC FUNCTIONS   
    /**************************************************************/

    this.setMessageID = function() {

        var id = '#';

        var num = parseInt( Math.random() * 10000 ) ;

        for (var i = 1; i <= 4; i++) {

            var charCode = Math.floor( Math.random() * ( 90 - 65 + 1) + 65);

            id = id + String.fromCharCode(charCode);
        }

        id = id + num;

        this.messageID = id;
    }


}

Hack.resetDataFlags = function() {

      Session.set("sImageReady", false );

      Session.set("sSoundReady", false );

      Session.set("sTextReady", false );

      Session.set("sVideoReady", false );

      Session.set("sWebReady", false );

      Session.set("sDebriefReady", false );

      Session.set("sMapReady", false );

}

Tracker.autorun( function(comp) {

  if (Session.get("sImageReady") && 
      Session.get("sTextReady") && 
      Session.get("sVideoReady") && 
      Session.get("sWebReady") && 
      Session.get("sSoundReady") && 
      Session.get("sDebriefReady") && 
      Session.get("sMapReady")

      ) {

          console.log("hack data ready")

          Hack.resetDataFlags();

          if (game.user.mode == uBrowse) {

              hack.startBrowsing();

          }
          else {

            if (hack === undefined) return;

            hack.startNew();           
          }

          return; 
  } 

  console.log("hack data not ready")

});  







