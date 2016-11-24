Template.meme.helpers({

  memeImage: function() {

    return display.browser.featuredMeme.image;
  },

  memeText: function()  {

      return display.browser.featuredMeme.text;
  }

});

Template.meme.events({

  'click img.memePicFrame': function(e) {

      e.preventDefault();  

      if (display.featuredMeme) {

          if (display.featuredMeme.returnRoute) {

            FlowRouter.go( display.featuredMeme.returnRoute);

            display.featuredMeme.returnRoute = "";

            return;
          }
      }

      if ( game.user.mode == uHack) {

          display.featuredMeme = hacker.feature.item.ctl.meme;

          display.featuredMeme.preloadImageForFeature( "/main");

          return;
      }

      if ( game.user.mode == uBrowseCountry) FlowRouter.go("/newBrowse");

  },

  });