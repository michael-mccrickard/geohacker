

/**************************************************************/
/*              HACK OBJECT         
/**************************************************************/

Hack = function() {

   /********************************************/
  /*            BASIC PROPS        
  /*********************************************/

  this.mode = null;

  this.status = null;

  this.countryCode = "";

  this.continentCode = "";

  this.regionCode = "";

  /********************************************/
  /*            MISC PROPS        
  /*********************************************/

  this.debrief = null;

  this.mode = mNone;

  this.messageID = "(not set)";

  this.auto = false;

   /********************************************/
  /*            FUNCTIONS        
  /*********************************************/

    this.startNew = function() {

        if (display == null) {

          display = new Display();

        }

        display.init(this.countryCode);

        if (this.debrief == null) {

          this.debrief = new Debrief();
        }

        this.debrief.init();

        game.user.assign.resetMap();

        this.mode = mReady;

        game.playMusic();

        display.loadMain();
    };


    this.startNewFromMenu = function() {

        this.mode = mNone;

        mission.code = "";  //unset this in case user was browsing

        if (display == null) {

          display = new Display();

        }
        else {
          
          display.feature.clear();    
        
          display.reset();
        }

        this.init();

        Control.playEffect("goMission.mp3");

        FlowRouter.go("/waiting");

    };

    this.init = function() {

        this.auto = false;

        game.hackStartTime = 0;

        game.hackEndTime = 0;

        var rec = null;

        //are we browsing a particular country?

        if (mission.code == "browse") {

            this.countryCode = mission.browseCode;

            this.continentCode = db.getContinentCodeForCountry( this.countryCode );

            this.regionCode = db.getRegionCodeForCountry( this.countryCode );

            c(this.countryCode + ' was preselected for browsing.');

        } 
        else {

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
        }

        Meteor.call("setCountry", hack.countryCode);

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

        this.setMessageID();


    },

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

        if (display == null) {

          display = new Display();
        }

        if (this.debrief == null) {

          this.debrief = new Debrief();
        }

        this.debrief.init();

        var map = display.ctl["MAP"].browseWorldMap;

        map.selectedContinent = this.continentCode;

        map.selectedRegion = this.regionCode;

        map.selectedCountry = this.countryCode;

        display.ctl["MAP"].level.set( mlCountry );

        //display.browse will init the display object itself

        display.browse(this.countryCode);

    }

    this.playAnthem = function() {

       var _file = this.getAnthemFile();

       if (display.ctl["SOUND"].getState() == sPlaying ) display.ctl["SOUND"].pauseFeaturedContent();

       Control.playEffect( _file );
    },

    this.playLanguageFile = function() {

       var _file = this.getLanguageFile();

       if (display.ctl["SOUND"].getState() == sPlaying ) display.ctl["SOUND"].pauseFeaturedContent();

       Control.playEffect( _file );
    },


/**************************************************************/
/*              GETTERS FOR CURRENT COUNTRY PROPERTIES          
/**************************************************************/

    this.getAnthemFile = function() {

      return db.ghS.findOne( { cc: this.countryCode, dt: "ant" } ).f;
    }

    this.getLanguageFile = function() {

      return db.ghS.findOne( { cc: this.countryCode, dt: "lng" } ).f;
    }

    this.getCapitalName = function() {

      return db.ghT.findOne( { cc: this.countryCode, dt: "cap" } ).f;
    }

    this.getCapitalPic = function() {

      var rec = db.ghI.findOne( { cc: this.countryCode, dt: "cap" } );

      if (rec) return rec.f;

      return db.ghD.findOne( { cc: this.countryCode, dt: "cap" } ).f;
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

      if (db.ghI.findOne( { cc: this.countryCode, dt: "flg" } ) != undefined ) {

        return db.ghI.findOne( { cc: this.countryCode, dt: "flg" } ).f;
      }

      return "";
    }

    this.getHeadquartersPic = function() {

      var rec = db.ghI.findOne( { cc: this.countryCode, dt: "hq" } );

      if (rec) return rec.f;

      return db.ghD.findOne( { cc: this.countryCode, dt: "hq" } ).f;

    }

    this.getLeaderPic = function() {

      return db.ghI.findOne( { cc: this.countryCode, dt: "ldr" } ).f;
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

          if (hack === undefined) return;

          if (hack.mode == mBrowse) {

            hack.startBrowsing();

          }
          else {

            hack.startNew();           
          }

          return; 
  } 

  console.log("hack data not ready")

});  







