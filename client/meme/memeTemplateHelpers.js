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
return;
      if (display.featuredMeme) {

          if (display.featuredMeme.returnRoute) {

            FlowRouter.go( display.featuredMeme.returnRoute);

            display.featuredMeme.returnRoute = "";

            return;
          }
      }

      if ( game.user.mode == uHack) {

          display.featuredMeme = hacker.feature.item.ctl.meme;

          hacker.loader.pause();
            
          FlowRouter.go("closeup");
          
          Meteor.setTimeout( () => { stopSpinner() , 1000});

          display.featuredMeme.preloadImageForFeature( "/main");

          return;
      }


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

      hacker.pauseSequence();

      Meme.restoreControls();
  }


});