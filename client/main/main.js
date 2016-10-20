

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

Template.main.helpers({

    TVisVideo: function() {

        return display.TV.videoOn.get();
        
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


    imgHelperAgent: function() {

        return display.helper.pic.get();

    },

    helperAgentName: function() {

        return display.helper.name.get();

    },

    helperAgentText: function() {

        return display.helper.text.get();

    },

    helperAgentTitle: function() {

        return display.helper.title.get();

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

      if (!display.feature.ctl) return;

      if (display.feature.ctl.hasPrevItem() ) return "";

      return "invisible";
    },

    navButtonNextVisible: function() { 

      if (display.feature.off() ) return "invisible"; 

      if (!display.feature.ctl) return;

      if (display.feature.ctl.hasNextItem() ) return "";

      return "invisible";
    },

    status: function() {

      if (!hack) return;

      return hack.status;
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

      return youtube.waiting.get();
    }

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

      if ( display.moreDataAvailable() == false ) return; 

      $("#scanButton").attr("src", "./tvScannerGreen.png");

  },

  'mouseleave #scanButton': function(e) {

      e.preventDefault();  

      if ( display.moreDataAvailable() == false ) return; 

      $("img#scanButton").attr("src", "./tvScannerYellow.png");

  },

  'click #mapButton': function (e) { 

      e.preventDefault();  

      if ( $("#mapButton").hasClass("faded") ) {

          Control.playEffect( display.locked_sound_file );

          return; 
      }    
      
      if (display.feature.name.get() == "VIDEO") display.suspendMedia();

      if (display.feature.name.get() != "SOUND") game.playMusic();     

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

  'click #btnHelperAgent': function(e) {

      e.preventDefault();

      $('#btnHelperAgent').tooltip('destroy');

      display.helper.setText();

      Meteor.setTimeout( function() {

        $("#btnHelperAgent").tooltip({ delay:0, placement:"left", trigger:"manual", title: display.helper.text.get() });

        $('#btnHelperAgent').tooltip('show'); 

      }, 200);

  },

  'mouseleave #btnHelperAgent': function(e) {

      e.preventDefault();

      $('#btnHelperAgent').tooltip('hide');

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

      if ( display.moreDataAvailable() == false ) {

          Control.playEffect( display.locked_sound_file );

          return; 
      }

      display.feature.dim();

      Control.unhiliteAll();

      var mode = "rescan";

      if (display.loader.totalClueCount == 0) mode = "scan";

      display.suspendMedia();

      game.playMusic();

      display.scanner.startScan( mode );


    },

    'click img.featuredPic': function(e) {

      var _name = display.feature.getName();

      if (_name == "SOUND" || _name == "VIDEO") {

         Control.switchTo( _name );

         return;
      }

      FlowRouter.go("/closeup");

    },

    'click .control': function(e) {
      
      e.preventDefault();

      display.stopBlinking();

      Control.switchTo( e.currentTarget.id );
    },

    'click #divMiniDebrief': function(e) {

      e.preventDefault;

      if (display.feature.name.get() == "VIDEO") display.suspendMedia();

        display.feature.clear();

        hack.debrief.go();

        FlowRouter.go("/debrief");
    },

});


function updateFeaturedContent() {

    var _name = display.feature.getName();

    display.showFeaturedContent( _name  );

}

Template.main.rendered = function () {

    stopSpinner();

//???
    if (gEditLearnCountry) {

       FlowRouter.go("/learnCountry");

       return;
    }

    display.redraw();

    display.doHeadlines();

    display.checkMainScreen();

    //display.weather.start();


    if ( game.user.mode == uHack ) {


      //MAP is the only control that has the scanner visible when it's featured

       if (display.feature.on() ) {

          display.scanner.hide();

          display.feature.switch( display.feature.getName() );

          //opportunity to play a specific video / gif in the little scanner TV here

          //display.TV.playVideo( Database.getRandomFromRange(1,2) );             

        }       
    }

    if (hack.mode == mReady)  {

      if ( display.feature.off() ) {

        display.scanner.show();

        Meteor.setTimeout(function() { display.scanner.startIdle(); }, 502 ); 

        display.TV.set( TV.scanPrompt );  
   
      }

    }

}

