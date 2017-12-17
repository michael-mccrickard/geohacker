Template.meme.helpers({

  memeImage: function() {

    return display.browser.featuredMeme.image;
  },

  memeText: function()  {

      return display.browser.featuredMeme.text;
  },

  isCloseUp: function() {

    var _name = FlowRouter.current().route.name;

    if (_name == "meme") return true;

    return false;
  }

});

Template.meme.events({

  'click img.memePicFrame': function(e) {

      e.preventDefault(); 

      //is there a featured meme already in closeup mode? 

      if (display.featuredMeme) {

          if (display.featuredMeme.returnRoute) {

            FlowRouter.go( display.featuredMeme.returnRoute);

            display.featuredMeme.returnRoute = "";

            return;
          }
      }


      //if we made it this far, we are either hacking or browsing

      if ( game.user.mode == uHack) {

          if (hacker.loader.state == "play") hacker.autoPauseSequence();  //we are leaving the screen, so consider this a temporary pause

          display.featuredMeme = hacker.feature.item.ctl.meme;

          display.featuredMeme.preloadImageForFeature( "/main");

          return;
      }

      if ( game.user.mode == uBrowseCountry) FlowRouter.go("/newBrowse2");

  },

  'click #closeUpSource': function( e ) {

      e.preventDefault();  

      display.goToImageSource(); 
  },

  'click .questionButton':  function( e ) {

      e.preventDefault();  

      display.showPhotoClaimForm(); 

  },

  'click .memeCloseButton':  function( e ) {

      e.preventDefault();  

      hacker.feature.hide();

      if (hacker.loader.state == "play") hacker.pauseSequence();

      Meme.restoreControls();
  }


});
