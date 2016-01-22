Session.set("sDateTime", false);

Template.main.helpers({

    getDateTime: function() {

      return (Session.get("sDateTime"));
    },

    control: function() {

        return Session.get("sCtlName");  //the array of controls
    },

    controlPic: function() {

        if ( noDisplay() ) return;

        return display.ctl[ this ].getControlPic();
    },

    controlPicLeft: function() {

        if ( noDisplay() ) return;

      return display.ctl[ this ].picFrame.left;
    },

    controlPicTop: function() {

        if ( noDisplay() ) return;

      return display.ctl[ this ].picFrame.top;
    },

    controlPicWidth: function() {

        if ( noDisplay() ) return;

      return display.ctl[ this ].picFrame.width;
    },

    controlPicHeight: function() {

        if ( noDisplay() ) return;

      return display.ctl[ this ].picFrame.height;
    },

    //when a control is clicked, the background is hilited

    controlBackdrop: function(_name) {

        if ( noDisplay() ) return;

      if (_name == display.feature.getName() ) return "hilitedBackdrop.jpg"

      return "featuredBackdrop.jpg";
    },

    isBrowseMode: function() {

      if (!game.user) return;

      if (game.user.mode == uBrowse) return true;

      return false;

    },

    opacityClass: function() {

        if ( noDisplay() ) return;

      if (display.ctl[ this ].getState() <= sIcon) return "faded";

      return "";

    },

    opacityClassMap: function() {

        if ( noDisplay() ) return;

      var _s = display.ctl[ this ].getState();  //any state change to a control will trigger this?

      if (display.loader.totalClueCount == 0) return "faded";

      return "";

    },

    navButtonPrevVisible: function() { 

        if ( noDisplay() ) return;

      if (display.feature.off() ) return "invisible"; 

      if (!display.feature.ctl) return;

      if (display.feature.ctl.hasPrevItem() ) return "";

      return "invisible";
    },

    navButtonNextVisible: function() { 

        if ( noDisplay() ) return;

      if (display.feature.off() ) return "invisible"; 

      if (!display.feature.ctl) return;

      if (display.feature.ctl.hasNextItem() ) return "";

      return "invisible";
    },

    status: function() {

      if (!hack) return;

      return hack.status;
    },

    TextIsDisplayed: function() {

        if ( noDisplay() ) return;

        if (display.feature.getName() == "TEXT") return true;

        //if (display.feature.getName() == "MAP") return true;

        if (display.feature.displayMessage.get() ) return true;

        return false;
    },

    featuredAreaFont: function() {

        if ( noDisplay() ) return;

        if (display.feature.displayMessage.get() ) return "featuredMessageFont";

        return "featuredTextFont";
    },


    displayTextContent: function() {
      
        if ( noDisplay() ) return;

        if (display.feature.getName() == "TEXT") return display.ctl["TEXT"].getTextContent();       
    },

    textControlContent: function() { 

        if ( noDisplay() ) return;

        return display.ctl["TEXT"].getTextContent();   
    },

    displayTextControlText: function() {

        if ( noDisplay() ) return;

        if (this == "TEXT" && display.ctl["TEXT"].getState() >= sLoaded) return true;

        return false;
    },

    youTubeWaiting: function() {

        if ( noDisplay() ) return;

      return display.ctl["VIDEO"].youTubeWaiting.get();
    },


    scannerNotVisible: function() {

        if ( noDisplay() ) return;

      if ( display.scanner.visible.get() ) return false;

      return true;    
    },

    scannerNotLoaded: function() {

        if ( noDisplay() ) return;

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

      if (game.user.mode == uBrowse) {

          display.feature.browseMap();

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

      if (game.user.mode == uBrowse) {

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

              //game.user.assignAndStartMission( game.user.assignCode );

              game.user.resumeMission();
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

          console.log("click control is setting media state to play")

            display.ctl[ id ].setState( sPlaying ); 
          }  
       }

      display.scanner.fadeOut( 250 );

      display.feature.set( id );

      display.feature.loadAgain( id );  //this will set the imageSrc for the featured area

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

        //hack.debrief.set( hack.debrief.index );

        hack.debrief.goNext();

        FlowRouter.go("/debrief");
    }

});

function updateFeaturedContent() {

    var _name = display.feature.getName();
 
    if (_name == "VIDEO") {

      display.ctl["VIDEO"].playNewVideo();
    }
    else {

      if (game.user.mode == uBrowse) {
      
        display.feature.load( _name );  //the imagesLoaded callback will update the screen

        return;
      }

      display.showFeaturedContent( _name  );
    }
}

Template.main.rendered = function () {

    if (!display) return;

    if (display.mainTemplateReady == false) {

      display.mainTemplateReady = true;

      display.redraw();

      display.doHeadlines();

      display.checkMainScreen();


      if (game.user.mode == uBrowse) {

          display.scanner.hide();

          return;
      }


      if ( game.user.mode == uHack ) {

        //MAP is the only control that has the scanner visible when it's featured

         if (display.feature.on() && display.feature.getName() != "MAP") {

            display.scanner.hide();

            display.feature.set( display.feature.getName() );

            //if (display.feature.getName() == "VIDEO")  display.ctl["VIDEO"].show();

          }       
      }

      if (hack.mode == mReady)  {

        if ( display.feature.off() ||  display.feature.getName() == "MAP") {

          display.scanner.show();

          Meteor.setTimeout(function() { display.scanner.startIdle(); }, 502 );              
        }

      }

    }
}

