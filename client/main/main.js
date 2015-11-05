Session.set("sHackModeScanning", false);

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

      if (hack.mode == mBrowse) return true;

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

      return hack.status;
    },

    TextIsDisplayed: function() {

        if (display.feature.getName() == "TEXT") return true;

        if (display.feature.getName() == "MAP") return true;

        if (display.feature.displayMessage.get() ) return true;

        return false;
    },

    featuredAreaFont: function() {

        if (display.feature.displayMessage.get() ) return "featuredMessageFont";

        return "featuredTextFont";
    },


    displayTextContent: function() {

        if (display.feature.getName() == "MAP") return display.ctl["MAP"].getTextContent();  

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

    youTubeNotFeatured: function() {
return false;
      if (Session.get("sHackModeScanning") == true) return false;

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

      if (hack.mode == mBrowse) {

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

       if ( $("img#scanButton").hasClass('faded') ) {

          Control.playEffect( display.locked_sound_file );

          return; 
      }

      display.loader.doScan();

    },

    'click .control': function(e) {
      
      e.preventDefault();

      if (hack.mode == mScanning) {

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

        FlowRouter.go("/debrief");
    }

});

function updateFeaturedContent() {

    var _name = display.feature.getName();

    if (_name == "VIDEO") {

      display.ctl["VIDEO"].playNewVideo();
    }
    else {

      if (hack.mode == mBrowse) {
      
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



  //$("#scanScreen" ).velocity("fadeIn", { duration: 1000 })

  Meteor.defer(function() { positionScanElements(); } );  



    }
}

positionScanElements = function() {

    var fullBackdropWidth = $("img.featuredBackdrop").position().left + $("img.featuredBackdrop").outerWidth();

    var fullHeight = $("img.featuredBackdrop").position().top + $("img.featuredBackdrop").outerHeight();

c("top is " + $("img.featuredBackdrop").position().top)

c("height is " + $("img.featuredBackdrop").outerHeight())

c("ele height is " + $("div.scanLowerLeft").outerHeight())

    var horizSpacer = fullBackdropWidth * 0.01;

    var vertSpacer = fullHeight * 0.01;

   $("div.scanLowerLeft").css("left", $("img.featuredBackdrop").position().left + horizSpacer / 2 );

    $("div.scanLowerLeft").css("top", (fullHeight) - 64 - vertSpacer + "px" );

    $("div.scanLowerMiddle").css("left", (fullBackdropWidth/2) - $(".scanLowerMiddle").outerWidth() / 2 + "px");

    $("div.scanLowerMiddle").css("top", (fullHeight) - $("div.scanLowerMiddle").outerHeight() - vertSpacer  + "px" );

    $("div.scanLowerRight").css("left", (fullBackdropWidth * 0.995) - $("div.scanLowerRight").outerWidth() + "px");

    $("div.scanLowerRight").css("top", (fullHeight) - $("div.scanLowerRight").outerHeight() - vertSpacer  + "px" );

    $("img.imgScanGridGlobe").css("left", (fullBackdropWidth * 0.98) - $(".imgScanGridGlobe").outerWidth()  + "px");

    $("img.imgScanGridGlobe").css("top", (fullHeight * 0.40) - $(".imgScanGridGlobe").outerHeight() / 2 + "px" );

    $("div.divScanGridGlobe").css("left", (fullBackdropWidth * 0.99)  - $(".divScanGridGlobe").outerWidth() + "px");

    $("div.divScanGridGlobe").css("top", (fullHeight * 0.40) - $(".divScanGridGlobe").outerHeight() / 2 + "px" );

    $("div.divNormalGlobe").css("left", (fullBackdropWidth * 0.99) - $(".divNormalGlobe").outerWidth() + "px");

    $("div.divNormalGlobe").css("top", (fullHeight * 0.7) - $(".divNormalGlobe").outerHeight() / 2 + "px" ); 
}