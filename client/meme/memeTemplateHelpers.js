Template.meme.helpers({

  memeImage: function() {

    return display.browser.featuredMeme.image;
  },

  memeText: function()  {

      return display.browser.featuredMeme.text;
    },

});

Template.meme.events({

  'click img.memePicFrame': function(e) {

      e.preventDefault();  

      if ( game.user.mode == uBrowseCountry) FlowRouter.go("/newBrowse");

  },

  });