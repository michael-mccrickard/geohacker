//home.js

Template.home.rendered = function () {

c("home rendered")

  stopSpinner();

  //in the browse cases, we are returning from some other template,
  //so we need to call the user function that sets the content for this screen

  if (game.user.mode == uBrowseMap || game.user.mode == uBrowseCountry)  {

    game.user.returnFromBrowse();

    return;
  }

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


