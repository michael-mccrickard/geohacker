

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
  /********************************************/

this.debriefCollection = null;

  this.debrief = null;

  this.welcomeAgent = null;

  this.welcomeAgentIsChief = false;


//to do: change this to streamID throughout
  this.messageID = "(not set)";

  this.auto = false;

  this.index = -1;

   /********************************************/
  /*            FUNCTIONS        
  /*********************************************/

    this.startNew = function() {

        hacker.init( this.countryCode );

        game.user.assign.resetMap();

        this.welcomeAgent = null;

        this.welcomeAgentIsChief = false;

        this.mode = mReady;

        game.playMusic();

        hacker.feature.clear();

        hacker.loadMain();
    };


    this.startNext = function() {

        this.mode = mNone;

        hacker.suspendMedia();

        hacker.suspendBGSound();

        display.playEffect("goMission.mp3");

        this.init();

        FlowRouter.go("/waiting");

    };

    this.initForBrowse = function( _code) {

        this.mode = mBrowse;

        this.countryCode = _code;

        this.continentCode = db.getContinentCodeForCountry( _code );

        this.regionCode = db.getRegionCodeForCountry( _code );

        c( db.getCountryName( _code ) + ' was selected for browsing.');   

        this.index = Database.getIndexForCountryCode( _code );

        this.subscribeToData( _code );

        FlowRouter.go("/waiting");
    };

    this.initForLearn = function( _code) {

        //this.mode = mBrowse;

        this.countryCode = _code;

        this.continentCode = db.getContinentCodeForCountry( _code );

        this.regionCode = db.getRegionCodeForCountry( _code );

        this.subscribeToData( _code );
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

        this.cancelSubs();

        Meteor.call("setCountry", _code );

        Hack.resetDataFlags();

        //****************************************************************
        //                  SUBSCRIBE TO HACK DATA
        //****************************************************************

        this.imageSub = Meteor.subscribe("ghImage", function() { Session.set("sImageReady", true ) });

        this.soundSub = Meteor.subscribe("ghSound", function() { Session.set("sSoundReady", true ) });

        this.videoSub = Meteor.subscribe("ghVideo", function() { Session.set("sVideoReady", true ) });

        this.webSub = Meteor.subscribe("ghWeb", function() { Session.set("sWebReady", true ) });


       this.textSub =  Meteor.subscribe("ghText", function() { Session.set("sTextReady", true ) });

       this.debriefSub =  Meteor.subscribe("ghMeme", function() { Session.set("sDebriefReady", true ) });     

       this.agentsSub =  Meteor.subscribe("agentsInCountry", function() { Session.set( "sAgentsInCountryReady", true ) } );
    }

    this.cancelSubs = function() {

      if (!this.imageSub) return;

       this.imageSub.stop();
       this.soundSub.stop();
       this.videoSub.stop();
       this.webSub.stop();
       this.textSub.stop();
       this.debriefSub.stop();
       this.agentsSub.stop();

       Meteor.call("setCountry","");
    }

    this.autoHack = function() {

      this.auto = true;

      //you can auto-hack at anytime, even before the first clue

      if (game.hackStartTime == 0) game.hackStartTime = new Date().getTime();

      var map = hackMap.worldMap;

      hackMap.level.set( mlCountry );

      hackMap.setState( sMapDone );

      hackMap.worldMap.selectedContinent = this.continentCode;

      hackMap.worldMap.selectedRegion = this.regionCode;

      hackMap.worldMap.selectedCountry.set( this.countryCode );

      hackMap.go();

    }

    this.startBrowsing = function() {

        var map = browseMap.worldMap;

        map.selectedContinent = this.continentCode;

        map.selectedRegion = this.regionCode;

        map.selectedCountry.set( this.countryCode );

        browseMap.level.set( mlCountry );

        //display.browser.init( this.countryCode);

        display.browser = new Browser();

        display.browser.init( this.countryCode );

        FlowRouter.go("/newBrowse");

    }

    this.playAnthem = function() {

       var _file = this.getAnthemFile();

       if (hacker.ctl["SOUND"]) {

          if (hacker.ctl["SOUND"].getState() == sPlaying ) hacker.ctl["SOUND"].pause();
       }

       display.playEffect( _file );
    },

    this.playLanguageFile = function() {

       var _file = this.getLanguageFile();

       if (!_file) return;

       if (hack.mode != mEdit) {
          
          if (hacker.ctl["SOUND"].getState() == sPlaying ) hacker.ctl["SOUND"].pause();
       }

       display.playEffect( _file );
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

    this.getHomelandText = function() {

      return db.ghC.findOne( { c: this.countryCode } ).ht;
    }

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

      return db.ghMeme.findOne( { cc: this.countryCode, dt: "ldr" } ).t;
    }

    this.getRegionName = function() {

      var _code = db.getRegionCodeForCountry( this.countryCode ) ;

      return db.getRegionRec( _code ).n;
    }

    /**************************************************************/
    /*              MISC FUNCTIONS   
    /**************************************************************/

    this.setMessageID = function() {

        var id = '#' + getRandomString();

        this.messageID = id;
    }

   this.getWelcomeAgentFor = function( _countryID ) {

      return Meteor.users.findOne( { 'profile.cc': _countryID } );
   }

   this.getWelcomeAgent = function() {

      //when we have the title field implemented on the user records,
      //we'll return the GIC for the country


      if (!this.welcomeAgent) {

        this.welcomeAgent = Meteor.users.findOne( { 'profile.cc': this.countryCode, '_id': { $ne: Database.getChiefID()[0]  } } );
      }

      if (!this.welcomeAgent) {

        this.welcomeAgentIsChief = true;

        this.welcomeAgent = Meteor.users.findOne( { _id: Database.getChiefID()[0] } );
      }

      return this.welcomeAgent;

    }


}

Hack.resetDataFlags = function() {

      Session.set("sImageReady", false );

      Session.set("sSoundReady", false );

      Session.set("sTextReady", false );

      Session.set("sVideoReady", false );

      Session.set("sWebReady", false );

      Session.set("sDebriefReady", false );

}

Tracker.autorun( function(comp) {

  if (Session.get("sImageReady") && 
      Session.get("sTextReady") && 
      Session.get("sVideoReady") && 
      Session.get("sWebReady") && 
      Session.get("sSoundReady") && 
      Session.get("sDebriefReady") && 
      Session.get("sAgentsInCountryReady") 

      ) {

          console.log("hack data ready")

          Hack.resetDataFlags();

          hack.index = Database.getIndexForCountryCode( hack.countryCode );

          if (game.user.mode == uLearn) {

             game.lesson.updateContent();

            return;
          }

          if (game.user.mode == uBrowseCountry) {

            hack.startBrowsing();

            return;
          }

          if (!hack) return;

          hack.startNew();  

          return; 
  } 

  console.log("hack data not ready")

});  







