Session.set("sDateTime", false);

Template.main.helpers({

    getDateTime: function() {

      return (Session.get("sDateTime"));
    },

    control: function() {

        return Session.get("sCtlName");  //the array of controls
    },

    controlPic: function() {

        return display.ctl[ this ].getControlPic();
    },

    controlPicLeft: function() {

      return display.ctl[ this ].picFrame.left;
    },

    controlPicTop: function() {

      return display.ctl[ this ].picFrame.top;
    },

    controlPicWidth: function() {

      return display.ctl[ this ].picFrame.width;
    },

    controlPicHeight: function() {

      return display.ctl[ this ].picFrame.height;
    },

    //when a control is clicked, the background is hilited

    controlBackdrop: function(_name) {

      if (_name == display.feature.getName() ) return "hilitedBackdrop.jpg"

      return "featuredBackdrop.jpg";
    },

    isBrowseMode: function() {

      if (game.user.hack.mode == mBrowse) return true;

      return false;

    },

    opacityClass: function() {

      if (display.ctl[ this ].getState() <= sIcon) return "faded";

      return "";

    },

    opacityClassMap: function() {

      var _s = display.ctl[ this ].getState();  //any state change to a control will trigger this?

      if (display.loader.totalClueCount == 0) return "faded";

      return "";

    },

    navButtonPrevVisible: function() { 

      if (display.feature.off() ) return "invisible"; 

      if (display.feature.ctl.hasPrevItem() ) return "";

      return "invisible";
    },

    navButtonNextVisible: function() { 

      if (display.feature.off() ) return "invisible"; 

      if (display.feature.ctl.hasNextItem() ) return "";

      return "invisible";
    },

    status: function() {

      //little bit of a cheat here -- just using the global hack instead 
      //trying to differentiate between the global and the user 
      //(the headline object checks game.user.mode to get the right one)

      return hack.status;
    },

    TextIsDisplayed: function() {

        if (display.feature.getName() == "TEXT") return true;

        //if (display.feature.getName() == "MAP") return true;

        if (display.feature.displayMessage.get() ) return true;

        return false;
    },

    featuredAreaFont: function() {

        if (display.feature.displayMessage.get() ) return "featuredMessageFont";

        return "featuredTextFont";
    },


    displayTextContent: function() {

        if (display.feature.getName() == "TEXT") return display.ctl["TEXT"].getTextContent();       
    },

    textControlContent: function() { 

        return display.ctl["TEXT"].getTextContent();   
    },

    displayTextControlText: function() {

        if (this == "TEXT" && display.ctl["TEXT"].getState() >= sLoaded) return true;

        return false;
    },

    youTubeWaiting: function() {

      return display.ctl["VIDEO"].youTubeWaiting.get();
    },


    scannerNotVisible: function() {

      if ( display.scanner.visible.get() ) return false;

      return true;    
    },

    scannerNotLoaded: function() {

      if ( display.scanner.centerState.get() != "loaded" ) return true;

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

      if (display.loader.totalClueCount == 0) return;

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

          Control.playEffect( display.locked_sound_file );

          return; 
      }     
      
      display.feature.set("MAP");
  
    },

  'click img.navPrev': function(e) {

      e.preventDefault();

      var _index = display.feature.ctl.getIndex();

      display.feature.ctl.setIndex( _index - 1);

      updateFeaturedContent();
  },

  'click img.navNext': function(e) {

      e.preventDefault();

      var _index = display.feature.ctl.getIndex();

      display.feature.ctl.setIndex( _index + 1);

      updateFeaturedContent();
  },


  'click #scanButton': function(e) {

      e.preventDefault();

      display.stopBlinking();

      if (display.cue.state == sPlaying) {

          Control.playEffect( display.locked_sound_file );

          return;
      }

      if (display.scanner.mode == "scan" || display.scanner.mode == "rescan") {

          Control.playEffect( display.locked_sound_file );

          return;
      }

      if ( $("img#scanButton").hasClass('faded') ) {

          Control.playEffect( display.locked_sound_file );

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

      display.feature.dim();

      var mode = "rescan";

      if (display.loader.totalClueCount == 0) mode = "scan";

      if (gInstantMode) {

          display.loader.go();

          display.scanner.show();

          display.scanner.stopScan();
      }
      else {

        display.scanner.startScan( mode );

      }


//now loader.go() but called by startScan()
      //display.loader.doScan();

    },

    'click .control': function(e) {
      
      e.preventDefault();

      if (display.scanner.mode == "scan" || display.scanner.mode == "rescan") {

          Control.playEffect( display.locked_sound_file );

          return;
      }

      display.cue.set();

      var id = e.currentTarget.id;

      if ( display.ctl[ id ].getState() < sLoaded ) {

          Control.playEffect( display.locked_sound_file );

          return;
      }

      Control.playEffect( display.fb_sound_file );  

      var _name = display.feature.getName();

      //for the media controls, we are either clicking to toggle
      //the state (ctl is already active) 
      //or we are clicking to make active and play

      if ((id == "SOUND" && _name == "SOUND") || (id == "VIDEO" && _name == "VIDEO")) {
          
          display.feature.ctl.toggleMediaState(); 
       }
       else {

          if ((id == "SOUND") || (id == "VIDEO")) {

c("click control is setting media state to play")

            display.ctl[ id ].setState( sPlaying ); 
          }  
       }

      display.scanner.fadeOut( 250 );

      display.feature.set( id );

      display.feature.loadAgain( id );

      if (id == "VIDEO") {

        display.cue.setAndShow();
      }
      else {

        Meteor.setTimeout( function() { display.cue.type() }, 500);
      }
    },

    'click #divMiniDebrief': function(e) {

      e.preventDefault;

        display.feature.clear();

        game.debrief.set( game.debrief.index );

        FlowRouter.go("/debrief");
    }

});

function updateFeaturedContent() {

    var _name = display.feature.getName();
 
    if (_name == "VIDEO") {

      display.ctl["VIDEO"].playNewVideo();
    }
    else {

      if (game.user.hack.mode == mBrowse) {
      
        display.feature.load( _name );  //the imagesLoaded callback will update the screen

        return;
      }

      display.showFeaturedContent( _name  );
    }


}

Template.main.rendered = function () {

    if (display.mainTemplateReady == false) {

      display.mainTemplateReady = true;

      display.redraw();

      display.doHeadlines();

      display.checkMainScreen();


      if (game.user.hack.mode == mBrowse) {

          var _name = display.feature.getName();

          if (_name.length == 0) _name = "IMAGE";

          display.feature.set(_name);

          display.feature.loadAgain( _name );

          return;
      }

    
      if (hack.mode == mReady)  {

        if ( display.feature.off() ||  display.feature.getName() == "MAP") {    //(display.feature.on() && display.feature.getName() == "MAP")  ) {

          display.scanner.show();

          Meteor.setTimeout(function() { display.scanner.startIdle(); }, 502 );              
        }

      }

    }
}

