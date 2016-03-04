//home.js

Template.home.rendered = function () {

  stopWait();
}

Template.home.helpers({

    homeContent: function() {

        return game.user.template.get();
    },

});

Template.home.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      game.user.setMode( uBio );

  },

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uHack );

  },

  'click #divHomeAgentsPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uAgents );

  },

  'click #divHomeStatsPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uStats );

  },

  'click #divHomeClockOutPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uClockOut );

  },

  'click #divHomeMapPic': function(e) {

        e.preventDefault();  
      
        game.user.goBrowseMap();

        return;    
  },

});


