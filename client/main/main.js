Session.set("sDateTime", false);

Template.main.helpers({

    getDateTime: function() {

      return (Session.get("sDateTime"));
    },

    control: function() {

        return Session.get("sCtlName");  //the array of controls
    },

    controlPic: function() {

        return game.display.ctl[ this ].getControlPic();
    },

    controlPicLeft: function() {

      return game.display.ctl[ this ].picFrame.left;
    },

    controlPicTop: function() {

      return game.display.ctl[ this ].picFrame.top;
    },

    controlPicWidth: function() {

      return game.display.ctl[ this ].picFrame.width;
    },

    controlPicHeight: function() {

      return game.display.ctl[ this ].picFrame.height;
    },

    //when a control is clicked, the background is hilited

    controlBackdrop: function(_name) {

      if (_name == game.display.feature.getName() ) return "hilitedBackdrop.jpg"

      return "featuredBackdrop.jpg";
    },

    isBrowseMode: function() {

      if (game.user.hack.mode == mBrowse) return true;

      return false;

    },

    opacityClass: function() {

      if (game.display.ctl[ this ].getState() <= sIcon) return "faded";

      return "";

    },

    opacityClassMap: function() {

      var _s = game.display.ctl[ this ].getState();  //any state change to a control will trigger this?

      if (game.display.loader.totalClueCount == 0) return "faded";

      return "";

    },

    navButtonPrevVisible: function() { 

      if (game.display.feature.off() ) return "invisible"; 

      if (game.display.feature.ctl.hasPrevItem() ) return "";

      return "invisible";
    },

    navButtonNextVisible: function() { 

      if (game.display.feature.off() ) return "invisible"; 

      if (game.display.feature.ctl.hasNextItem() ) return "";

      return "invisible";
    },

    status: function() {

      //little bit of a cheat here -- just using the global hack instead 
      //trying to differentiate between the global and the user 
      //(the headline object checks game.user.mode to get the right one)

      return hack.status;
    },

    TextIsDisplayed: function() {

        if (game.display.feature.getName() == "TEXT") return true;

        //if (game.display.feature.getName() == "MAP") return true;

        if (game.display.feature.displayMessage.get() ) return true;

        return false;
    },

    featuredAreaFont: function() {

        if (game.display.feature.displayMessage.get() ) return "featuredMessageFont";

        return "featuredTextFont";
    },


    displayTextContent: function() {

        if (game.display.feature.getName() == "TEXT") return game.display.ctl["TEXT"].getTextContent();       
    },

    textControlContent: function() { 

        return game.display.ctl["TEXT"].getTextContent();   
    },

    displayTextControlText: function() {

        if (this == "TEXT" && game.display.ctl["TEXT"].getState() >= sLoaded) return true;

        return false;
    },

    youTubeWaiting: function() {

      return game.display.ctl["VIDEO"].youTubeWaiting.get();
    },


    scannerNotVisible: function() {

      if ( game.display.scanner.visible.get() ) return false;

      return true;    
    },

    scannerNotLoaded: function() {

      if ( game.display.scanner.centerState.get() != "loaded" ) return true;

      return false;    
    },

    youTubeNotFeatured: function() {

      if (Session.get("sYouTubeOn") == true ) return false;

      return true;
    },

});

