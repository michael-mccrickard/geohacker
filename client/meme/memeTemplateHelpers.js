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

      if ( game.user.mode == uBrowseCountry) FlowRouter.go("/newBrowse2");

  },

  'click #closeUpSource': function( e ) {

      e.preventDefault();  

      $('#sourceAttributionModal').modal('show');

      Meteor.setTimeout( function() {

        $("#s3PhotoURL").text( hacker.feature.item.imageFile);

        $("#photoSource").text( hacker.feature.item.source);        

      }, 500);
  }

  });