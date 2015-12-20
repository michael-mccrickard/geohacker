 

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

        game.user.assign.resetMap();

        this.mode = mReady;

        game.playMusic();

        display.loadMain();
    };


    this.startNewFromMenu = function() {

        this.mode = mNone;

        this.init();

        display.init( hack.countryCode );

        display.feature.clear();    
        
        display.reset();

        Control.playEffect("goMission.mp3");

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

        this.hImage = Meteor.subscribe("ghImage", function() { Session.set("sIReady", true ) });

        this.hText = Meteor.subscribe("ghText", function() { Session.set("sTReady", true ) });

        this.hSound = Meteor.subscribe("ghSound", function() { Session.set("sSReady", true ) });

        this.hVideo = Meteor.subscribe("ghVideo", function() { Session.set("sVReady", true ) });

        this.hWeb = Meteor.subscribe("ghWeb", function() { Session.set("sWReady", true ) });

        this.hMap = Meteor.subscribe("ghMap", function() { Session.set("sMReady", true ) });

        this.hDebrief = Meteor.subscribe("ghDebrief", function() { Session.set("sDReady", true ) });     
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

      map.selectedCountry = this.countryCode;

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

        map.selectedCountry = this.countryCode;

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

    this.getAnthemFile = function() {

      try {
          var rec = db.ghS.findOne( { cc: this.countryCode, dt: "ant" } );
      }
      catch(err) {

          showMessage( "No anthem file found for " + hack.getCountryName() );

          return null;
      }

      return rec.f;
    }

    this.getLanguageFile = function() {

      try {
          var rec = db.ghS.findOne( { cc: this.countryCode, dt: "lng" } );
      }
      catch(err) {

          showMessage( "No language file found for " + hack.getCountryName() );

          return null;
      }

      return rec.f;

    }

    this.getCapitalName = function() {

      return db.ghT.findOne( { cc: this.countryCode, dt: "cap" } ).f;
    }

    //to do: get rid of the capital images in debriefs

    this.getCapitalPic = function() {

      try {
          var rec = db.ghI.findOne( { cc: this.countryCode, dt: "cap" } );
      }
      catch(err) {

          showMessage( "No capital image file found images for " + hack.getCountryName() );

          return null;
      }

      if (rec) return rec.f;

      try {

          return db.ghD.findOne( { cc: this.countryCode, dt: "cap" } ).f;
      }
      catch(err) {

          showMessage( "No capital image file found in debriefs for " + hack.getCountryName() );

          return null;
      }
    }

    this.getContinentName = function() {

      var _code = db.getContinentCodeForCountry( this.countryCode ) ;

      return db.getContinentRec( _code ).n;
    }

    this.getCountryName = function() {

      var rec = db.getCountryRec( this.countryCode );

      return rec.n;
    }

    this.getCountryMapSource = function() {

      var rec = db.getCountryRec( this.countryCode );

      return rec.s;
    }

    this.getCountryFilename = function() {

      var _name = this.getCountryName();

      var name = _name.replaceAll(" ","_");

      return name.toLowerCase();
    }

    this.getCustomPic = function(_code) {

      var rec = db.ghI.findOne( { cc: this.countryCode, dt: _code } );

      if (rec) return rec.f;

      return db.ghD.findOne( { cc: this.countryCode, dt: _code } ).f;
    }

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

    this.getFlagPic = function() {

      try {
          var rec = db.ghI.findOne( { cc: this.countryCode, dt: "flg" } );
      }
      catch(err) {

          showMessage( "No flag file found for " + hack.getCountryName() );

          return "";
      }

      return rec.f;

    }

    //to do: get rid of hq pics in debrief

    this.getHeadquartersPic = function() {

      try {
          var rec = db.ghI.findOne( { cc: this.countryCode, dt: "hq" } );
      }
      catch(err) {

          showMessage( "No hq file found in images for " + hack.getCountryName() );

          return "";
      }

      return rec.f;

      try {
          var rec = db.ghD.findOne( { cc: this.countryCode, dt: "hq" } ).f;
      }
      catch(err) {

          showMessage( "No hq file found in debriefs for " + hack.getCountryName() );

          return "";
      }

    }

    this.getLeaderPic = function() {

      try {
          var rec = db.ghI.findOne( { cc: this.countryCode, dt: "ldr" } );
      }
      catch(err) {

          showMessage( "No leader file found in images for " + hack.getCountryName() );

          return "";
      }

      return rec.f;
    }

    this.getLeaderName = function() {

      return db.ghT.findOne( { cc: this.countryCode, dt: "ldr" } ).f;
    }

    this.getLeaderType = function() {

      return db.ghD.findOne( { cc: this.countryCode, dt: "ldr" } ).t;
    }

    this.getRegionName = function() {

      var _code = db.getRegionCodeForCountry( this.countryCode ) ;

      return db.getRegionRec( _code ).n;
    }


}

Hack.resetDataFlags = function() {

      Session.set("sIReady", false );

      Session.set("sSReady", false );

      Session.set("sTReady", false );

      Session.set("sVReady", false );

      Session.set("sWReady", false );

      Session.set("sDReady", false );

      Session.set("sMReady", false );

}

Tracker.autorun( function(comp) {

  if (Session.get("sIReady") && Session.get("sTReady") && Session.get("sVReady") && Session.get("sWReady") && Session.get("sSReady") && Session.get("sDReady") && Session.get("sMReady")) {

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







