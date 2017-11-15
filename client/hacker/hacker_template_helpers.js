
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});


Template.main.helpers({

    clue: function() {

        return hacker.clues.find();
    },

    helperAgentID: function() {

        return "h" + hacker.helper.ID;

    },

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

    isMeme: function( _name) {

       if (_name == "MEME") return true;

       return false;
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

    memeIsFeatured: function() {

      return hacker.memeIsFeatured.get();
    },

    youTubeWaiting: function() {

      return youtube.waiting.get();
    }

});

Template.main.events({

  'click .clsHelperAgentName': function(e) {

      e.preventDefault();  

      hacker.helper.showModal();

  },

  'click .clsHelperAgentTitle': function(e) {

      e.preventDefault();  

      hacker.helper.showModal();
  },

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
      
      if (hacker.feature.item.getName() == "VIDEO") hacker.suspendMedia();

      if (hacker.feature.item.getName() != "SOUND") game.playMusic();     

      hackMap.go();
  
    },


  'click img.clsHelperAgentButton': function(e) {

      e.preventDefault();

      $('img.clsHelperAgentButton').tooltip('destroy');

      hacker.helper.setText();

      Meteor.setTimeout( function() {

        $("img.clsHelperAgentButton").tooltip({ delay:0, placement:"left", trigger:"manual", title: hacker.helper.text.get() });

        $('img.clsHelperAgentButton').tooltip('show'); 

      }, 200);

        Meteor.setTimeout( function() { hacker.hideAgentHint(); }, 5000);

  },

  'click #scanButton': function(e) {

      e.preventDefault();

      hack.mode = mReady;
            
      if (hacker.loader.state == "pause") {

          if ( hacker.moreDataAvailable() == false ) {

              display.playEffect( hacker.locked_sound_file );

              hacker.setScanButtonImage( hacker.pauseControlPic );

              return; 
          }

          hacker.playSequence();
      }
      else {

          hacker.pauseSequence();
      }
    },

    'click img.featuredPic': function(e) {

      var _name = hacker.feature.item.getName();

      if (_name == "SOUND" || _name == "VIDEO") {

         Control.switchTo( _name );

         return;
      }

      FlowRouter.go("/closeup");

    },

    'click .control': function(e) {
      
      e.preventDefault();

      var _index = $( "#" + e.currentTarget.id).data("index");

      var _name =  $( "#" + e.currentTarget.id).data("name");

      Control.switchTo( _name, _index );
    },

});



function updateFeaturedContent() {

    //the calling function has already changed the index on the currently featured
    //control, so we just "switch" to that same control and that does the update

    var _name = hacker.feature.item.getName();

    hacker.feature.switchTo( _name )

    return;
}

Template.main.rendered = function () {

    stopSpinner();

    hacker.redraw();

//    hacker.doHeadlines();

    hacker.checkMainScreen();

c("starting news from main.rendered")
    hacker.news.start();
    

    if (hack.mode == mReady)  {

      if ( hacker.loader.state == "play") hacker.playSequence();

      if ( hacker.feature.off() ) {

        //hacker.scanner.show();

        //Meteor.setTimeout(function() { hacker.scanner.startIdle(); }, 502 ); 

        //hacker.TV.set( TV.scanPrompt );  
   
      }

    }

}

Template.main.onDestroyed(function () {

  c("hacker template destroryed")
});