Template.main.events({

  'mouseenter #mapButton': function(e) {

      e.preventDefault();  

      if (game.display.loader.totalClueCount == 0) return;

      $("#mapButton").attr("src", "./newGlobeIconGreen.png");

  },

  'mouseleave #mapButton': function(e) {

      e.preventDefault();  

      $("#mapButton").attr("src", "./newGlobeIconYellow.png");

  },

  'mouseenter #scanButton': function(e) {

      e.preventDefault();  

      if ( $("img#scanButton").hasClass('faded') ) return;  //let-down sound here?

      $("#scanButton").attr("src", "./tvScannerGreen.png");

  },

  'mouseleave #scanButton': function(e) {

      e.preventDefault();  

      if ( $("img#scanButton").hasClass('faded') ) return;  //let-down sound here?

      $("img#scanButton").attr("src", "./tvScannerYellow.png");

  },

  'click #mapButton': function (e) { 

      e.preventDefault();  

      if ( $("#mapButton").hasClass("faded") ) {

          Control.playEffect( game.display.locked_sound_file );

          return; 
      }     
      
      game.display.feature.set("MAP");
  
    },

  'click img.navPrev': function(e) {

      e.preventDefault();

      var _index = game.display.feature.ctl.getIndex();

      game.display.feature.ctl.setIndex( _index - 1);

      updateFeaturedContent();
  },

  'click img.navNext': function(e) {

      e.preventDefault();

      var _index = game.display.feature.ctl.getIndex();

      game.display.feature.ctl.setIndex( _index + 1);

      updateFeaturedContent();
  },


  'click #scanButton': function(e) {

      e.preventDefault();

      game.display.stopBlinking();

      if (game.display.cue.state == sPlaying) {

          Control.playEffect( game.display.locked_sound_file );

          return;
      }

      if (game.display.scanner.mode == "scan" || game.display.scanner.mode == "rescan") {

          Control.playEffect( game.display.locked_sound_file );

          return;
      }

      if ( $("img#scanButton").hasClass('faded') ) {

          Control.playEffect( game.display.locked_sound_file );

          return; 
      }

      if (game.user.hack.mode == uBrowse) {

        var s = "";

        if (game.user.assign.pool.length == 0) {

          s = "You have finished your current mission.  Please choose another from the " + game.user.name + " menu.";

          alert( s );
        }
        
        else {
        
          s = "Resume mission " + game.user.assign.name + "?";

          var r = confirm( s );

          if (r == true) {

              hack.mode = mNone;

              game.user.assignAndStartMission( game.user.assignCode );
          }

        }

      }

      game.display.feature.dim();

      var mode = "rescan";

      if (game.display.loader.totalClueCount == 0) mode = "scan";

      if (gInstantMode) {

          game.display.loader.go();

          game.display.scanner.show();

          game.display.scanner.stopScan();
      }
      else {

        game.display.scanner.startScan( mode );

      }


//now loader.go() but called by startScan()
      //game.display.loader.doScan();

    },

    'click .control': function(e) {
      
      e.preventDefault();

      if (game.display.scanner.mode == "scan" || game.display.scanner.mode == "rescan") {

          Control.playEffect( game.display.locked_sound_file );

          return;
      }

      game.display.cue.set();

      var id = e.currentTarget.id;

      if ( game.display.ctl[ id ].getState() < sLoaded ) {

          Control.playEffect( game.display.locked_sound_file );

          return;
      }

      Control.playEffect( game.display.fb_sound_file );  

      var _name = game.display.feature.getName();

      //for the media controls, we are either clicking to toggle
      //the state (ctl is already active) 
      //or we are clicking to make active and play

      if ((id == "SOUND" && _name == "SOUND") || (id == "VIDEO" && _name == "VIDEO")) {
          
          game.display.feature.ctl.toggleMediaState(); 
       }
       else {

          if ((id == "SOUND") || (id == "VIDEO")) {

c("click control is setting media state to play")

            game.display.ctl[ id ].setState( sPlaying ); 
          }  
       }

      game.display.scanner.fadeOut( 250 );

      game.display.feature.set( id );

      game.display.feature.loadAgain( id );

      if (id == "VIDEO") {

        game.display.cue.setAndShow();
      }
      else {

        Meteor.setTimeout( function() { game.display.cue.type() }, 500);
      }
    },

    'click #divMiniDebrief': function(e) {

      e.preventDefault;

        game.display.feature.clear();

        game.debrief.set( game.debrief.index );

        FlowRouter.go("/debrief");
    }

});

function updateFeaturedContent() {

    var _name = game.display.feature.getName();
 
    if (_name == "VIDEO") {

      game.display.ctl["VIDEO"].playNewVideo();
    }
    else {

      if (game.user.hack.mode == mBrowse) {
      
        game.display.feature.load( _name );  //the imagesLoaded callback will update the screen

        return;
      }

      game.display.showFeaturedContent( _name  );
    }


}

Template.main.rendered = function () {

    if (game.display.mainTemplateReady == false) {

      game.display.mainTemplateReady = true;

      game.display.redraw();

      game.display.doHeadlines();

      game.display.checkMainScreen();


      if (game.user.hack.mode == mBrowse) {

          var _name = game.display.feature.getName();

          if (_name.length == 0) _name = "IMAGE";

          game.display.feature.set(_name);

          game.display.feature.loadAgain( _name );

          return;
      }

    
      if (hack.mode == mReady)  {

        if ( game.display.feature.off() ||  game.display.feature.getName() == "MAP") {    //(game.display.feature.on() && game.display.feature.getName() == "MAP")  ) {

          game.display.scanner.show();

          Meteor.setTimeout(function() { game.display.scanner.startIdle(); }, 502 );              
        }

      }

    }
}

