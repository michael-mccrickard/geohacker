

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

Template.main.helpers({

    TVisVideo: function() {

        return hacker.TV.videoOn.get();
        
    },

    control: function() {

      return hacker.ctlName;
    },

    controlPic: function() {

        return hacker.ctl[ this ].getControlPic();
    },

    controlPicLeft: function() {

      return hacker.ctl[ this ].picFrame.left;
    },

    controlPicTop: function() {

      return hacker.ctl[ this ].picFrame.top;
    },

    controlPicWidth: function() {

      return hacker.ctl[ this ].picFrame.width;
    },

    controlPicHeight: function() {

      return hacker.ctl[ this ].picFrame.height;
    },


    imgHelperAgent: function() {

        return hacker.helper.pic.get();

    },

    helperAgentName: function() {

        return hacker.helper.name.get();

    },

    helperAgentText: function() {

        return hacker.helper.text.get();

    },

    helperAgentTitle: function() {

        return hacker.helper.title.get();

    },

    opacityClass: function() {

      if (hacker.ctl[ this ].getState() <= sIcon) return "faded";

      return "";

    },

    opacityClassMap: function() {

      var _s = hacker.ctl[ this ].getState();  //any state change to a control will trigger this?

      if (hacker.loader.totalClueCount == 0) return "faded";

      return "";

    },

    status: function() {

      if (!hack) return;

      return hack.status;
    },

    featuredAreaFont: function() {

        if (hacker.feature.displayMessage.get() ) return "featuredMessageFont";

        return "featuredTextFont";
    },


    displayTextContent: function() {

        if (hacker.feature.getName() == "TEXT") return hacker.ctl["TEXT"].getTextContent();       
    },

    textControlContent: function() { 

        return hacker.ctl["TEXT"].getTextContent();   
    },

    displayTextControlText: function() {

        if (this == "TEXT" && hacker.ctl["TEXT"].getState() >= sLoaded) return true;

        return false;
    },

    youTubeWaiting: function() {

      return youtube.waiting.get();
    }

});

Template.main.events({

  'mouseenter #mapButton': function(e) {

      e.preventDefault();  

      if (hacker.loader.totalClueCount == 0) return;

      $("#mapButton").attr("src", "./newGlobeIconGreen.png");

  },

  'mouseleave #mapButton': function(e) {

      e.preventDefault();  

      $("#mapButton").attr("src", "./newGlobeIconYellow.png");

  },

  'mouseenter #scanButton': function(e) {

      e.preventDefault();  

      if ( hacker.moreDataAvailable() == false ) return; 

      $("#scanButton").attr("src", "./tvScannerGreen.png");

  },

  'mouseleave #scanButton': function(e) {

      e.preventDefault();  

      if ( hacker.moreDataAvailable() == false ) return; 

      $("img#scanButton").attr("src", "./tvScannerYellow.png");

  },

  'click #mapButton': function (e) { 

      e.preventDefault();  

      if ( $("#mapButton").hasClass("faded") ) {

          display.playEffect( hacker.locked_sound_file );

          return; 
      }    
      
      if (hacker.feature.name == "VIDEO") hacker.suspendMedia();

      if (hacker.feature.name != "SOUND") game.playMusic();     

      hackMap.go();
  
    },

  'click img.navPrev': function(e) {

      e.preventDefault();

      var _index = hacker.feature.ctl.getIndex();

      hacker.feature.ctl.setIndex( _index - 1);

      updateFeaturedContent();
  },

  'click img.navNext': function(e) {

      e.preventDefault();

      var _index = hacker.feature.ctl.getIndex();

      hacker.feature.ctl.setIndex( _index + 1);

      updateFeaturedContent();
  },

  'click #btnHelperAgent': function(e) {

      e.preventDefault();

      $('#btnHelperAgent').tooltip('destroy');

      hacker.helper.setText();

      Meteor.setTimeout( function() {

        $("#btnHelperAgent").tooltip({ delay:0, placement:"left", trigger:"manual", title: hacker.helper.text.get() });

        $('#btnHelperAgent').tooltip('show'); 

      }, 200);

        Meteor.setTimeout( function() { hacker.hideAgentHint(); }, 5000);

  },

/*
  'mouseleave #btnHelperAgent': function(e) {

      e.preventDefault();

      $('#btnHelperAgent').tooltip('hide');

  },
*/

  'click #scanButton': function(e) {

      e.preventDefault();

      if (hacker.cue.state == sPlaying) {

          display.playEffect( hacker.locked_sound_file );

          return;
      }

      if (hacker.scanner.mode == "scan" || hacker.scanner.mode == "rescan") {

          display.playEffect( hacker.locked_sound_file );

          return;
      }

      if ( hacker.moreDataAvailable() == false ) {

          display.playEffect( hacker.locked_sound_file );

          return; 
      }

      hacker.feature.hideText();

      hacker.feature.dim();

      Control.unhiliteAll();

      Control.hideNavButtons();

      var mode = "rescan";

      if (hacker.loader.totalClueCount == 0) mode = "scan";

      hacker.suspendMedia();

      game.playMusic();

      hacker.scanner.startScan( mode );


    },

    'click img.featuredPic': function(e) {

      var _name = hacker.feature.getName();

      if (_name == "SOUND" || _name == "VIDEO") {

         Control.switchTo( _name );

         return;
      }

      FlowRouter.go("/closeup");

    },

    'click .control': function(e) {
      
      e.preventDefault();

      Control.switchTo( e.currentTarget.id );
    },

    'click #divMiniDebrief': function(e) {

      e.preventDefault;

      if (hacker.feature.name.get() == "VIDEO") hacker.suspendMedia();

        hacker.feature.clear();

        hack.debrief.go();

        FlowRouter.go("/debrief");
    },

});


function updateFeaturedContent() {

    var _name = hacker.feature.getName();

    hacker.showFeaturedContent( _name  );

}

Template.main.rendered = function () {

    stopSpinner();

    hacker.redraw();

    hacker.doHeadlines();

    hacker.checkMainScreen();

    hacker.weather.start();
    

    if (hack.mode == mReady)  {

      if ( hacker.feature.off() ) {

        hacker.scanner.show();

        Meteor.setTimeout(function() { hacker.scanner.startIdle(); }, 502 ); 

        hacker.TV.set( TV.scanPrompt );  
   
      }

    }

}

