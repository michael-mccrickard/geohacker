//home.js

Template.home.rendered = function () {

c("home rendered")

  stopSpinner();

}

Template.home.helpers({

    homeContent: function() {

        return game.user.template.get();
    },

});

Template.home.events({

  'click #divHomeUser': function(e) {

      e.preventDefault();  

      Session.set("sProfiledUserID", Meteor.user()._id);

      game.user.setMode( uBio );

  },

  'click #divHomeLearnPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uLearn );

  },

  'click #divHomeHackPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uHack );

  },

  'click #divHomeAgentsPic': function(e) {

      e.preventDefault();  

      doSpinner();

      game.user.setMode( uAgents );

  },

  'click #divHomeStatsPic': function(e) {

      e.preventDefault();  

      game.user.setMode( uStats );

  },

  'click #divHomeClockOutPic': function(e) {

      e.preventDefault();  

      doSpinner();

      Meteor.setTimeout( function() { game.user.setMode( uClockOut ); }, 100 );

  },

  'click #divHomeMapPic': function(e) {

        e.preventDefault();  
      
        game.user.goBrowseMap();

        return;    
  },

});


