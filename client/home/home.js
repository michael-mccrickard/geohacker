//home.js

Template.home.helpers({

    homeContent: function() {

        return game.user.template.get();
    },

});

Template.home.events({

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uHack );

  },

  'click #divHomeStatsPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uStats );

  },

});
